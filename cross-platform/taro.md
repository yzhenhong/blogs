# Taro 完全指南

## 目录
1. [Taro 基础](#taro-基础)
2. [页面与路由](#页面与路由)
3. [组件系统](#组件系统)
4. [API 能力](#api-能力)
5. [条件编译](#条件编译)
6. [状态管理](#状态管理)
7. [打包发布](#打包发布)

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