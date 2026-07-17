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
