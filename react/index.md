# React.js 完全指南

## 目录
1. [React.js 基础](#react.js-基础)
2. [核心概念](#核心概念)
3. [Hooks 详解](#hooks-详解)
4. [组件模式](#组件模式)
5. [状态管理](#状态管理)
6. [路由管理](#路由管理)
7. [性能优化](#性能优化)

## React.js 基础

### 什么是 React.js
React 是由 Meta 开源的用于构建用户界面的 JavaScript 库，基于组件化思想，通过虚拟 DOM 实现高效的 UI 更新。

### 安装与配置
```bash
# 使用 Vite（推荐）
npm create vite@latest my-app -- --template react-ts

# 使用 Create React App
npx create-react-app my-app --template typescript
```

### JSX 语法
```tsx
const App = () => {
  const name = 'React'
  const list = ['Vue', 'React', 'Angular']

  return (
    <div className="app">
      <h1>Hello, {name}!</h1>
      {name === 'React' && <p>使用 React 构建</p>}
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
```
