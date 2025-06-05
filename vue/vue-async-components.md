# Vue异步组件

## 目录
- [定义与基本概念](#定义与基本概念)
- [异步组件的三种形式](#异步组件的三种形式)
  - [工厂函数异步组件](#工厂函数异步组件)
  - [Promise 异步组件](#promise-异步组件)
  - [高级异步组件](#高级异步组件)
- [核心解析流程](#核心解析流程)
- [状态管理与强制更新](#状态管理与强制更新)
- [占位节点处理](#占位节点处理)

## 定义与基本概念

在大型Vue应用中，异步组件允许将应用分割成按需加载的代码块。Vue通过工厂函数方式定义异步组件，只有在需要渲染时才会触发加载，并缓存结果供后续使用。

典型应用场景：
```javascript
// 路由懒加载
{
  path: '/list',
  component: () => import('@/views/list.vue')
}
```


## 异步组件的三种形式

### 工厂函数异步组件

```javascript
Vue.component('async-example', function(resolve, reject) {
  // 模拟API请求
  setTimeout(() => {
    // 成功时调用resolve
    resolve({
      template: '<div>我是异步加载的内容</div>',
      data() {
        return { message: 'Hello from async component' }
      }
    })
    
    // 失败时调用reject
    // reject(new Error('加载失败'))
  }, 1000)
})

// 使用方式
<template>
  <async-example v-if="showAsync" />
</template>
```

### Promise 异步组件
```javascript
// 基本形式
Vue.component(
  'async-webpack-example',
  () => import('./MyAsyncComponent.vue')
)

// 带错误处理的增强形式
Vue.component('async-with-error-handling', () => (
  import('./MyComponent.vue')
    .then(component => component)
    .catch(error => {
      console.error('组件加载失败:', error)
      return {
        template: '<div>加载失败，请重试</div>'
      }
    })
))
```

### 高级异步组件
```javascript
const AsyncComponent = () => ({
  // 实际加载的组件（Promise）
  component: import('./MyComponent.vue'),
  
  // 加载中显示的组件
  loading: {
    template: '<div class="loading-spinner">加载中...</div>'
  },
  
  // 加载失败显示的组件
  error: {
    template: '<div class="error-message">加载失败</div>'
  },
  
  // 延迟显示loading的时间（ms）
  delay: 200,
  
  // 超时时间（ms）
  timeout: 3000
})

// 注册组件
Vue.component('advanced-async', AsyncComponent)
```


## 核心解析流程

### createComponent 入口
```javascript
export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
) {
  // 异步组件处理
  if (isUndef(Ctor.cid)) {
    const asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    
    // 返回占位节点
    if (Ctor === undefined) {
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }
  // ...其他处理
}
```

### resolveAsyncComponent 核心逻辑
```javascript
export function resolveAsyncComponent(
  factory: Function,
  baseCtor: Class<Component>
) {
  // 1. 检查错误状态
  if (isTrue(factory.error)) {
    return factory.errorComp
  }
  
  // 2. 检查是否已解析
  if (isDef(factory.resolved)) {
    return factory.resolved
  }
  
  // 3. 检查加载状态
  if (isTrue(factory.loading)) {
    return factory.loadingComp
  }
  
  // 4. 执行工厂函数
  const res = factory(resolve, reject)
  
  // 5. 处理返回结果
  if (isPromise(res)) {
    res.then(resolve, reject)
  } else if (isPromise(res.component)) {
    // 高级组件处理
    res.component.then(resolve, reject)
    
    // 设置loading组件
    if (res.delay === 0) {
      factory.loading = true
    } else {
      setTimeout(() => {
        if (!factory.resolved && !factory.error) {
          factory.loading = true
          forceRender()
        }
      }, res.delay || 200)
    }
    
    // 设置超时处理
    if (res.timeout) {
      setTimeout(() => {
        if (!factory.resolved) {
          reject('timeout')
        }
      }, res.timeout)
    }
  }
  
  return factory.loading ? factory.loadingComp : factory.resolved
}
```

## 状态管理与强制更新

异步组件状态转换流程：
<div>
  <img src="./imgs/vue-async-components/state-diagram.png" width="400" height="300" />
<div> 


强制更新机制：
```javascript
function forceRender() {
  // 遍历所有等待该组件的实例
  for (const owner of factory.owners) {
    owner.$forceUpdate()
  }
  
  // 清理计时器
  clearTimeout(loadingTimer)
  clearTimeout(timeoutTimer)
}
```


##  占位节点处理
当组件未加载完成时，Vue会创建注释节点作为占位符：
```javascript
export function createAsyncPlaceholder(
  factory: Function,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag: ?string
) {
  const node = createEmptyVNode()
  node.asyncFactory = factory
  node.asyncMeta = { 
    data, 
    context, 
    children, 
    tag 
  }
  return node
}
```


## 最佳实践

合理设置延迟时间：
```javascript
delay: 200 // 快速网络可设为100-200ms
```

必加错误处理：
```javascript
error: {
  template: '<div>加载失败<button @click="retry">重试</button></div>',
  methods: {
    retry() { window.location.reload() }
  }
}
```

配合webpack魔法注释：

```javascript
component: import(/* webpackChunkName: "my-component" */ './MyComponent.vue')
```

性能优化建议：

```javascript
// 预加载策略
const PreloadComponent = () => ({
  component: import(/* webpackPrefetch: true */ './HeavyComponent.vue'),
  delay: 500
})
```

SSR兼容处理：
```javascript
// server-side
if (process.server) {
  component: require('./MyComponent.vue').default
}
// client-side
else {
  component: import('./MyComponent.vue')
}
```

完整示例代码仓库：vue-async-components-demo