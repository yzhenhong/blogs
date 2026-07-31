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

## 路由系统

### App Router 文件约定
```
app/
├── page.tsx          # 页面（/）
├── layout.tsx        # 布局（跨页面持久化）
├── loading.tsx       # 加载 UI
├── error.tsx         # 错误边界
├── not-found.tsx     # 404
└── blog/
    ├── page.tsx      # /blog
    └── [slug]/
        └── page.tsx  # /blog/:slug
```

### 布局组件
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <nav>全局导航</nav>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  )
}
```

### 动态路由
```tsx
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string }
}

export default function BlogPost({ params }: PageProps) {
  return <h1>文章：{params.slug}</h1>
}

// 静态生成路由参数
export async function generateStaticParams() {
  return [{ slug: 'hello-world' }, { slug: 'react-guide' }]
}
```

### 嵌套路由与路由组
```
app/
├── (marketing)/      # 路由组（不影响 URL）
│   ├── layout.tsx
│   └── about/page.tsx
├── (shop)/
│   ├── layout.tsx
│   └── products/page.tsx
└── page.tsx
```

## 数据获取

### Server Component 直接 fetch
```tsx
// Server Component（默认）
async function ProductList() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 60 }, // ISR：60 秒重新验证
  })
  const products = await res.json()

  return (
    <ul>
      {products.map((p: Product) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  )
}
```

### generateMetadata（SEO）
```tsx
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await fetch(`/api/posts/${params.slug}`).then(r => r.json())
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

### Client Component 数据获取
```tsx
'use client'
import { useState, useEffect } from 'react'

export default function ClientPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])

  return <div>{JSON.stringify(data)}</div>
}
```

## 渲染模式

### 静态生成（SSG）
```tsx
// next: { revalidate: false } 或不加 revalidate
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // 默认，构建时缓存
  }).then(r => r.json())
  return <div>{data.title}</div>
}
```

### 服务端渲染（SSR）
```tsx
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store', // 每次请求都重新获取
  }).then(r => r.json())
  return <div>{data.title}</div>
}
```

### ISR（增量静态再生）
```tsx
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // 每小时重新验证
  }).then(r => r.json())
  return <div>{data.title}</div>
}
```

## App Router

### Server Component vs Client Component
```tsx
// Server Component（默认）- 不加 "use client"
// 可以直接访问数据库、文件系统，不暴露给客户端
async function ServerComp() {
  const data = await db.query()
  return <div>{data}</div>
}

// Client Component - 添加 "use client"
'use client'
import { useState } from 'react'

function ClientComp() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### API 路由
```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const users = await db.getUsers()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await db.createUser(body)
  return NextResponse.json(user, { status: 201 })
}
```

### Middleware
```tsx
// middleware.ts（项目根目录）
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

## 性能优化

### next/image
```tsx
import Image from 'next/image'

const Demo = () => (
  <Image
    src="/hero.png"
    alt="Hero"
    width={800}
    height={400}
    priority       // LCP 图片加 priority
    placeholder="blur"
  />
)
```

### next/font
```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### next/link 预取
```tsx
import Link from 'next/link'

// 默认在视口可见时预取
const Nav = () => (
  <nav>
    <Link href="/">首页</Link>
    <Link href="/about" prefetch={false}>关于（禁用预取）</Link>
  </nav>
)
```

## 部署

### Vercel 部署（推荐）
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### Docker 部署
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### next.config.js 常用配置
```js
/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
  async redirects() {
    return [
      { source: '/old', destination: '/new', permanent: true },
    ]
  },
  env: { CUSTOM_VAR: process.env.CUSTOM_VAR },
}

module.exports = nextConfig
```