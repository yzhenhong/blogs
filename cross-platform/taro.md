# Taro 完全指南

## 目录
1. [Taro 基础](#taro-基础)
2. [页面与路由](#页面与路由)
3. [组件系统](#组件系统)
4. [API 能力](#api-能力)
5. [条件编译](#条件编译)
6. [状态管理](#状态管理)
7. [打包发布](#打包发布)
8. [工程化实践](#工程化实践)
9. [常见问题](#常见问题)

## Taro 基础

### 什么是 Taro
Taro 是由京东开源的多端统一开发框架，使用 React/Vue 语法，一套代码可编译到微信小程序、H5、React Native、支付宝小程序等多个平台。

### 安装与创建项目
```bash
npm install -g @tarojs/cli
taro init my-app
# 选择框架（React/Vue3）、模板、TypeScript
```

### 目录结构
```
my-app/
├── src/
│   ├── pages/
│   │   └── index/
│   │       ├── index.tsx
│   │       └── index.scss
│   ├── components/
│   ├── app.tsx         # 入口组件
│   ├── app.scss
│   └── app.config.ts   # 全局配置
├── config/
│   ├── index.js        # 通用配置
│   ├── dev.js
│   └── prod.js
└── package.json
```

## 页面与路由

### app.config.ts
```ts
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/detail/detail',
  ],
  tabBar: {
    list: [
      { pagePath: 'pages/index/index', text: '首页' },
      { pagePath: 'pages/profile/profile', text: '我的' },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro App',
  },
})
```

### 页面配置
```ts
// pages/index/index.config.ts
export default definePageConfig({
  navigationBarTitleText: '首页',
  enablePullDownRefresh: true,
})
```

### 路由导航
```tsx
import Taro from '@tarojs/taro'

Taro.navigateTo({ url: '/pages/detail/detail?id=1' })
Taro.redirectTo({ url: '/pages/index/index' })
Taro.switchTab({ url: '/pages/index/index' })
Taro.navigateBack({ delta: 1 })
```

### 页面生命周期
```tsx
import { useLoad, useReady, useDidShow, useReachBottom } from '@tarojs/taro'

const Index = () => {
  useLoad((options) => {
    console.log('页面加载：', options)
  })

  useReady(() => {
    console.log('页面准备就绪')
  })

  useDidShow(() => {
    console.log('页面显示')
  })

  useReachBottom(() => {
    // 触底加载更多
  })

  return <View>首页</View>
}
```

## 组件系统

### 内置组件
```tsx
import { View, Text, Image, Button, Input, ScrollView } from '@tarojs/components'

const Demo = () => (
  <View className="container">
    <Text className="title">标题</Text>
    <Image src="/assets/logo.png" mode="aspectFit" />
    <Button type='primary' onClick={() => console.log('click')}>按钮</Button>
    <ScrollView scrollY className="list">
      <View>列表项</View>
    </ScrollView>
  </View>
)
```

### NutUI（京东组件库）
```bash
npm install @nutui/nutui-taro
```

```tsx
import { Button, Cell, Toast } from '@nutui/nutui-taro'

const Demo = () => (
  <View>
    <Cell title="标题" desc="描述" />
    <Button type='primary'>主要按钮</Button>
  </View>
)
```

## API 能力

### 网络请求
```ts
import Taro from '@tarojs/taro'

function request<T>(options: Taro.request.Option): Promise<T> {
  return new Promise((resolve, reject) => {
    Taro.request({
      ...options,
      header: { Authorization: `Bearer ${getToken()}` },
      success: (res) => resolve(res.data as T),
      fail: reject,
    })
  })
}
```

### 存储
```ts
Taro.setStorageSync('key', 'value')
const value = Taro.getStorageSync('key')
Taro.removeStorageSync('key')
```

## 条件编译

```tsx
// 方式一：process.env.TARO_ENV
if (process.env.TARO_ENV === 'weapp') {
  console.log('微信小程序')
} else if (process.env.TARO_ENV === 'h5') {
  console.log('H5')
}

// 方式二：JSX 条件渲染
const Demo = () => (
  <View>
    {process.env.TARO_ENV === 'weapp' && <View>微信专属内容</View>}
    {process.env.TARO_ENV === 'h5' && <div>H5 专属内容</div>}
  </View>
)
```

## 状态管理

### Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

```ts
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => { state.value += 1 },
  },
})

export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
})
```

## 打包发布

```bash
# 微信小程序
npm run dev:weapp
npm run build:weapp

# H5
npm run dev:h5
npm run build:h5

# React Native
npm run dev:rn

# 支付宝小程序
npm run dev:alipay
npm run build:alipay
```

### 微信小程序发布
```
1. npm run build:weapp
2. 微信开发者工具打开 dist/ 目录
3. 点击"上传"，填写版本号和备注
4. 微信公众平台 -> 版本管理 -> 审核发布
```

## 工程化实践

### 使用跨端组件和 API

Taro 页面应优先使用 `@tarojs/components` 和 `@tarojs/taro`。直接使用 DOM、浏览器路由或只支持 React DOM 的组件库，通常只能在 H5 工作。

```tsx
import { Button, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

export const SaveAction = () => (
  <View>
    <Button onClick={() => Taro.setStorageSync('draft', 'content')}>
      保存草稿
    </Button>
  </View>
)
```

### 管理平台差异

少量差异可使用 `process.env.TARO_ENV` 或平台文件，例如 `camera.weapp.ts` 与 `camera.h5.ts`。差异较大时，将平台实现放进独立适配器，避免组件里出现多层条件判断。

### 页面与组件设计

- 页面配置放在同名 `.config.ts` 中，避免运行时动态修改静态配置
- 组件属性保持可序列化，不传递 DOM 节点等平台专属对象
- CSS 先使用各端共同支持的能力，再做平台覆盖
- 列表项保持稳定 key，长列表使用分页、虚拟列表或目标端优化组件
- 页面隐藏时停止轮询、定位和不必要的计时器

### 请求封装

请求层应统一超时、鉴权、错误结构和登录失效处理，但不要让多个并发 401 同时触发多次登录。文件上传、下载与普通 JSON 请求的进度和取消机制应分开设计。

### 构建与测试

每个正式支持的平台都应进入 CI 构建。单元测试覆盖共享业务逻辑，核心页面用对应平台的开发者工具和真机验证；最终回归必须基于生产构建，而不是 `dev` 产物。

## 常见问题

### 为什么普通 React 组件不能直接使用

很多 React 组件库依赖 DOM、CSSOM 或浏览器事件模型，小程序中不存在这些能力。选择组件库时要明确它是否支持目标 Taro 版本和目标端，而不只是“支持 React”。

### H5 和小程序样式不一致

检查单位转换、默认组件样式、CSS 选择器支持范围和安全区域。复杂样式应在每个目标端验证，不要只看 H5 开发服务器。

### 页面生命周期执行次数不符合预期

区分组件的 React 生命周期与 Taro 页面生命周期。页面重新显示会触发 `useDidShow`，但不一定重新挂载组件；初始化逻辑和每次显示都要执行的刷新逻辑应分开。

### 依赖升级后构建失败

检查 Taro CLI、项目依赖、插件和运行时版本是否一致，然后清理构建缓存并重新安装依赖。升级应单独完成全平台构建与回归，不要和业务发布混在同一次变更中。

## 延伸阅读

- [Taro 官方文档](https://docs.taro.zone/)
- [跨端开发选型](/cross-platform/index.md)
