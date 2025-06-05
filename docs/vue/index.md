# Vue.js 完全指南

## 目录
1. [Vue.js 基础](#vuejs-基础)
2. [核心概念](#核心概念)
3. [组件系统](#组件系统)
4. [状态管理](#状态管理)
5. [路由管理](#路由管理)
6. [Vue 3 新特性](#vue-3-新特性)
7. [性能优化](#性能优化)

## Vue.js 基础

### 什么是 Vue.js
Vue.js 是一个渐进式的 JavaScript 框架，用于构建用户界面。它被设计为可以自底向上逐层应用。

### 安装与配置
1. CDN 引入
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

2. NPM 安装
```bash
npm install vue@next
```

3. 创建 Vue 项目
```bash
npm create vue@latest
```

### 基本语法
1. 模板语法
```vue
<template>
  <div>
    <!-- 文本插值 -->
    <p>{{ message }}</p>
    
    <!-- 指令 -->
    <p v-if="seen">现在你看到我了</p>
    <a v-bind:href="url">链接</a>
    <button v-on:click="doSomething">点击</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
      seen: true,
      url: 'https://vuejs.org'
    }
  },
  methods: {
    doSomething() {
      console.log('按钮被点击')
    }
  }
}
</script>
```

## 核心概念

### 响应式系统
1. 数据响应式
```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>
```

2. 计算属性
```vue
<template>
  <div>
    <p>原始消息: {{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello'
    }
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  }
}
</script>
```

### v-model 双向绑定
```vue
<template>
  <div>
    <input v-model="message" placeholder="请输入">
    <p>输入的内容是：{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  }
}
</script>
```

### 生命周期钩子
```vue
<script>
export default {
  data() {
    return {
      message: 'Hello'
    }
  },
  beforeCreate() {
    console.log('实例创建之前')
  },
  created() {
    console.log('实例创建完成')
  },
  beforeMount() {
    console.log('挂载之前')
  },
  mounted() {
    console.log('挂载完成')
  },
  beforeUpdate() {
    console.log('更新之前')
  },
  updated() {
    console.log('更新完成')
  },
  beforeUnmount() {
    console.log('卸载之前')
  },
  unmounted() {
    console.log('卸载完成')
  }
}
</script>
```

## 组件系统

### 组件基础
1. 组件注册
```vue
<!-- 全局组件 -->
<script>
const app = createApp({})
app.component('my-component', {
  template: '<div>全局组件</div>'
})
</script>

<!-- 局部组件 -->
<script>
import ChildComponent from './ChildComponent.vue'

export default {
  components: {
    ChildComponent
  }
}
</script>
```

2. 组件通信
```vue
<!-- 父组件 -->
<template>
  <div>
    <child-component
      :prop-message="message"
      @custom-event="handleEvent"
    />
  </div>
</template>

<!-- 子组件 -->
<template>
  <div>
    <p>{{ propMessage }}</p>
    <button @click="emitEvent">触发事件</button>
  </div>
</template>

<script>
export default {
  props: {
    propMessage: String
  },
  emits: ['custom-event'],
  methods: {
    emitEvent() {
      this.$emit('custom-event', '子组件数据')
    }
  }
}
</script>
```

### 高级组件
1. 动态组件
```vue
<template>
  <component :is="currentComponent"></component>
</template>

<script>
export default {
  data() {
    return {
      currentComponent: 'component-a'
    }
  }
}
</script>
```

2. 异步组件
```vue
<script>
const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
)
</script>
```

## 状态管理

### Vuex
1. 基本使用
```javascript
// store/index.js
import { createStore } from 'vuex'

export default createStore({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})
```

2. 在组件中使用
```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount'])
  },
  methods: {
    ...mapMutations(['increment'])
  }
}
</script>
```

### Pinia (Vue 3)
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  },
  getters: {
    doubleCount: (state) => state.count * 2
  }
})
```

## 路由管理

### Vue Router
1. 基本配置
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

2. 路由导航
```vue
<template>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
  </nav>
  <router-view></router-view>
</template>
```

## Vue 3 新特性

### Composition API
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

### Teleport
```vue
<template>
  <teleport to="body">
    <div class="modal">
      <h2>模态框</h2>
      <p>这是一个使用 Teleport 的模态框</p>
    </div>
  </teleport>
</template>
```

### Suspense
```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

## 性能优化

### 代码分割
```javascript
// 路由懒加载
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
]
```

### 虚拟列表
```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="32"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="user">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>
```

### 缓存组件
```vue
<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
</template>
```

### 性能监控
```javascript
// 性能标记
export default {
  mounted() {
    performance.mark('component-mounted')
    // 组件逻辑
    performance.measure('component-render', 'component-mounted')
  }
}
```