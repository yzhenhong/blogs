### **v-model**



原理：v-model本质上是一个语法糖。例如在inpu中，就是value属性和input事件的合写。

v-model 是一个用于实现表单元素和组件双向数据绑定的指令。

核心作用是将表单输入的值与 Vue 实例的数据属性进行动态绑定，当用户修改输入时，数据会自动更新，反之亦然。


一、基本用法

v-model 常用于表单元素（如 input、textarea、select），直接绑定一个数据属性：



``` 
<template>
  <input v-model="message" placeholder="输入内容">
  <p>输入的内容是：{{ message }}</p>
</template>
 
<script>
export default {
  data() {
    return {
      message: ""
    };
  }
};
</script>
```





二、v-model 的原理

v-model 是语法糖，底层基于 value 属性 + input 事件 实现双向绑定。例如，上述代码等价于：


```
<input 
  :value="message" 
  @input="message = $event.target.value"
>
```





 


 

### **Vue双向绑定原理**







采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

 

#### **总结：**

1.vue首先通过Observer类，使用Object.defineProperty方法包装了数据，使object变成一个具有getter/setter属性的数据。

 

读取数据的时候通过getter方法读取，并在getter方法里面调用了Dep模块的dep.depend()方法收集依赖，并为该依赖创建一个对应的watcher实例。

 

通过setter方法改变数据的时候调用了Dep模块的dep.notify()方法来通知依赖，即依赖对应的watcher实例，遍历所有的watcher实例。

 

2.watcher实例不直接更新视图，而是交给scheduler调度器，scheduler维护一个事件队列通过nextTick执行事件，从而更新视图。

3.Compiler解析指令和模板，和Observer是同时进行的，将节点实例化后，将实例保存在Dep中，当Watcher 观察者发现数据变化通知视图更新。

### **Vue 2和3的区别**

#### **Vue3 的 Diff 优化策略**

**补丁标志（Patch Flags）**

在编译阶段分析模板，为动态绑定的节点添加标记（如 TEXT、CLASS、PROPS），标记其动态部分类型。

效果：Diff 时只需检查标记的动态属性，跳过静态内容。



```
// 编译后的 VNode（动态 class 和 text）
createVNode("div", {
  class: _normalizeClass({ active: isActive }),
  text: dynamicText
}, null, 3 /* CLASS, TEXT */);  // 补丁标志：3 = 1 (CLASS) + 2 (TEXT)
 
```





**静态提升（Static Hoisting）**

将静态节点（无动态绑定）提取到渲染函数外部，避免重复创建 VNode。

效果：减少内存占用和 Diff 时的比对次数。



```
// 静态节点提升到外部
const _hoisted = createVNode("div", null, "Static Content");
 
function render() {
  return (_openBlock(), _createBlock(_hoisted));
}
 
```





#### **Tree-shaking 支持：按需打包优化**

**1. 实现机制**

模块化拆分：将 Vue 功能拆分为独立模块（如 v-model、transition、keep-alive）。ES Module 输出：构建工具（如 Webpack、Rollup）可静态分析依赖关系。

**2. 效果对比**

| **场景**     | **Vue2**     | **Vue3**           |
| ------------ | ------------ | ------------------ |
| 全量引入     | ~20KB (全量) | ~12KB (核心运行时) |
| 使用部分功能 | 全量包含     | 仅打包使用到的模块 |

####  

#### **Fragment（多根组件）**

​                ● Vue2 限制：组件模板必须单根节点，导致冗余包裹元素。

​                ● Vue3 改进：支持多根节点，减少 DOM 层级。



```
<!-- Vue3 合法模板 -->
<template>
  <header>导航栏</header>
  <main>内容区</main>
  <footer>页脚</footer>
</template>
```





#### **Teleport（传送门）**

​                ● 功能：将组件渲染到 DOM 任意位置（如全局弹窗）。

​                ● 场景：解决样式隔离或 DOM 嵌套限制问题。



```
<template>
  <teleport to="body">
    <div class="modal">模态框内容</div>
  </teleport>
</template>
```





#### **Suspense（异步组件）**

​                ● 功能：优雅处理异步组件加载状态。

​                ● 场景：数据请求、动态导入组件时的加载中/错误状态。

 



```
<template>
  <suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </suspense>
</template>
```