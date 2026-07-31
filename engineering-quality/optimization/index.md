# Web 性能优化完全指南

性能优化的目标不是追求某个工具中的满分，而是在真实设备和网络下，让用户更快看到主要内容、更快得到交互反馈，并在使用过程中保持稳定。正确的流程是先测量、再定位、按收益排序，最后用监控和预算防止回归。

> 不要在没有数据时优化。实验室测试适合定位问题，真实用户数据决定问题是否普遍，两者需要结合使用。

## 目录

1. [建立性能指标](#建立性能指标)
2. [测量与定位](#测量与定位)
3. [关键渲染路径](#关键渲染路径)
4. [服务端与网络优化](#服务端与网络优化)
5. [图片、字体与媒体](#图片、字体与媒体)
6. [JavaScript 加载优化](#javascript-加载优化)
7. [运行时与交互性能](#运行时与交互性能)
8. [渲染、动画与长列表](#渲染、动画与长列表)
9. [缓存与 Service Worker](#缓存与-service-worker)
10. [构建与第三方脚本](#构建与第三方脚本)
11. [框架应用优化](#框架应用优化)
12. [性能监控与预算](#性能监控与预算)
13. [问题诊断手册](#问题诊断手册)
14. [上线检查清单](#上线检查清单)

## 建立性能指标

### Core Web Vitals

当前核心体验指标是 LCP、INP 和 CLS：

| 指标 | 用户感受 | 良好目标 | 常见问题 |
| --- | --- | --- | --- |
| LCP | 主要内容何时出现 | `≤ 2.5s` | TTFB 慢、首屏图片大、CSS/JS 阻塞 |
| INP | 点击或输入后多久看到反馈 | `≤ 200ms` | 长任务、渲染范围大、第三方脚本阻塞 |
| CLS | 页面是否意外跳动 | `≤ 0.1` | 图片无尺寸、字体切换、动态内容插入 |

这些目标通常以真实用户数据的第 75 百分位判断，并分别观察移动端和桌面端。FID 已被 INP 取代，不应继续作为当前 Core Web Vitals 指标。

### 其他重要指标

| 指标 | 含义 | 适合定位 |
| --- | --- | --- |
| TTFB | 请求到收到首字节的时间 | DNS、连接、CDN、服务端和缓存 |
| FCP | 第一个文本或图片出现的时间 | 首屏资源阻塞与 HTML 返回速度 |
| TBT | 实验室测试中主线程阻塞总时长 | INP 的实验室代理指标之一 |
| Speed Index | 可视区域内容填充速度 | 首屏整体呈现过程 |
| Long Task | 主线程连续占用超过 50ms 的任务 | JavaScript 执行与渲染阻塞 |

TTI 容易受网络静默和长连接影响，现在通常不作为核心决策指标。优化时更应关注可解释的 LCP、INP、CLS、TBT 和业务交互耗时。

### 业务指标

技术指标必须与用户任务结合。例如：

- 搜索框输入到结果更新的耗时
- 商品列表筛选到内容稳定的耗时
- 编辑器首次可输入时间
- 登录提交到进入工作台的耗时
- 上传操作从选择文件到可继续工作的耗时

一个 LCP 很快但点击按钮后卡住两秒的页面，不能算性能良好。

### 百分位而不是平均值

平均值会掩盖弱网和低端设备用户。常见做法是观察：

- P50：典型用户体验
- P75：Core Web Vitals 常用判断位置
- P95：明显受影响的尾部用户

监控数据还应按页面、设备、网络类型、地区、浏览器和应用版本分组。全站汇总很容易掩盖局部回归。

## 测量与定位

### 实验室数据与真实用户数据

| 类型 | 优点 | 局限 | 常用工具 |
| --- | --- | --- | --- |
| 实验室 Lab | 环境可重复、能查看瀑布图和调用栈 | 不代表真实用户分布 | Lighthouse、DevTools、WebPageTest |
| 真实用户 RUM | 反映真实设备、网络和交互 | 噪声多、定位需要更多上下文 | `web-vitals`、Performance API、监控平台 |

推荐流程：

1. 用 RUM 找到受影响的页面、版本和用户群。
2. 在实验室复现相似设备与网络条件。
3. 用 Performance、Network 和 Memory 面板定位根因。
4. 修复后先比较实验室结果，再观察真实用户趋势。

### 使用 web-vitals 上报

```bash
npm install web-vitals
```

```ts
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import type { Metric } from 'web-vitals'

function reportMetric(metric: Metric) {
  const payload = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    path: location.pathname,
    release: '2026.07.30',
  }

  const body = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  })

  navigator.sendBeacon('/rum/web-vitals', body)
}

onCLS(reportMetric)
onFCP(reportMetric)
onINP(reportMetric)
onLCP(reportMetric)
onTTFB(reportMetric)
```

上报时避免采集输入内容、完整 URL 查询参数和用户隐私。指标应关联发布版本，才能判断回归从哪次部署开始。

### Navigation Timing

```ts
const [navigation] = performance.getEntriesByType(
  'navigation',
) as PerformanceNavigationTiming[]

if (navigation) {
  const timing = {
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domReady: navigation.domContentLoadedEventEnd - navigation.startTime,
    load: navigation.loadEventEnd - navigation.startTime,
  }

  console.table(timing)
}
```

连接复用、缓存和 Service Worker 会改变部分阶段的含义，分析前应同时记录 `transferSize`、协议和导航类型。

### 观察长任务

```ts
if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.warn('Long task:', {
        startTime: entry.startTime,
        duration: entry.duration,
      })
    }
  })

  observer.observe({ type: 'longtask', buffered: true })
}
```

Long Task 只能告诉你主线程被占用，需要结合 DevTools Performance 面板中的调用栈、事件和渲染阶段定位具体代码。

### 性能测试要固定条件

记录以下信息，保证前后结果可比较：

```text
页面与测试步骤
应用版本和提交
设备或 CPU 降速倍数
网络延迟和带宽
冷缓存还是热缓存
登录状态和测试数据规模
每个场景的重复次数
```

单次 Lighthouse 分数波动很常见，重要变更应执行多次并看中位数。

## 关键渲染路径

### 浏览器如何显示页面

简化流程如下：

```text
HTML → DOM ┐
           ├→ Render Tree → Layout → Paint → Composite
CSS  → CSSOM ┘

JavaScript 可能读取或修改 DOM/CSSOM，并阻塞其中多个阶段
```

首屏优化的核心是：尽快返回必要 HTML，让浏览器尽早发现关键资源，并减少渲染前必须下载和执行的工作。

### HTML 优先返回有意义的内容

- SSR/SSG 页面应在 HTML 中包含首屏主要内容。
- 不要让用户等待大型 JavaScript 下载后才看到空容器。
- 流式 SSR 可以先发送外壳和高优先级内容，但要避免水合失败。
- 骨架屏只用于表达加载状态，不能掩盖实际数据请求过慢。

### CSS 阻塞

CSS 默认会阻塞渲染，因为浏览器需要样式才能正确绘制页面：

- 删除未使用 CSS，按页面拆分大型样式包。
- 首屏关键 CSS 可以内联，但必须控制大小并避免每页复制大量内容。
- 非关键样式可按媒体条件或页面异步加载。
- 避免深层 `@import`，它会延迟资源发现。
- 不要为了“减少重排”把所有页面 CSS 打进首屏包。

```html
<link rel="stylesheet" href="/assets/app.a1b2c3.css" />
<link
  rel="stylesheet"
  href="/assets/print.css"
  media="print"
/>
```

### JavaScript 的加载行为

| 写法 | 下载 | 执行时机 | 适用场景 |
| --- | --- | --- | --- |
| 普通 `<script>` | 遇到即下载 | 阻塞 HTML 解析并立即执行 | 极少量必须同步运行的脚本 |
| `defer` | 与 HTML 并行 | HTML 解析后按顺序执行 | 传统应用脚本 |
| `async` | 与 HTML 并行 | 下载完成立即执行，顺序不定 | 无依赖的统计或独立脚本 |
| `type="module"` | 与 HTML 并行 | 默认类似 defer | 现代模块入口 |

```html
<script defer src="/assets/legacy-app.js"></script>
<script type="module" src="/assets/app.js"></script>
```

把脚本移动到 body 底部不是万能方案。现代项目应明确使用 module、defer 和代码分割控制时机。

### 资源提示

```html
<!-- 提前连接确定会使用的重要跨域源 -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin />

<!-- 当前页面渲染必需且浏览器不易提前发现的资源 -->
<link
  rel="preload"
  href="/fonts/inter-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- 未来导航可能使用，优先级较低 -->
<link rel="prefetch" href="/assets/editor-page.js" />
```

preload 必须设置正确的 `as`、类型和跨域属性，否则可能重复下载。不要预加载大量资源，过多高优先级请求会争抢首屏带宽。

## 服务端与网络优化

### 分解 TTFB

TTFB 包含：

```text
DNS + 建连/TLS + 网络往返 + CDN/代理 + 服务端排队与计算
```

优化前先确定耗时发生在哪一段：

- DNS/连接慢：减少关键域名、使用 CDN、合理 `preconnect`。
- 边缘未命中：检查 CDN cache key、响应头和回源策略。
- 应用处理慢：分析数据库、下游 API、模板渲染和锁等待。
- 冷启动慢：调整运行平台、预热或减少初始化工作。
- 用户距离远：静态内容和可缓存 HTML 尽量边缘分发。

### 服务端常见优化

- 为数据库查询建立合适索引，避免 N+1 查询。
- 对独立的下游请求并行处理，而不是顺序等待。
- 给所有外部调用设置超时、取消和降级路径。
- 缓存稳定且高频的计算结果，明确失效规则。
- 分页返回数据，不在首屏传输整张大表。
- 使用压缩，但避免重复压缩图片、视频等已压缩格式。

```ts
// 顺序请求：总时间接近二者相加
const profile = await getProfile(userId)
const permissions = await getPermissions(userId)

// 相互独立时并行请求
const [profile, permissions] = await Promise.all([
  getProfile(userId),
  getPermissions(userId),
])
```

### HTTP/2 和 HTTP/3

HTTP/2 支持多路复用和头部压缩，HTTP/3 基于 QUIC 改善部分弱网和丢包场景。但协议升级不能消除：

- 过大的 JavaScript 解析和执行成本
- 过多第三方域名的连接成本
- 无缓存资源的重复下载
- 服务端查询和业务逻辑过慢

不要因为 HTTP/2 就把应用拆成几百个微小 chunk。请求调度、压缩率和缓存命中仍然需要平衡。

### 压缩

文本资源通常使用 Brotli 或 gzip：

```http
Content-Encoding: br
Vary: Accept-Encoding
```

Brotli 高压缩级别会增加动态响应 CPU 成本，静态资源适合构建阶段预压缩。压缩前后的文件大小都应进入构建报告。

### CDN 策略

CDN 适合缓存带 hash 的静态资源、公开图片、字体和可共享页面。配置时关注：

- cache key 是否错误包含或忽略查询参数、Cookie 和请求头
- 是否尊重源站 Cache-Control
- 清理缓存是否精确，是否依赖全站 purge
- 跨地区回源和错误降级
- 字体与接口的 CORS 响应头

## 图片、字体与媒体

### 选择图片格式

| 内容 | 推荐格式 |
| --- | --- |
| 照片和复杂渐变 | AVIF、WebP，保留 JPEG 回退 |
| 透明图片 | AVIF、WebP、PNG |
| 图标和简单矢量 | SVG |
| 动画 | 视频、动画 WebP/AVIF，视兼容性决定 |

格式只是一个维度。正确尺寸、压缩质量、缓存和加载时机通常同样重要。

### 响应式图片

```html
<picture>
  <source
    type="image/avif"
    srcset="/hero-640.avif 640w, /hero-1280.avif 1280w"
  />
  <source
    type="image/webp"
    srcset="/hero-640.webp 640w, /hero-1280.webp 1280w"
  />
  <img
    src="/hero-1280.jpg"
    srcset="/hero-640.jpg 640w, /hero-1280.jpg 1280w"
    sizes="(max-width: 720px) 100vw, 1200px"
    width="1200"
    height="675"
    alt="产品工作台界面"
    fetchpriority="high"
    decoding="async"
  />
</picture>
```

首屏 LCP 图片：

- 不使用 `loading="lazy"`
- 在初始 HTML 中直接出现，不通过脚本延迟插入
- 必要时使用 `fetchpriority="high"`，但页面通常只有一个高优先级候选
- 响应式尺寸与实际布局匹配

首屏以下图片可以使用：

```html
<img
  src="/article-thumbnail.webp"
  width="480"
  height="270"
  alt="文章缩略图"
  loading="lazy"
  decoding="async"
/>
```

### 避免 CLS

为图片、视频、广告、iframe 和异步组件预留空间：

```css
.video-frame {
  aspect-ratio: 16 / 9;
  width: 100%;
}

.video-frame iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
```

不要在用户正在阅读的内容上方插入通知条。必须插入时，提前预留区域或使用不推动正文的覆盖层，并保证可访问性。

### 字体加载

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  font-style: normal;
}
```

实践原则：

- 优先 WOFF2，删除未使用字重和字符集。
- 只预加载首屏确定使用的少量字体文件。
- `font-display: swap` 减少不可见文本时间。
- 调整回退字体的 `size-adjust` 等指标可降低切换时布局偏移。
- 图标优先使用 SVG 或图标组件，避免为少量图标加载整套字体。

### 视频

- 不自动加载首屏不可见的大视频。
- 使用 `preload="metadata"` 或 `none` 控制预加载。
- 提供 poster，避免空白区域。
- 按带宽和设备提供多码率版本。
- 背景视频应尊重省流量和减少动态效果偏好。

## JavaScript 加载优化

### 先减少，再压缩

JavaScript 的成本包括下载、解压、解析、编译、执行和内存占用。压缩后的 200 KB 在低端设备上仍可能产生明显执行成本。

优先级通常是：

1. 删除不需要的功能和依赖。
2. 只向当前页面发送需要的代码。
3. 延迟非关键功能。
4. 再使用压缩、minify 和 Brotli。

### 路由和功能级代码分割

```ts
const openEditor = async () => {
  const { createEditor } = await import('./editor')
  return createEditor(document.querySelector('#editor'))
}
```

动态导入适合体积大、不是首屏必需、且有明确交互入口的功能。拆分后应处理加载中和失败状态：

```ts
try {
  const module = await import('./chart-page')
  module.mountChartPage()
} catch (error) {
  showRetryMessage('图表模块加载失败')
}
```

### Tree Shaking 的前提

- 使用 ESM `import/export`。
- 避免模块顶层不可预测副作用。
- 包作者正确声明 `sideEffects`。
- 按需导入，确认组件库是否真正支持 tree shaking。
- 通过 bundle analyzer 验证，而不是只看代码写法。

```ts
// 如果库支持 ESM 和 tree shaking，这种写法通常更容易优化
import { format } from 'date-fns'

// 某些 CommonJS 库可能仍把大量代码打入产物
const utils = require('large-utils-library')
```

### 避免重复依赖

锁文件中可能同时存在多个大版本，或者主应用和组件库各自打包同一依赖。分析产物时检查：

- 同一库的多个版本
- locale、时区和语言包是否全部打入
- 只使用少量函数却引入整个工具库
- 服务端专用代码是否误入客户端 bundle

### 预取的时机

鼠标悬停或链接进入视口时可以低优先级预取下一页，但应考虑流量：

```ts
function prefetchEditor() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection

  if (connection?.saveData) return
  void import('./editor-page')
}
```

不要在首页启动时预取所有路由，这会把延迟加载重新变成一次性加载。

## 运行时与交互性能

### 理解主线程

主线程需要处理 JavaScript、样式计算、布局、绘制和输入事件。单个任务持续时间过长，用户点击只能排队等待，INP 就会变差。

一个交互大致包含：

```text
输入延迟 → 事件处理代码 → 样式/布局/绘制 → 下一帧显示反馈
```

优化不能只盯着事件处理函数。处理结束后触发的大范围渲染同样属于交互延迟。

### 拆分长任务

```ts
async function yieldToMainThread() {
  const scheduler = (
    globalThis as typeof globalThis & {
      scheduler?: { yield?: () => Promise<void> }
    }
  ).scheduler

  if (scheduler?.yield) {
    await scheduler.yield()
    return
  }

  await new Promise<void>((resolve) => setTimeout(resolve, 0))
}

async function processItems(items: Item[]) {
  const result: ProcessedItem[] = []

  for (let index = 0; index < items.length; index += 1) {
    result.push(processItem(items[index]))

    if (index > 0 && index % 100 === 0) {
      await yieldToMainThread()
    }
  }

  return result
}
```

拆分会增加调度开销，应根据真实任务长度和用户交互测量批次大小。能够改成服务端计算、增量算法或 Worker 的任务，通常比无限切片更合理。

### 优先给出即时反馈

点击后先更新必要 UI，再执行次要工作：

```ts
button.addEventListener('click', async () => {
  button.disabled = true
  button.textContent = '保存中...'

  await yieldToMainThread()

  try {
    await saveDocument()
    showMessage('保存成功')
  } finally {
    button.disabled = false
    button.textContent = '保存'
  }
})
```

不要把“点击动画”放进 Promise 最后才显示，否则网络快慢会直接影响用户是否感知到操作已触发。

### Web Worker

CPU 密集且不依赖 DOM 的任务可以移到 Worker：

```ts
// main.ts
const worker = new Worker(new URL('./search.worker.ts', import.meta.url), {
  type: 'module',
})

worker.postMessage({ type: 'BUILD_INDEX', documents })
worker.addEventListener('message', (event) => {
  if (event.data.type === 'INDEX_READY') {
    enableSearch()
  }
})
```

```ts
// search.worker.ts
self.addEventListener('message', (event) => {
  if (event.data.type !== 'BUILD_INDEX') return

  const index = buildSearchIndex(event.data.documents)
  self.postMessage({ type: 'INDEX_READY', index })
})
```

Worker 传输大对象也有序列化成本。可以减少消息次数、使用 Transferable，或者让 Worker 自己获取和维护数据。

### 事件处理

```ts
document.querySelector('.list')?.addEventListener('click', (event) => {
  const target = (event.target as Element).closest('[data-item-id]')
  if (!target) return

  const itemId = target.getAttribute('data-item-id')
  if (!itemId) return

  openItem(itemId)
})
```

事件委托适合大量行为一致的子项。滚动和触摸监听器若不调用 `preventDefault`，可以声明 passive：

```ts
window.addEventListener('touchstart', handleTouch, { passive: true })
```

输入联想使用防抖，滚动进度使用节流或 `requestAnimationFrame`，但不要用它们隐藏本应优化的昂贵计算。

### 避免布局抖动

循环中交替读取布局和写入样式会触发反复同步布局：

```ts
// 不推荐：每次写入后又读取布局
for (const item of items) {
  item.style.width = `${container.offsetWidth / 2}px`
}

// 推荐：先读取一次，再批量写入
const width = container.offsetWidth / 2
for (const item of items) {
  item.style.width = `${width}px`
}
```

常见布局读取包括 `offsetWidth`、`getBoundingClientRect()` 和部分 `getComputedStyle()` 调用。

### 内存泄漏

重点检查：

- 页面销毁后仍存在的全局事件监听器
- 未取消的定时器、订阅、Observer 和网络请求
- 闭包长期引用大对象或 DOM 节点
- 无上限缓存、日志和状态历史
- 被移除 DOM 的 detached nodes

```ts
const controller = new AbortController()

window.addEventListener('resize', handleResize, {
  signal: controller.signal,
})

fetch('/api/data', { signal: controller.signal })

// 页面卸载或组件销毁
controller.abort()
```

内存增长不一定是泄漏，垃圾回收会造成锯齿状曲线。使用多次进入/退出同一页面后的堆快照确认对象是否持续无法释放。

## 渲染、动画与长列表

### 缩小 DOM 和样式影响范围

- 不渲染当前不可见且不需要的复杂组件。
- 避免成千上万个同时存在的 DOM 节点。
- 组件样式不要依赖过深、过宽的祖先选择器。
- 通过 CSS containment 隔离独立区域。

```css
.dashboard-widget {
  contain: layout paint;
}

.article-card-list {
  content-visibility: auto;
  contain-intrinsic-size: auto 300px;
}
```

`content-visibility: auto` 可以跳过屏外内容渲染，但仍需验证浏览器兼容性、查找、焦点和可访问性行为。

### 动画属性

优先动画 `transform` 和 `opacity`，它们通常不需要每帧重新布局：

```css
.panel {
  transform: translateX(0);
  transition: transform 180ms ease, opacity 180ms ease;
}

.panel.is-hidden {
  transform: translateX(-12px);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: none;
  }
}
```

`will-change` 会消耗内存，不应全局或长期添加。只在确认合成层能改善具体动画时短期使用。

### requestAnimationFrame

```ts
let scheduled = false

window.addEventListener(
  'scroll',
  () => {
    if (scheduled) return
    scheduled = true

    requestAnimationFrame(() => {
      updateScrollIndicator(window.scrollY)
      scheduled = false
    })
  },
  { passive: true },
)
```

`requestAnimationFrame` 只是把工作安排到帧前，不会让昂贵工作自动变快。回调仍应在一帧预算内完成。

### 长列表虚拟化

当列表包含数千项时，只渲染视口附近元素。虚拟列表需要正确处理：

- 动态高度和测量缓存
- 键盘焦点与屏幕阅读器
- 滚动定位和历史恢复
- 列表项稳定 key
- 数据分页与占位状态

数据只有几十项时，虚拟化的复杂度和测量开销可能得不偿失。

## 缓存与 Service Worker

### HTTP 缓存策略

带内容 hash 的静态资源：

```http
Cache-Control: public, max-age=31536000, immutable
```

HTML 需要及时检查更新：

```http
Cache-Control: no-cache
ETag: "page-version-123"
```

`no-cache` 表示使用前必须重新验证，不等于完全不存储。真正敏感且不应落盘的响应使用：

```http
Cache-Control: no-store
```

### 文件名与更新

```text
index.html                 短缓存或每次验证
assets/app.3f8a91.js       一年 immutable
assets/app.74c102.css      一年 immutable
images/logo.2ac8.svg       一年 immutable
```

HTML 更新后引用新的 hash 文件，旧页面仍可继续使用旧资源。不要用不变文件名配一年缓存，否则发布后用户可能长期拿到旧代码。

### ETag 与 Last-Modified

条件请求命中时服务器返回 `304`，可以省去响应体，但仍有一次网络往返。对于 hash 静态资源，强缓存更高效；对于 HTML 或 API，条件请求更合适。

### API 缓存

根据数据性质选择：

- 公共且短期稳定：CDN `s-maxage` + 浏览器缓存
- 用户私有数据：`private`，并正确设置 `Vary` 或禁止共享缓存
- 实时敏感数据：`no-store`
- 可接受短暂旧数据：stale-while-revalidate

```http
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600
```

缓存前必须确认响应不会因 Cookie、Authorization 或地区等条件泄漏给其他用户。

### Service Worker 策略

Service Worker 适合离线、应用壳和精细缓存，但会增加版本管理复杂度：

| 资源 | 常见策略 |
| --- | --- |
| 版本化静态资源 | Cache First |
| 页面导航 | Network First 或带超时的回退 |
| 新闻列表等更新内容 | Stale While Revalidate |
| 支付、账户等敏感接口 | Network Only |

正式项目优先使用 Workbox 等成熟工具管理 precache、版本和清理，不要让旧 Service Worker 永久控制用户页面。必须测试离线、首次安装、跨版本升级和回滚。

### localStorage 不是网络缓存

`localStorage` 是同步 API，会阻塞主线程，容量有限，也缺少 HTTP 缓存语义。大量结构化数据使用 IndexedDB；服务端资源优先通过 HTTP Cache 和 Cache Storage 管理。

## 构建与第三方脚本

### 分析构建产物

每次优化前回答：

- 首屏下载了哪些 chunk？
- 哪些依赖体积最大？
- 是否存在重复版本？
- source map 显示哪些模块进入了意外页面？
- 压缩前后和解析执行成本分别是多少？

Vite/Rollup 可使用 bundle visualizer，Webpack 可生成 stats 并通过 analyzer 查看。分析生产构建，不要以开发服务器模块数量判断产物大小。

### Vite 构建示例

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2020',
    sourcemap: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
  },
})
```

`chunkSizeWarningLimit` 只是提示阈值，不会自动优化。手工 `manualChunks` 可能造成依赖重复、加载瀑布和缓存失效，应以页面加载结果验证。

### 浏览器目标

过度兼容旧浏览器会带来更多转译、polyfill 和体积。根据真实用户浏览器数据设置目标，不要盲目使用最老语法目标，也不要在不支持的浏览器中直接失败。

### Source Map

生产 source map 对错误定位很重要，但可能暴露源码：

- 上传到错误监控平台后不公开部署，或限制访问。
- source map 与发布版本一一对应。
- 不把密钥放进前端源码，隐藏 source map 也不能保护密钥。

### 第三方脚本

统计、客服、广告、A/B 测试和播放器经常占用大量主线程。接入前记录：

- 下载和执行体积
- 是否阻塞首屏
- 是否读取大量 DOM 或注册全局监听
- 失败、超时或被拦截时是否影响主流程
- 收集哪些数据，是否满足隐私要求

非必要脚本在用户同意或真正需要时加载。使用 Web Worker 代理第三方脚本前要确认它对 DOM、Cookie 和同步 API 的依赖。

## 框架应用优化

### 通用原则

- 状态放在最小需要范围，避免全局状态更新触发整页渲染。
- 列表使用稳定 key，不用数组索引代表会重排的业务项。
- 路由级懒加载，重型编辑器、图表和地图按需加载。
- 派生数据避免在每次渲染重复执行昂贵计算。
- 大数据列表分页或虚拟化。
- SSR 页面避免向客户端传输巨大且重复的水合数据。

### React

```tsx
import { lazy, Suspense } from 'react'

const AnalyticsPage = lazy(() => import('./AnalyticsPage'))

export function RouteView() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnalyticsPage />
    </Suspense>
  )
}
```

`memo`、`useMemo` 和 `useCallback` 有比较和维护成本。先用 React Profiler 确认重复渲染昂贵，再稳定 props 和计算边界，不要全项目机械添加缓存。

### Vue

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import ChartSkeleton from './ChartSkeleton.vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  delay: 150,
  timeout: 10000,
})
</script>
```

大型不可变数据可以评估 `shallowRef`，第三方复杂实例可以评估 `markRaw`。使用前先确认深层响应式转换确实是瓶颈，不要破坏依赖更新。

### SSR 与水合

SSR 能改善首屏 HTML 返回，但也可能增加服务端耗时和客户端水合成本。重点检查：

- 服务端是否串行请求数据
- HTML 中是否重复嵌入大型 JSON
- 客户端是否为静态内容水合大量组件
- 第三方组件是否造成水合不一致
- 流式内容是否正确设置优先级和错误边界

性能方案应同时测量服务端 TTFB、HTML 大小、客户端 JS 和交互时间。

## 性能监控与预算

### 建立性能预算

预算应与页面类型和用户设备匹配，例如：

```text
移动端产品列表页（P75）
LCP ≤ 2.5s
INP ≤ 200ms
CLS ≤ 0.1

首次加载资源（Brotli）
JavaScript ≤ 180 KB
CSS ≤ 60 KB
首屏图片 ≤ 250 KB
第三方脚本 ≤ 80 KB

关键业务交互
筛选结果更新 P75 ≤ 300ms
```

预算不是永远不变的数字。新功能确实创造价值时可以调整，但必须明确增加了多少成本、影响哪些用户，以及是否有替代方案。

### CI 防回归

持续集成至少检查：

- 生产构建成功
- 入口和路由 chunk 体积是否超过阈值
- Lighthouse CI 的关键指标或性能分数
- 关键页面截图和交互测试
- 依赖变更是否显著增加产物

实验室 CI 环境有波动，适合阻止明显回归，不应因 1 分差异频繁阻断发布。体积预算是更稳定的硬约束，时间指标可设置合理容差。

### RUM 数据模型

建议记录：

```ts
interface PerformanceEvent {
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB' | 'business'
  value: number
  rating?: 'good' | 'needs-improvement' | 'poor'
  path: string
  release: string
  deviceClass?: 'low' | 'mid' | 'high'
  connectionType?: string
  navigationType?: string
  timestamp: number
}
```

高流量站点可以采样，但错误和极慢样本不应全部被随机丢弃。数据保留、用户标识和地理信息必须符合隐私要求。

### 发布对比

每次发布对比相同页面和用户群的 P50/P75/P95。出现回归时关联：

- 发布版本和功能开关
- 新增依赖或第三方脚本
- API 和服务端耗时
- 缓存命中率
- 设备、网络、浏览器分布变化

不要只看全站 Lighthouse 平均分。

## 问题诊断手册

### LCP 差

按顺序检查：

1. LCP 元素到底是什么，是图片、标题还是内容容器。
2. TTFB 是否已经占用大部分时间。
3. 浏览器何时发现 LCP 资源，是否被脚本或 CSS 背景图延迟。
4. LCP 图片是否被误设 lazy，尺寸是否远大于显示尺寸。
5. CSS 或同步脚本是否阻塞渲染。
6. 元素出现后是否又被客户端渲染替换。

### INP 差

1. 找到最慢交互类型和目标元素。
2. 拆分输入延迟、事件处理和渲染耗时。
3. 在 Performance 面板查看 Long Task 调用栈。
4. 检查状态更新是否导致大范围组件重渲染。
5. 将 CPU 密集任务增量化或移到 Worker。
6. 限制第三方脚本和同步存储操作。

### CLS 高

1. 使用 Layout Shift 轨迹定位发生移动的元素。
2. 检查图片、广告、iframe 和异步组件尺寸。
3. 检查 Web Font 切换前后的字形指标。
4. 检查顶部通知、Cookie 条和实验模块是否晚插入。
5. 验证动画是否错误使用影响布局的属性。

### JavaScript 体积突然增加

1. 对比构建产物和 lock 文件。
2. 检查新依赖是否包含 locale、编辑器、图表或 polyfill 全量包。
3. 检查 dynamic import 是否被静态导入链拉回首屏。
4. 检查同一依赖是否出现多个版本。
5. 确认 tree shaking 和 `sideEffects` 配置。

### 页面使用一段时间后越来越卡

1. 重复进入和退出页面，观察监听器、定时器和 DOM 数量。
2. 比较多次堆快照，查找持续增长的对象类型。
3. 检查缓存、日志、消息列表和历史状态是否无限增长。
4. 检查 WebSocket、Observer、Worker 和媒体流是否释放。
5. 检查后台页面是否仍在动画或轮询。

### 本地很快，线上很慢

- 本地通常没有真实网络、TLS 和跨地域延迟。
- 开发数据量可能远小于生产环境。
- 本地没有广告、统计和客服脚本。
- CDN、缓存键和压缩可能只在生产配置中出错。
- 生产用户设备性能远低于开发电脑。

使用生产构建、网络和 CPU 降速测试，并以 RUM 数据确认影响范围。

## 上线检查清单

### 测量

```text
[ ] 记录变更前基线和可重复测试步骤
[ ] 区分实验室数据与真实用户数据
[ ] 监控 LCP、INP、CLS 及关键业务交互
[ ] 指标包含页面、设备和发布版本维度
[ ] 建立资源体积和关键指标预算
```

### 加载

```text
[ ] 首屏 HTML 尽早包含主要内容和关键资源地址
[ ] LCP 图片尺寸正确、未懒加载、格式和优先级合理
[ ] 图片、视频、广告和异步区域预留尺寸
[ ] 非关键路由和重型功能按需加载
[ ] 字体仅包含需要的字重与字符集
[ ] 关键资源没有不必要的跨域连接和请求瀑布
```

### 缓存与构建

```text
[ ] hash 静态资源使用长期 immutable 缓存
[ ] HTML 能及时验证更新，不与旧 chunk 失配
[ ] 私有 API 不会被共享缓存泄漏
[ ] 生产 bundle 无重复大依赖和测试代码
[ ] source map 与发布版本对应且未意外公开
[ ] Service Worker 已测试首次安装、升级、离线和回滚
```

### 运行时

```text
[ ] 关键交互没有明显长任务和大范围重渲染
[ ] 事件监听器、定时器、请求和 Worker 能正确清理
[ ] 长列表使用分页或经过验证的虚拟化
[ ] 动画优先 transform/opacity 并尊重 reduced motion
[ ] 第三方脚本失败或被拦截不影响主流程
[ ] 低端设备和弱网能够完成核心任务
```

## 延伸阅读

- [web.dev Performance](https://web.dev/performance/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [MDN Performance API](https://developer.mozilla.org/docs/Web/API/Performance_API)
- [SEO 优化完全指南](/engineering-quality/seo/index.md)
