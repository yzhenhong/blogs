# React Native 完全指南

## 目录
1. [React Native 基础](#react-native-基础)
2. [核心组件](#核心组件)
3. [样式系统](#样式系统)
4. [导航](#导航)
5. [原生能力](#原生能力)
6. [状态管理](#状态管理)
7. [性能优化](#性能优化)

## React Native 基础

### 什么是 React Native
React Native 是 Meta 开源的跨平台移动应用开发框架，使用 React 语法编写原生 iOS 和 Android 应用，组件最终会被渲染为真正的原生控件。

### 安装与配置
```bash
# 使用 Expo（推荐新手）
npx create-expo-app my-app --template
cd my-app && npx expo start

# 使用 React Native CLI（完整原生能力）
npx @react-native-community/cli@latest init MyApp --template react-native-template-typescript
```

### 目录结构
```
my-app/
├── src/
│   ├── screens/        # 页面
│   ├── components/     # 组件
│   ├── navigation/     # 导航配置
│   ├── store/          # 状态管理
│   ├── hooks/
│   └── utils/
├── android/            # Android 原生代码
├── ios/                # iOS 原生代码
├── App.tsx
└── package.json
```
