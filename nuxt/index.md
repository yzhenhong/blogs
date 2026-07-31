# Nuxt.js 完全指南

Nuxt 是基于 Vue 的全栈 Web 框架，负责把路由、服务端渲染、数据获取、服务端 API、构建和部署组织成一套约定。它既能构建内容网站和电商页面，也能构建包含登录、后台接口和混合渲染策略的完整应用。

> 本文以 Nuxt 4、Vue 3 和 TypeScript 为主。Nuxt 3 的核心 API 基本一致，但默认目录位置可能不同；Nuxt 2 项目请重点阅读迁移章节。

## 目录

1. [Nuxt.js 基础](#nuxtjs-基础)
2. [创建与配置项目](#创建与配置项目)
3. [目录结构与自动导入](#目录结构与自动导入)
4. [页面、路由与布局](#页面、路由与布局)
5. [数据获取](#数据获取)
6. [服务端 API 与 Nitro](#服务端-api-与-nitro)
7. [状态管理](#状态管理)
8. [渲染模式与缓存](#渲染模式与缓存)
9. [SEO 与 Head 管理](#seo-与-head-管理)
10. [鉴权与安全](#鉴权与安全)
11. [错误处理与测试](#错误处理与测试)
12. [性能优化](#性能优化)
13. [构建与部署](#构建与部署)
14. [从 Nuxt 2/3 迁移](#从-nuxt-23-迁移)
15. [常见问题](#常见问题)
16. [上线检查清单](#上线检查清单)

## Nuxt.js 基础

### 什么是 Nuxt.js

Nuxt.js 是建立在 Vue 之上的应用框架。Vue 负责组件和响应式界面，Nuxt 进一步提供：

- 基于文件系统的路由与布局
- 服务端渲染、静态生成和客户端渲染
- SSR 安全的数据获取与状态传输
- Nitro 服务端 API 和跨平台部署产物
- 组件、组合式函数和服务端工具自动导入
- 页面 head、SEO、错误页和路由中间件
- 模块、插件、开发工具和构建约定

现代官方品牌名称是 **Nuxt**，社区仍经常使用 Nuxt.js 指代它。

### Nuxt 与 Vue 的关系

| 能力 | Vue | Nuxt |
| --- | --- | --- |
| 组件、响应式、Composition API | 内置 | 直接使用 Vue |
| 路由 | 通常手动配置 Vue Router | 根据 `pages/` 自动生成 |
| SSR/SSG | 需要自行搭建 | 框架内置 |
| 服务端 API | 不提供 | Nitro `server/` 目录 |
| 数据序列化与水合 | 需要自行处理 | `useFetch`、`useAsyncData` |
| SEO head | 额外集成 | `useHead`、`useSeoMeta` |
| 部署适配 | 由项目决定 | Nitro presets |

如果只是嵌入已有页面的一个小组件，直接使用 Vue 更轻；如果需要路由、SEO、服务端渲染、静态生成或前后端一体工程，Nuxt 通常更合适。

### 请求如何完成

首次访问 SSR 页面时：

```text
浏览器请求 URL
  → Nitro 接收请求
  → 路由中间件与页面 setup 执行
  → 服务端获取数据并渲染 Vue
  → 返回 HTML + payload + 客户端资源
  → 浏览器显示 HTML
  → Vue 水合并接管交互
```

之后通过 `<NuxtLink>` 导航时通常不再整页刷新，而是在客户端加载目标页面组件和数据。

### Nuxt 4 与旧版本

| 版本 | 主要特点 | 建议 |
| --- | --- | --- |
| Nuxt 4 | 默认 `app/` 目录、更清晰的类型与项目边界 | 新项目优先使用 |
| Nuxt 3 | Vue 3、Nitro、Composition API | 按官方迁移说明逐步升级 |
| Nuxt 2 | Vue 2、Vuex、旧版 `asyncData/fetch` | 维护项目应制定迁移计划 |

不要仅凭教程发布日期判断 API。先执行 `npx nuxi info` 或查看 `package.json`，确认 Nuxt、Vue、Nitro 和 Node.js 版本。

## 创建与配置项目

### 环境与初始化

使用当前 Nuxt 支持的 Node.js LTS：

```bash
node -v
npm -v

npm create nuxt@latest my-nuxt-app
cd my-nuxt-app
npm install
npm run dev
```

常用命令：

```bash
npm run dev       # 开发服务器
npm run build     # 构建服务端应用
npm run preview   # 本地预览生产构建
npm run generate  # 生成静态站点
npx nuxi typecheck
npx nuxi info
```

团队应提交 lock 文件，并在 CI 中固定 Node.js 和包管理器版本。

### nuxt.config.ts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '/api',
      siteUrl: 'https://example.com',
    },
  },
})
```

`compatibilityDate` 用来锁定部分运行平台行为，应由项目明确维护，升级时阅读变更说明并完成回归，不要在每次发布时自动改成当天。

### 运行时配置与环境变量

`runtimeConfig` 分为私有和公开部分：

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // 仅服务端可读取
    databaseUrl: '',
    public: {
      apiBase: '/api', // 浏览器和服务端都能读取
    },
  },
})
```

对应环境变量：

```dotenv
NUXT_API_SECRET=server-only-secret
NUXT_DATABASE_URL=postgresql://localhost/app
NUXT_PUBLIC_API_BASE=https://api.example.com
```

```ts
const config = useRuntimeConfig()

// 页面和组件中只能依赖 public
console.log(config.public.apiBase)

// server/ 中可以读取私有字段
console.log(config.apiSecret)
```

注意：

- `.env` 主要用于本地开发，生产环境应由部署平台注入变量。
- `runtimeConfig.public` 会发送到浏览器，不能存放密钥。
- 已经打进客户端 bundle 的值无法靠隐藏 source map 保密。
- 变量名应使用 `NUXT_` 约定，避免在运行时用完全不同的自定义变量覆盖嵌套配置。

### app.config.ts

`app.config.ts` 适合类型安全、构建时确定且允许公开的应用配置：

```ts
// app/app.config.ts
export default defineAppConfig({
  theme: {
    primaryColor: '#0f766e',
    radius: 6,
  },
})
```

```ts
const appConfig = useAppConfig()
console.log(appConfig.theme.primaryColor)
```

它不是密钥存储，也不适合部署后动态修改的服务端配置。

## 目录结构与自动导入

### Nuxt 4 推荐结构

```text
my-nuxt-app/
├─ app/
│  ├─ assets/           # 由构建工具处理的 CSS、字体和图片
│  ├─ components/       # Vue 组件，默认自动导入
│  ├─ composables/      # 组合式函数，默认自动导入
│  ├─ layouts/          # 页面布局
│  ├─ middleware/       # 路由中间件
│  ├─ pages/            # 文件路由
│  ├─ plugins/          # Nuxt/Vue 插件
│  ├─ utils/            # 客户端与 Vue 应用工具
│  ├─ app.vue           # 应用根组件
│  └─ error.vue         # 全局错误页
├─ server/
│  ├─ api/              # 自动添加 /api 前缀的服务端路由
│  ├─ routes/           # 不自动添加 /api 的服务端路由
│  ├─ middleware/       # 每个服务端请求经过的中间件
│  ├─ plugins/          # Nitro 插件
│  └─ utils/            # 服务端自动导入工具
├─ shared/              # 浏览器与服务端均可复用的纯代码
├─ public/              # 原样公开的静态文件
├─ nuxt.config.ts
├─ package.json
└─ tsconfig.json
```

Nuxt 3 项目常把 `pages/`、`components/` 等目录直接放在根目录。迁移到 Nuxt 4 时以实际配置和官方迁移说明为准。

### assets 与 public

| 目录 | 处理方式 | 适合内容 |
| --- | --- | --- |
| `app/assets/` | 经过 Vite、hash、压缩和依赖分析 | 在组件中导入的样式、字体、图片 |
| `public/` | 原样复制到网站根路径 | favicon、robots.txt、固定文件名资源 |

```vue
<template>
  <!-- public/logo.svg -->
  <img src="/logo.svg" alt="站点 Logo" />
</template>

<style scoped>
@import '~/assets/styles/article.css';
</style>
```

不要把需要构建优化的大量源码资源全部放进 `public/`。

### 自动导入

页面中可以直接使用 Vue、Nuxt composables 和 `app/composables/` 下的导出：

```ts
// app/composables/useCurrency.ts
export function useCurrency() {
  const format = (value: number) =>
    new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(value)

  return { format }
}
```

```vue
<script setup lang="ts">
const { format } = useCurrency()
</script>

<template>
  <strong>{{ format(199) }}</strong>
</template>
```

自动导入不等于全局变量。Nuxt 在构建时生成真实 import 和类型声明。命名冲突或扫描不到嵌套文件时，应检查生成类型和目录规则，不要手写全局声明掩盖问题。

### 共享代码边界

`shared/` 适合：

- TypeScript 类型与 schema
- 不依赖 DOM、Vue 实例或 Node.js 的纯函数
- 浏览器和服务端都需要的常量与业务规则

不要在 shared 模块顶层访问 `window`、文件系统、数据库连接或请求事件。

### 组件自动导入

```text
app/components/base/AppButton.vue      → <BaseAppButton />
app/components/article/ArticleCard.vue → <ArticleArticleCard />
```

可以通过 `pathPrefix` 等配置调整命名，但组件名应稳定且避免不同目录产生冲突。大型组件用 `Lazy` 前缀延迟加载：

```vue
<template>
  <LazyHeavyChart v-if="showChart" />
</template>
```

## 页面、路由与布局

### 文件系统路由

```text
app/pages/index.vue             → /
app/pages/about.vue             → /about
app/pages/articles/index.vue    → /articles
app/pages/articles/[id].vue     → /articles/:id
app/pages/users/[[id]].vue      → /users/:id?
app/pages/docs/[...slug].vue    → /docs/**
```

动态页面读取参数：

```vue
<script setup lang="ts">
const route = useRoute()
const articleId = computed(() => String(route.params.id))
</script>

<template>
  <p>Article: {{ articleId }}</p>
</template>
```

路由参数来自 URL，不能因为 TypeScript 转换后就信任它。服务端查询前仍需校验格式、长度和权限。

### 页面元数据

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  validate: async (route) => {
    return /^\d+$/.test(String(route.params.id))
  },
})
</script>
```

`definePageMeta` 是编译宏，放在页面组件中使用。`validate` 适合判断路由参数是否合法，不代替服务端鉴权。

### 导航

```vue
<template>
  <nav>
    <NuxtLink to="/articles">文章</NuxtLink>
    <NuxtLink :to="{ name: 'articles-id', params: { id: '42' } }">
      文章详情
    </NuxtLink>
  </nav>
</template>
```

```ts
await navigateTo('/login')

await navigateTo({
  path: '/search',
  query: { keyword: 'nuxt' },
})

// 明确打开外部地址
await navigateTo('https://example.com', { external: true })
```

站内导航优先使用 `<NuxtLink>` 或 `navigateTo`，不要直接修改 `location.href` 造成不必要的整页刷新。

### 嵌套路由

```text
app/pages/settings.vue
app/pages/settings/profile.vue
app/pages/settings/security.vue
```

父页面需要渲染子页面出口：

```vue
<!-- app/pages/settings.vue -->
<template>
  <div class="settings-layout">
    <SettingsNav />
    <NuxtPage />
  </div>
</template>
```

如果父页面本身不需要内容，也可以通过目录和文件约定重新组织，避免重复布局。

### 布局

```vue
<!-- app/layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <AppSidebar />
    <main>
      <slot />
    </main>
  </div>
</template>
```

页面选择布局：

```vue
<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>
```

布局适合稳定的页面外壳。不要把每个页面的数据请求全部放入布局，否则一次局部导航可能触发不必要的共享请求。

### 路由中间件

```ts
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const session = useState<{ userId: string } | null>('session')

  if (!session.value && to.path !== '/login') {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
```

类型：

- 匿名中间件：直接写在 `definePageMeta`
- 命名中间件：`middleware/auth.ts`
- 全局中间件：`middleware/analytics.global.ts`

路由中间件运行在 Vue 应用导航阶段；`server/middleware/` 处理服务端 HTTP 请求。两者同名但职责完全不同。

### 插件

```ts
// app/plugins/api.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    timeout: 10_000,
    onResponseError({ response }) {
      console.error('API error:', response.status)
    },
  })

  return {
    provide: { api },
  }
})
```

```ts
const { $api } = useNuxtApp()
const users = await $api<User[]>('/users')
```

后缀控制运行环境：

```text
analytics.client.ts   只在浏览器运行
database.server.ts    只在服务端运行
```

插件顶层初始化会影响启动时间。大型 SDK 应按需加载，并确认 SSR 环境不会访问 `window`。

## 数据获取

### 为什么不能只用普通 fetch

如果在页面 setup 中直接 `$fetch`，服务端渲染时请求一次，浏览器水合时可能再次请求。`useFetch` 和 `useAsyncData` 会把服务端结果写入 Nuxt payload，并在客户端复用。

| API | 适合场景 |
| --- | --- |
| `useFetch` | 基于 URL 的 HTTP 请求 |
| `useAsyncData` | 任意异步逻辑或组合多个数据源 |
| `$fetch` | 用户事件、服务端路由、无需 payload 的直接请求 |
| `useLazyFetch` / lazy option | 不阻塞导航的数据 |

### useFetch

```vue
<script setup lang="ts">
interface Article {
  id: string
  title: string
  summary: string
}

const page = ref(1)

const {
  data: articles,
  status,
  error,
  refresh,
} = await useFetch<Article[]>('/api/articles', {
  query: { page },
  watch: [page],
  default: () => [],
})
</script>

<template>
  <p v-if="status === 'pending'">加载中...</p>
  <p v-else-if="error">加载失败：{{ error.statusMessage }}</p>
  <ArticleList v-else :articles="articles" />
  <button type="button" @click="refresh">刷新</button>
</template>
```

`query` 中的 ref 变化会重新请求。不要同时用 `watch` 和手动 watch 重复触发。

### useAsyncData

```ts
const route = useRoute()

const { data: article, error } = await useAsyncData(
  () => `article:${route.params.id}`,
  () => $fetch(`/api/articles/${route.params.id}`),
  {
    watch: [() => route.params.id],
    transform: (value) => ({
      ...value,
      loadedAt: Date.now(),
    }),
  },
)
```

显式 key 应在相同数据和相同选项之间保持一致。不同组件使用同一 key 会共享 data、error 和 status，也可能因 option 不一致产生警告或意外结果。

### 客户端懒加载

```ts
const { data, status } = await useLazyFetch('/api/recommendations', {
  server: false,
  default: () => [],
})
```

`server: false` 意味着 SSR HTML 没有这部分数据。主要内容和 SEO 内容不应为了简化代码全部改成客户端请求。

### $fetch 的正确位置

```ts
const saving = ref(false)

async function saveProfile(input: ProfileInput) {
  saving.value = true

  try {
    return await $fetch('/api/profile', {
      method: 'PUT',
      body: input,
    })
  } finally {
    saving.value = false
  }
}
```

用户点击后发起的请求不需要 SSR payload，直接 `$fetch` 更合适。

### 刷新与清理

```ts
await refreshNuxtData('article:42')
clearNuxtData('article:42')
```

`refreshNuxtData` 适合在写操作成功后更新依赖数据。不要为了一个局部变更无条件刷新所有 key。

### 避免串行瀑布

```ts
// 相互独立的数据并行获取
const [{ data: profile }, { data: permissions }] = await Promise.all([
  useFetch('/api/profile'),
  useFetch('/api/permissions'),
])
```

如果第二个请求依赖第一个结果，则保留顺序并处理第一个请求失败的分支。还要检查服务端 API 内部是否又产生新的串行请求。

### Cookie 和请求头

对相对地址使用 SSR-aware 的 Nuxt 请求工具时，会处理当前请求上下文中的必要信息。调用外部服务时，不要把浏览器的 Cookie 或全部请求头直接转发：

```ts
const userAgent = useRequestHeader('user-agent')

const { data } = await useFetch('https://api.example.com/me', {
  headers: userAgent ? { 'user-agent': userAgent } : undefined,
})
```

只转发明确需要的白名单字段。除非目标服务完全可信并且协议明确要求，否则不要转发 Cookie、Authorization、内部代理头或客户端可伪造的权限信息。

## 服务端 API 与 Nitro

### server/api 与 server/routes

```text
server/api/health.get.ts           → GET /api/health
server/api/articles/index.get.ts   → GET /api/articles
server/api/articles/[id].get.ts    → GET /api/articles/:id
server/api/articles/index.post.ts  → POST /api/articles
server/routes/sitemap.xml.ts       → /sitemap.xml
```

HTTP 方法后缀能让相同路径拥有不同处理器。

### 基础处理器

```ts
// server/api/health.get.ts
export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})
```

```ts
// server/api/articles/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || !/^\d+$/.test(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid article id',
    })
  }

  const article = await articleRepository.findById(id)

  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found',
    })
  }

  return article
})
```

### 读取并校验请求体

TypeScript 泛型不会验证真实 HTTP 输入：

```ts
interface CreateArticleInput {
  title: string
  content: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<CreateArticleInput>>(event)

  const title = body.title?.trim()
  const content = body.content?.trim()

  if (!title || title.length > 120 || !content) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid article data',
    })
  }

  const article = await articleRepository.create({ title, content })
  setResponseStatus(event, 201)
  return article
})
```

复杂输入建议使用 Zod、Valibot 等 schema 库统一校验，并限制对象深度、数组长度和上传体积。

### 查询参数

```ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20))

  return articleRepository.list({ page, pageSize })
})
```

不要把排序字段、表名或 SQL 片段直接从 query 拼进数据库语句。

### server middleware

```ts
// server/middleware/request-context.ts
export default defineEventHandler((event) => {
  const requestId = getHeader(event, 'x-request-id') || crypto.randomUUID()
  event.context.requestId = requestId
  setHeader(event, 'x-request-id', requestId)
})
```

server middleware 会处理匹配范围内的每个请求，适合请求 ID、日志和通用上下文，不适合执行昂贵且只有少数 API 需要的查询。

### 服务端工具

```ts
// server/utils/articleRepository.ts
export const articleRepository = {
  async findById(id: string) {
    return database.article.findUnique({ where: { id } })
  },
}
```

服务端自动导入要避免名称冲突。数据库连接应按运行平台正确复用，不能在每次请求中无条件新建连接池。

### 调用外部 API

```ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  return $fetch('/v1/data', {
    baseURL: 'https://upstream.example.com',
    headers: {
      authorization: `Bearer ${config.apiSecret}`,
    },
    timeout: 8_000,
    retry: 1,
  })
})
```

外部调用必须有超时、错误映射和必要的重试限制。非幂等写操作不能盲目重试。

## 状态管理

### useState

`useState` 是 SSR-safe 的共享状态：

```ts
// app/composables/useCounter.ts
export function useCounter() {
  const count = useState<number>('counter', () => 0)

  const increment = () => {
    count.value += 1
  }

  return { count, increment }
}
```

状态会序列化进 payload，因此值应可序列化。不要存放组件实例、DOM、函数、数据库连接或带复杂原型的对象。

### 避免跨请求状态污染

```ts
// 错误：模块顶层 ref 可能被多个 SSR 请求共享
const currentUser = ref<User | null>(null)
export const useCurrentUser = () => currentUser

// 正确：Nuxt 按请求管理 useState
export const useCurrentUser = () =>
  useState<User | null>('current-user', () => null)
```

浏览器端模块单例很常见，但 SSR 服务端是长时间运行的多用户进程，模块级可变状态可能泄漏到其他请求。

### Cookie 状态

```ts
const theme = useCookie<'light' | 'dark'>('theme', {
  default: () => 'light',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 365,
})
```

Cookie 会随请求发送，应保持很小。主题偏好可以使用普通 Cookie；登录 session 应由服务端设置 `httpOnly`，避免客户端 JavaScript 读取。

### Pinia

复杂领域状态可以使用 Pinia：

```bash
npx nuxi@latest module add pinia
```

```ts
// app/stores/cart.ts
import { defineStore } from 'pinia'

interface CartItem {
  productId: string
  quantity: number
  price: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    ),
  )

  function add(item: CartItem) {
    items.value.push(item)
  }

  return { items, total, add }
})
```

不要把所有 API 数据都复制进 Pinia。能由页面数据获取和缓存管理的数据，优先留在 `useFetch/useAsyncData`；Pinia 用于跨页面业务状态和复杂动作。

### callOnce

需要初始化一次 store 时可以使用：

```ts
const settingsStore = useSettingsStore()

await callOnce('settings', () => settingsStore.load())
```

key 应明确且稳定。用户切换账号后需要重新初始化的状态不能误当作整个应用永久只执行一次。

## 渲染模式与缓存

### SSR、SSG、CSR

| 模式 | 输出方式 | 优点 | 适合场景 |
| --- | --- | --- | --- |
| SSR | 每次请求或缓存命中时生成 HTML | 首屏和 SEO 友好、数据较新 | 电商、公开应用、动态内容 |
| SSG | 构建时生成 HTML | CDN 便宜稳定、响应快 | 博客、文档、营销页 |
| CSR/SPA | 浏览器运行 JS 后生成内容 | 服务端简单、适合登录后应用 | 后台系统、SEO 非核心页面 |
| Hybrid | 不同路由使用不同策略 | 按业务取舍 | 大多数综合站点 |

全局 SPA：

```ts
export default defineNuxtConfig({
  ssr: false,
})
```

不要因为某个浏览器库不支持 SSR 就关闭全站 SSR。优先使用 `.client` 插件、`ClientOnly` 或只对特定路由调整。

### routeRules

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/blog/**': { isr: 3600 },
    '/dashboard/**': { ssr: false },
    '/api/public/**': {
      cors: true,
      cache: { maxAge: 300 },
    },
  },
})
```

`isr`、边缘缓存和部分规则的实际支持取决于 Nitro preset 和部署平台。上线前必须在目标环境验证响应头、更新时机和缓存键。

### 预渲染

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/articles/important-guide'],
      ignore: ['/private'],
    },
  },
})
```

链接爬取只能发现构建时 HTML 中存在的可访问链接。来自数据库的动态路由应在构建前显式生成列表或通过 hook 添加。

### 缓存服务端 API

```ts
// server/api/popular.get.ts
export default defineCachedEventHandler(
  async () => {
    return articleRepository.getPopular()
  },
  {
    maxAge: 60,
    name: 'popular-articles',
  },
)
```

缓存前明确：

- 数据能否被不同用户共享
- Cookie、语言、地区和权限是否影响响应
- 缓存 key 是否包含必要维度
- 写操作后如何失效
- 部署平台的缓存是否跨实例共享

含用户隐私的响应不能用公共 key 缓存。

### Hydration

水合要求服务端 HTML 与客户端首次渲染一致。常见错误：

```vue
<!-- 错误：服务端和浏览器时间不同 -->
<template>
  <p>{{ new Date().toLocaleString() }}</p>
</template>
```

可以在服务端生成稳定值，或仅在挂载后展示客户端专属内容：

```vue
<script setup lang="ts">
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <ClientOnly fallback-tag="span" fallback="--">
    <span v-if="mounted">{{ new Date().toLocaleString() }}</span>
  </ClientOnly>
</template>
```

`ClientOnly` 会让该内容不出现在 SSR HTML 中，应只用于真正依赖浏览器的非关键部分。

## SEO 与 Head 管理

### useSeoMeta

```vue
<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const { data: article } = await useFetch<Article>(
  `/api/articles/${route.params.id}`,
)

useSeoMeta({
  title: () => article.value?.title ?? '文章',
  description: () => article.value?.summary ?? '技术文章详情',
  ogTitle: () => article.value?.title ?? '文章',
  ogDescription: () => article.value?.summary ?? '技术文章详情',
  ogType: 'article',
  ogUrl: () => `${config.public.siteUrl}${route.path}`,
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}${route.path}`,
    },
  ],
})
</script>
```

重要页面应在 SSR/SSG HTML 中直接包含 title 和 meta。仅在 `onMounted` 后设置会让部分爬虫和分享工具读取不到。

### 全局标题模板

```vue
<!-- app/app.vue -->
<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title ? `${title} · My Nuxt App` : 'My Nuxt App',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

### JSON-LD

```ts
const schema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: article.value?.title,
  dateModified: article.value?.updatedAt,
  mainEntityOfPage: `${config.public.siteUrl}${route.path}`,
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(schema.value),
    },
  ],
})
```

结构化数据必须与页面可见内容一致。用户输入进入 JSON-LD 前仍需验证，不能通过 head 注入任意脚本内容。

### robots 与 sitemap

小型固定站点可以在 `public/robots.txt` 和服务端 route 中自行维护；路由较多时优先使用维护活跃的 Nuxt 模块自动生成，并确认：

- sitemap 只包含返回 200 的规范 URL
- 测试环境和预览域名不会被索引
- canonical 使用正式域名
- 动态文章更新能反映到 lastmod
- `noindex` 页面不进入 sitemap

更完整的策略见 [SEO 优化完全指南](/seo/index.md)。

## 鉴权与安全

### 鉴权边界

路由中间件只能改善页面导航体验，不能保护数据。用户可以绕过页面直接请求 `/api/admin`，因此每个受保护的服务端 API 都必须验证 session 和权限。

```text
路由中间件：未登录时尽早跳转，避免显示错误页面
服务端 API：验证身份、角色和资源所有权
数据库层：限制查询范围，避免越权读取
```

### HttpOnly Session Cookie

```ts
// server/api/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const user = await verifyCredentials(body.email, body.password)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  const sessionToken = await createSession(user.id)

  setCookie(event, 'session', sessionToken, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { user: { id: user.id, name: user.name } }
})
```

Cookie 中应存放随机、可撤销或经过安全签名的 session 标识，不直接存密码和敏感用户数据。生产环境必须使用 HTTPS。

### 服务端读取身份

```ts
// server/utils/requireUser.ts
import type { H3Event } from 'h3'

export async function requireUser(event: H3Event) {
  const token = getCookie(event, 'session')
  const session = token ? await findSession(token) : null

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required',
    })
  }

  return session.user
}
```

```ts
export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  return projectRepository.listForUser(user.id)
})
```

### XSS

Vue 默认转义文本插值：

```vue
<p>{{ userContent }}</p>
```

`v-html` 会插入 HTML，只有经过可靠白名单清洗的内容才能使用：

```vue
<!-- rawHtml 必须先由成熟 sanitizer 清洗 -->
<article v-html="sanitizedHtml" />
```

不要自行用正则清洗 HTML。

### CSRF

使用 Cookie 鉴权的写请求需要考虑 CSRF：

- 设置合理的 SameSite Cookie
- 检查 Origin/Referer
- 对高风险操作使用 CSRF token 或重新验证
- GET 请求不得修改状态
- CORS 不能替代 CSRF 防护

### SSRF 与开放重定向

服务端代理不能直接请求用户提供的任意 URL：

```ts
const allowedHosts = new Set(['api.example.com', 'images.example.com'])

function assertAllowedUrl(rawUrl: string) {
  const url = new URL(rawUrl)
  if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) {
    throw createError({ statusCode: 400, statusMessage: 'URL not allowed' })
  }
  return url
}
```

登录后的 redirect 参数也应只允许站内路径，避免攻击者构造跳往钓鱼站的链接。

### 安全响应头

可在 Nitro middleware 或部署代理中设置：

```ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  })
})
```

Content Security Policy 需要结合实际脚本、样式、图片和第三方域名设计，先以 report-only 观察，再逐步收紧。

## 错误处理与测试

### 页面错误

```ts
const { data: article } = await useFetch(`/api/articles/${id}`)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
    fatal: true,
  })
}
```

服务端应返回正确状态码。不要捕获所有异常后统一显示“暂无数据”，这会掩盖网络和服务端故障。

### 全局 error.vue

```vue
<!-- app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const goHome = () => clearError({ redirect: '/' })
</script>

<template>
  <main>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage || '页面出现错误' }}</p>
    <button type="button" @click="goHome">返回首页</button>
  </main>
</template>
```

清除错误前要清理导致错误的状态，否则跳转后可能再次触发。

### 局部错误边界

```vue
<NuxtErrorBoundary>
  <UserRecommendations />

  <template #error="{ error, clearError }">
    <p>推荐内容加载失败：{{ error.message }}</p>
    <button type="button" @click="clearError">重试</button>
  </template>
</NuxtErrorBoundary>
```

局部非关键组件失败时，不必让整个页面进入全局错误页。

### 单元与组件测试

```bash
npm install --save-dev @nuxt/test-utils vitest @vue/test-utils
```

```ts
// tests/components/AppButton.nuxt.spec.ts
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppButton from '~/components/AppButton.vue'

describe('AppButton', () => {
  it('renders its label', async () => {
    const wrapper = await mountSuspended(AppButton, {
      slots: { default: '保存' },
    })

    expect(wrapper.text()).toContain('保存')
  })
})
```

纯函数优先在普通 Vitest 环境测试，只有依赖 Nuxt 注入、路由或自动导入的组件才使用 Nuxt test environment。

### 服务端接口测试

```ts
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

await setup({ server: true })

describe('health API', () => {
  it('returns ok', async () => {
    const result = await $fetch<{ status: string }>('/api/health')
    expect(result.status).toBe('ok')
  })
})
```

真实项目还应测试未登录、越权、错误输入、数据库失败和超时。

### 端到端测试

使用 Playwright 等工具从生产构建验证：

- SSR 首次加载和客户端导航
- 登录、退出与 session 过期
- 表单校验与写操作
- 404 和服务端错误
- JavaScript 禁用时的公共内容
- 关键移动端布局

## 性能优化

### 从测量开始

同时观察：

- 服务端 TTFB 和下游接口耗时
- HTML、payload、JavaScript 和图片体积
- LCP、INP、CLS 真实用户数据
- 水合耗时与 mismatch
- 路由切换和业务交互耗时

只优化客户端 bundle 不能解决数据库慢，开启 SSR 也不能自动改善所有指标。

### 减少客户端 JavaScript

- 内容页优先 SSG、SSR 或服务端组件化输出思路，避免所有内容依赖客户端逻辑。
- 重型组件使用 `Lazy` 前缀或动态导入。
- 只在需要时加载编辑器、图表、地图和第三方 SDK。
- 检查 Nuxt DevTools 中的模块和 payload。
- 不把服务端专用依赖导入 app 目录。

```vue
<script setup lang="ts">
const showEditor = ref(false)
</script>

<template>
  <button type="button" @click="showEditor = true">编辑</button>
  <LazyMarkdownEditor v-if="showEditor" />
</template>
```

### 优化数据 payload

```ts
const { data: articles } = await useFetch('/api/articles', {
  pick: ['items', 'total'],
  transform: (response) => ({
    items: response.items.map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
    })),
    total: response.total,
  }),
})
```

不要把文章正文、完整权限树或大列表全部序列化给只显示摘要的首屏。

### NuxtLink 预取

NuxtLink 会根据可见性和交互预取目标资源。大量链接页面需要观察实际网络行为：

```vue
<NuxtLink to="/large-editor" :prefetch="false">
  打开编辑器
</NuxtLink>
```

不要全局关闭预取，也不要预取所有路由。对昂贵、低概率或按权限访问的页面单独调整。

### 图片

使用 Nuxt Image 模块生成响应式图片：

```bash
npx nuxi@latest module add image
```

```vue
<NuxtImg
  src="/images/nuxt-dashboard.png"
  width="1200"
  height="675"
  sizes="100vw md:960px"
  format="webp"
  alt="Nuxt 管理后台界面"
  loading="eager"
  fetchpriority="high"
/>
```

首屏 LCP 图片不懒加载；首屏以下图片使用 lazy，并始终提供尺寸减少 CLS。

### 缓存和 routeRules

静态内容尽量预渲染；更新频率较低的公开页面使用部署平台支持的 ISR/SWR；用户私有数据不使用公共缓存。缓存命中率和失效延迟都需要监控。

### 第三方脚本

统计、客服、广告和 A/B 脚本应在同意或需要时加载。检查它们是否：

- 阻塞首屏和水合
- 在 SSR 访问浏览器 API
- 注册大量全局监听器
- 因加载失败阻断主流程
- 收集超出业务需要的数据

### 继续阅读

完整的网络、运行时、缓存和性能预算方法见 [Web 性能优化完全指南](/optimization/index.md)。

## 构建与部署

### Node.js 服务

```bash
npm run build
node .output/server/index.mjs
```

常见运行变量：

```bash
NITRO_HOST=0.0.0.0
NITRO_PORT=3000
```

生产环境还需要进程管理或容器编排、健康检查、日志、优雅退出和反向代理。不要使用 `npm run dev` 承载生产流量。

### Docker

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

Node 版本应使用 Nuxt 当前支持的 LTS，并通过实际依赖和安全策略固定，不要长期照抄示例 tag。构建阶段的私有 registry token 不应进入最终镜像层。

### 静态站点

```bash
npm run generate
```

静态产物通常位于：

```text
.output/public/
```

适合 CDN、对象存储和静态托管。静态生成时不能依赖每次请求才存在的 Cookie 和服务端 session；需要动态能力时调用外部 API 或改用服务端部署。

### Serverless 与 Edge

Nitro 会根据部署平台生成适配产物。选择前确认：

- Node.js API 和原生模块支持范围
- 请求与执行时间限制
- 文件系统是否只读或临时
- 数据库连接方式
- 缓存 API 和 ISR 支持
- 地区、冷启动与日志能力

不要在本地 Node preset 测试通过后直接假设 Edge runtime 完全兼容。

### 反向代理

部署在 Nginx、CDN 或负载均衡器之后时，确认：

- 正确转发 Host、协议和客户端 IP
- HTTPS 跳转不会循环
- 压缩没有重复执行
- 静态资源缓存和 HTML 缓存策略不同
- WebSocket/SSE 能保持连接
- 请求体、超时和上传限制匹配业务

### 健康检查

```ts
// server/api/health.get.ts
export default defineEventHandler(async () => {
  const databaseOk = await database.ping()

  if (!databaseOk) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Database unavailable',
    })
  }

  return { status: 'ok' }
})
```

存活检查和就绪检查可以分开。高频健康检查不应执行昂贵全表查询。

### 发布策略

1. CI 运行 lint、typecheck、测试和生产构建。
2. 构建一次不可变产物，各环境只注入运行时配置。
3. 先在预览环境验证 SSR、静态资源、API 和缓存。
4. 使用滚动、蓝绿或金丝雀发布控制风险。
5. 监控错误率、TTFB、关键接口和 Core Web Vitals。
6. 保留上一版本产物和数据库兼容回滚方案。

## 从 Nuxt 2/3 迁移

### Nuxt 2 到现代 Nuxt

| Nuxt 2 | Nuxt 3/4 |
| --- | --- |
| Vue 2 Options API | Vue 3 Composition API 为主 |
| `asyncData` / 旧 `fetch` | `useAsyncData` / `useFetch` |
| Vuex `store/` | `useState` 或 Pinia |
| `static/` | `public/` |
| `context` 参数 | Nuxt composables |
| `serverMiddleware` 配置 | Nitro `server/` |
| `head()` | `useHead` / `useSeoMeta` |
| `@nuxtjs/axios` | `$fetch` / `useFetch` |

迁移不要只做 API 搜索替换。Vue 2 插件、模块、构建配置和服务端行为都需要逐项确认。

### asyncData 迁移

```js
// Nuxt 2
export default {
  async asyncData({ $axios, params }) {
    const article = await $axios.$get(`/articles/${params.id}`)
    return { article }
  },
}
```

```vue
<!-- Nuxt 3/4 -->
<script setup lang="ts">
const route = useRoute()
const { data: article } = await useFetch(
  `/api/articles/${route.params.id}`,
)
</script>
```

### Nuxt 3 到 Nuxt 4

重点关注：

- `app/` 目录迁移和路径 alias
- TypeScript 项目引用与生成类型
- 数据获取默认值和响应式行为变化
- 模块是否声明支持 Nuxt 4
- Nitro、Vite 和 Vue 的间接升级
- 旧兼容选项是否应移除

先在 Nuxt 3 中启用相应 future compatibility 选项并修复警告，再切换主版本，通常比一次性移动所有目录更容易排错。

### 迁移步骤

```text
1. 更新到当前旧主版本的最新维护版
2. 清理弃用警告和无维护模块
3. 建立关键页面、API 和部署回归测试
4. 按官方迁移指南调整目录与配置
5. 验证 SSR HTML、水合、Cookie 和缓存
6. 验证目标平台的真实部署产物
7. 分阶段上线并监控错误与性能
```

## 常见问题

### window is not defined

代码在 SSR 服务端执行时访问了浏览器 API。解决方式按优先级选择：

1. 判断逻辑是否能改成跨环境实现。
2. 仅在 `onMounted` 中执行浏览器行为。
3. 将插件命名为 `.client.ts`。
4. 对非关键组件使用 `<ClientOnly>`。

不要因为一个依赖报错就关闭全站 SSR。

### 页面数据请求两次

检查是否在 setup 中直接 `$fetch`，或者 `useFetch` 之外又写了 watch 和 mounted 请求。SSR 页面优先 `useFetch/useAsyncData`，让客户端复用 payload。

开发模式下的热更新和 DevTools 也可能产生额外请求，应使用生产构建确认。

### useFetch 返回旧数据或共享错误

检查 key 是否与请求参数对应、多个组件是否使用同一 key 但选项不同，以及写操作后是否刷新了正确 key。不要用固定 key 请求不同用户或不同路由数据。

### Hydration mismatch

常见原因：

- `Date.now()`、`Math.random()`、随机 ID
- 服务端和浏览器语言或时区不同
- 仅浏览器存在的 localStorage 状态
- 无效 HTML 被浏览器自动修正
- 客户端请求比服务端数据更新得更早
- 第三方组件在 setup 中访问 DOM

查看警告指出的组件，从服务端 HTML 与客户端首次状态不一致的位置开始修复，不要直接关闭警告。

### 环境变量是 undefined

检查是否已在 `runtimeConfig` 声明、环境变量是否使用 `NUXT_` 命名、变量是在构建时还是运行时提供，以及读取私有字段的代码是否误跑到客户端。

### 动态路由静态生成后 404

构建时没有发现该 URL。将动态路径加入 `nitro.prerender.routes`、通过 hook 从数据源生成，或确保 crawlLinks 能从已生成页面发现真实 `<a>` 链接。

### API 在本地正常，部署后失败

检查 Nitro preset、运行时环境变量、数据库网络、文件系统写入、请求超时、原生依赖架构和平台路由规则。必须直接测试目标平台产物。

### CSS 首次加载闪烁

检查样式是否只在客户端插件中动态导入、组件是否被错误包在 ClientOnly、字体是否迟加载，以及 CSS 是否被拆到用户交互后才请求。全局关键样式应由 Nuxt 构建入口发现。

### 如何调试服务端和客户端

- 浏览器 DevTools 查看客户端日志、Network 和 Vue DevTools。
- 运行终端查看 SSR、Nitro 和服务端 API 日志。
- Nuxt DevTools 查看路由、组件、payload 和模块。
- 日志标注运行环境、request ID 和发布版本。
- 不在日志中输出 Cookie、Authorization 和用户隐私。

## 上线检查清单

### 配置与构建

```text
[ ] Node.js、Nuxt、包管理器和 lock 文件版本固定
[ ] nuxi typecheck、测试和生产构建通过
[ ] runtimeConfig 私有值没有进入 public
[ ] 生产环境变量由部署平台注入
[ ] source map 和错误监控版本对应
[ ] 目标 Nitro preset 已在真实平台验证
```

### 路由与数据

```text
[ ] 动态、嵌套和 catch-all 路由返回正确状态码
[ ] 主要内容使用 SSR/SSG-safe 数据获取
[ ] useFetch/useAsyncData key 不会跨用户错误共享
[ ] 所有输入在服务端完成运行时校验
[ ] 外部 API 有超时、错误映射和有限重试
[ ] 404、500 和局部组件错误有明确界面
```

### 安全

```text
[ ] 每个受保护 API 都验证 session、权限和资源所有权
[ ] Session Cookie 使用 HttpOnly、Secure 和合理 SameSite
[ ] Cookie 鉴权写请求具备 CSRF 防护
[ ] v-html 内容经过成熟白名单 sanitizer
[ ] 服务端代理限制协议、域名和目标地址
[ ] 日志、payload 和客户端 bundle 中没有密钥
[ ] CSP 与其他安全响应头已按业务验证
```

### SEO 与性能

```text
[ ] 公开页面 SSR/SSG HTML 包含正文、title 和 description
[ ] canonical、robots、sitemap 使用正式域名
[ ] 图片有尺寸、响应式资源和正确加载优先级
[ ] LCP、INP、CLS 和服务端 TTFB 已监控
[ ] 重型组件和第三方脚本按需加载
[ ] 公共缓存不会混入用户 Cookie 或权限数据
[ ] 动态页面预渲染或 ISR 更新策略已经验证
```

### 部署与运行

```text
[ ] 健康检查、日志、告警和 request ID 可用
[ ] HTTPS、代理头、压缩和缓存响应头正确
[ ] 数据库迁移与旧版本应用兼容
[ ] 发布失败可以回滚应用和配置
[ ] 静态资源在新旧版本切换期间仍可访问
[ ] 低端移动设备和弱网能完成核心流程
```

## 延伸阅读

- [Nuxt 官方文档](https://nuxt.com/docs)
- [Nuxt 迁移指南](https://nuxt.com/docs/getting-started/upgrade)
- [Nitro 文档](https://nitro.build/)
- [Vue 完全指南](/vue/index.md)
- [SEO 优化完全指南](/seo/index.md)
- [Web 性能优化完全指南](/optimization/index.md)
