# UniApp 完全指南

## 目录
1. [UniApp 基础](#uniapp-基础)
2. [页面与路由](#页面与路由)
3. [组件系统](#组件系统)
4. [API 能力](#api-能力)
5. [条件编译](#条件编译)
6. [状态管理](#状态管理)
7. [打包发布](#打包发布)

## UniApp 基础

### 什么是 UniApp
uni-app 是 DCloud 推出的使用 Vue.js 开发的跨端框架，一套代码可编译到 H5、小程序（微信/支付宝/百度等）、App（iOS/Android）。

### 安装与创建项目
```bash
# 使用 HBuilderX（推荐）直接新建项目
# 或使用 CLI
npm install -g @dcloudio/uvm
npx degit dcloudio/uni-preset-vue#vite-ts my-project
cd my-project && npm install
```

### 目录结构
```
my-project/
├── src/
│   ├── pages/          # 页面文件
│   ├── components/     # 组件
│   ├── static/         # 静态资源
│   ├── store/          # 状态管理
│   ├── App.vue
│   ├── main.ts
│   ├── manifest.json   # 应用配置
│   └── pages.json      # 页面路由配置
└── package.json
```

## 页面与路由

### pages.json 配置
```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": { "navigationBarTitleText": "首页" }
    },
    {
      "path": "pages/detail/detail",
      "style": { "navigationBarTitleText": "详情" }
    }
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "static/home.png" },
      { "pagePath": "pages/profile/profile", "text": "我的", "iconPath": "static/user.png" }
    ]
  },
  "globalStyle": {
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black"
  }
}
```

### 路由跳转
```ts
// 跳转到新页面
uni.navigateTo({ url: '/pages/detail/detail?id=1' })

// 重定向（关闭当前页）
uni.redirectTo({ url: '/pages/index/index' })

// 跳转到 tabBar 页面
uni.switchTab({ url: '/pages/index/index' })

// 返回上一页
uni.navigateBack({ delta: 1 })
```

### 页面生命周期
```vue
<script setup lang="ts">
import { onLoad, onShow, onHide, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'

onLoad((options) => {
  console.log('页面加载，参数：', options)
})

onShow(() => {
  console.log('页面显示')
})

onPullDownRefresh(() => {
  // 下拉刷新
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  // 触底加载更多
})
</script>
```

## 组件系统

### 基础组件
```vue
<template>
  <view class="container">
    <text class="title">标题</text>
    <image src="/static/logo.png" mode="aspectFit" />
    <button type="primary" @click="handleClick">点击</button>
    <input v-model="inputVal" placeholder="请输入" />
    <scroll-view scroll-y class="list">
      <view v-for="item in list" :key="item.id">
        {{ item.name }}
      </view>
    </scroll-view>
  </view>
</template>
```

### uni-ui 组件库
```bash
npm install @dcloudio/uni-ui
```

```vue
<template>
  <uni-list>
    <uni-list-item title="列表项" note="副标题" />
  </uni-list>
  <uni-badge text="99+" type="error" />
  <uni-load-more status="loading" />
</template>
```

## API 能力

### 网络请求
```ts
// 封装 request
function request<T>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      header: { Authorization: `Bearer ${getToken()}`, ...options.header },
      success: (res) => resolve(res.data as T),
      fail: reject,
    })
  })
}

// 使用
const users = await request<User[]>({ url: '/api/users', method: 'GET' })
```

### 存储
```ts
// 同步存储
uni.setStorageSync('token', 'xxx')
const token = uni.getStorageSync('token')
uni.removeStorageSync('token')

// 异步存储
uni.setStorage({ key: 'user', data: { name: 'test' } })
```

### 设备 API
```ts
// 获取系统信息
const sysInfo = uni.getSystemInfoSync()
console.log(sysInfo.platform, sysInfo.windowWidth)

// 上传图片
uni.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const tempFile = res.tempFilePaths[0]
    uni.uploadFile({ url: '/api/upload', filePath: tempFile, name: 'file' })
  }
})
```

## 条件编译

### 平台特定代码
```vue
<template>
  <!-- #ifdef MP-WEIXIN -->
  <view>仅微信小程序显示</view>
  <!-- #endif -->

  <!-- #ifdef H5 -->
  <div>仅 H5 显示</div>
  <!-- #endif -->

  <!-- #ifndef APP-PLUS -->
  <view>非 App 显示</view>
  <!-- #endif -->
</template>

<script setup lang="ts">
// #ifdef MP-WEIXIN
console.log('微信小程序逻辑')
// #endif

// #ifdef H5
console.log('H5 逻辑')
// #endif
</script>
```

## 状态管理

### Pinia（推荐）
```bash
npm install pinia
```

```ts
// store/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
"user"
, {
  state: () => ({ name: '', token: '' }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    login(name: string, token: string) {
      this.name = name
      this.token = token
      uni.setStorageSync('token', token)
    },
    logout() {
      this.$reset()
      uni.removeStorageSync('token')
    }
  }
})
```

## 打包发布

### 运行与发布命令
```bash
# H5
npm run dev:h5
npm run build:h5

# 微信小程序
npm run dev:mp-weixin
npm run build:mp-weixin

# iOS / Android
npm run dev:app
npm run build:app
```

### 微信小程序发布流程
```
1. npm run build:mp-weixin
2. 微信开发者工具打开 dist/dev/mp-weixin 目录
3. 上传代码到微信后台
4. 微信公众平台 -> 版本管理 -> 提审发布
```