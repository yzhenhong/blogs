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

## 核心概念

### 组件
```tsx
interface Props {
  title: string
  count?: number
}

const Counter: React.FC<Props> = ({ title, count = 0 }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>数量：{count}</p>
    </div>
  )
}
```

### Props 与 State
```tsx
import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount((prev) => prev - 1)}>-1</button>
    </div>
  )
}
```

### 事件处理
```tsx
const Form = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={handleChange} />
      <button type="submit">提交</button>
    </form>
  )
}
```
## Hooks 详解

### useState
```tsx
const [count, setCount] = useState(0)
const [user, setUser] = useState({ name: '', age: 0 })

// 函数式更新（依赖前一个值时使用）
setCount((prev) => prev + 1)
setUser((prev) => ({ ...prev, name: 'React' }))
```

### useEffect
```tsx
import { useState, useEffect } from 'react'

const Demo = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then(setData)

    return () => {
      // 清理：取消订阅、清除定时器等
    }
  }, []) // 空数组 = 仅挂载时执行

  return <div>{JSON.stringify(data)}</div>
}
```

### useContext
```tsx
import { createContext, useContext, useState } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### useReducer
```tsx
import { useReducer } from 'react'

type State = { count: number }
type Action = { type: 'increment' | 'decrement' | 'reset' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 }
    case 'decrement': return { count: state.count - 1 }
    case 'reset':     return { count: 0 }
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  )
}
```

### useRef
```tsx
import { useRef, useEffect } from 'react'

const Demo = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const renderCount = useRef(0) // 不触发重渲染的可变值

  useEffect(() => {
    inputRef.current?.focus()
    renderCount.current += 1
  })

  return <input ref={inputRef} />
}
```

### 自定义 Hook
```tsx
import { useState, useEffect } from 'react'

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}

// 使用
const UserList = () => {
  const { data, loading } = useFetch<User[]>('/api/users')
  if (loading) return <p>加载中...</p>
  return <ul>{data?.map((u) => <li key={u.id}>{u.name}</li>)}</ul>
}
```
## 组件模式

### 受控组件
```tsx
import { useState } from 'react'

const ControlledInput = () => {
  const [value, setValue] = useState('')
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### 高阶组件（HOC）
```tsx
function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent({
    isLoading,
    ...props
  }: P & { isLoading: boolean }) {
    if (isLoading) return <p>Loading...</p>
    return <Component {...(props as P)} />
  }
}
```

### 组合模式（Compound Component）
```tsx
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card">{children}</div>
)

Card.Header = ({ title }: { title: string }) => (
  <div className="card-header">{title}</div>
)

Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="card-body">{children}</div>
)

// 使用
const Demo = () => (
  <Card>
    <Card.Header title="标题" />
    <Card.Body>内容</Card.Body>
  </Card>
)
```

## 状态管理

### Zustand（轻量推荐）
```bash
npm install zustand
```

```tsx
import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  decrement: () => void
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

const Counter = () => {
  const { count, increment, decrement } = useCounterStore()
  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

### Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

```tsx
import { createSlice, configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    incremented: (state) => { state.value += 1 },
    decremented: (state) => { state.value -= 1 },
  },
})

export const { incremented, decremented } = counterSlice.actions
export const store = configureStore({
  reducer: { counter: counterSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## 路由管理

### React Router v6
```bash
npm install react-router-dom
```

```tsx
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">首页</Link>
      <Link to="/about">关于</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/user/:id" element={<UserDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div>
      <p>用户 ID：{id}</p>
      <button onClick={() => navigate(-1)}>返回</button>
    </div>
  )
}
```

### 路由守卫
```tsx
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}
```

## 性能优化

### React.memo
```tsx
import { memo } from 'react'

const ExpensiveChild = memo(({ data }: { data: string[] }) => {
  return <ul>{data.map((d) => <li key={d}>{d}</li>)}</ul>
})
```

### useMemo 与 useCallback
```tsx
import { useMemo, useCallback } from 'react'

const Demo = ({ list }: { list: number[] }) => {
  // list 不变则不重算
  const doubled = useMemo(() => list.map((n) => n * 2), [list])

  // 缓存函数引用，避免子组件不必要重渲染
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <ExpensiveChild data={doubled.map(String)} onClick={handleClick} />
}
```

### 懒加载
```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

const App = () => (
  <Suspense fallback={<p>加载中...</p>}>
    <HeavyComponent />
  </Suspense>
)
```

### 虚拟列表
```bash
npm install react-window
```

```tsx
import { FixedSizeList } from 'react-window'

const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
  <div style={style}>第 {index + 1} 行</div>
)

const VirtualList = () => (
  <FixedSizeList height={600} width="100%" itemSize={50} itemCount={10000}>
    {Row}
  </FixedSizeList>
)
```