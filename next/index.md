# Next.js 完全指南

## 目录
1. [Next.js 基础](#next.js-基础)
2. [路由系统](#路由系统)
3. [数据获取](#数据获取)
4. [渲染模式](#渲染模式)
5. [App Router](#app-router)
6. [性能优化](#性能优化)
7. [部署](#部署)

## Next.js 基础

### 什么是 Next.js
Next.js 是基于 React 的全栈框架，提供服务端渲染（SSR）、静态生成（SSG）、API 路由等能力，由 Vercel 维护。

### 安装与配置
```bash
npx create-next-app@latest my-app --typescript --tailwind --app
```

### 项目结构（App Router）
```
my-app/
├── app/
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 首页
│   ├── about/
│   │   └── page.tsx    # /about 页面
│   └── api/
│       └── route.ts    # API 路由
├── components/
├── public/
└── next.config.js
```
