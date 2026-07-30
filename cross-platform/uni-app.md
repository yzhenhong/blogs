# UniApp 完全指南

## 目录
1. [UniApp 基础](#uniapp-基础)
2. [页面与路由](#页面与路由)
3. [组件系统](#组件系统)
4. [API 能力](#api-能力)
5. [条件编译](#条件编译)
6. [状态管理](#状态管理)
7. [打包发布](#打包发布)
8. [工程化实践](#工程化实践)
9. [常见问题](#常见问题)

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

export const useUserStore = defineStore('user', {
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
2. 微信开发者工具打开 dist/build/mp-weixin 目录
3. 上传代码到微信后台
4. 微信公众平台 -> 版本管理 -> 提审发布
```

不同脚手架的输出目录可能不同，以项目的 Vite 配置和实际构建日志为准。不要把 `dev` 目录作为正式发布产物。

## 工程化实践

### 正确理解生命周期

`onLoad` 通常在页面创建时执行，适合读取路由参数和初始化；`onShow` 会在每次页面重新可见时执行，适合刷新可能已经变化的数据。把请求全部放在 `onShow` 中容易造成返回页面就重复请求。

```ts
import { onLoad, onShow } from '@dcloudio/uni-app'

let productId = ''
let shouldRefresh = true

onLoad((query) => {
  productId = String(query?.id ?? '')
})

onShow(async () => {
  if (!shouldRefresh || !productId) return
  await loadProduct(productId)
  shouldRefresh = false
})
```

### 隔离平台差异

条件编译适合少量平台差异。若同一业务中出现大量 `#ifdef`，应把平台 API 封装成适配器，让页面只依赖统一接口。

```ts
export async function openSettings() {
  // #ifdef APP-PLUS
  return openNativeSettings()
  // #endif

  // #ifndef APP-PLUS
  uni.showToast({ title: '当前平台不支持', icon: 'none' })
  // #endif
}
```

### 样式与组件边界

- `rpx` 适合随屏幕宽度缩放的布局，不适合所有字体和边框
- 避免依赖 H5 独有的 DOM、选择器和浏览器全局对象
- 自定义组件应明确属性默认值、事件名和插槽协议
- 长列表优先使用目标平台提供的虚拟列表或分页加载
- 安全区域、导航栏和键盘高度要在真机验证

### 环境与配置

API 地址、应用 ID 和第三方平台配置应按环境拆分。客户端变量不是真正的秘密，服务端密钥不能放进 `manifest.json`、源码或构建变量。

### 测试策略

业务函数可直接做单元测试；页面和平台 API 需要在目标小程序、H5 浏览器或 App 真机上测试。正式发布前从 `build` 产物走一遍登录、授权、支付、上传和分享等核心流程。

## 常见问题

### H5 正常，小程序报错

检查是否使用了 `window`、`document`、动态执行代码或目标小程序不支持的 CSS。还要确认第三方包是否依赖 Node.js 内置模块，以及小程序后台是否配置了请求域名。

### 图片或资源在发布后找不到

区分 `static` 静态资源和经过构建处理的模块资源，避免依赖开发服务器绝对路径。检查文件名大小写，并以实际发布产物的目录结构为准。

### 页面返回后数据没有更新

如果编辑发生在下一级页面，可在返回前修改共享状态，或给上级页面设置“需要刷新”标记，再由 `onShow` 执行一次刷新。避免每次显示都无条件重新拉取全部数据。

### 包体积超过小程序限制

启用分包、按需加载和组件自动导入，清理未使用依赖与大图。主包只保留启动必需页面和公共资源，分包之间避免复制大型依赖。

## 延伸阅读

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [跨端开发选型](/cross-platform/index.md)
