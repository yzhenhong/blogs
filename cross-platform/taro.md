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
