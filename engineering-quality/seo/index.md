# SEO 优化完全指南

SEO（Search Engine Optimization）不是简单地“多写关键词”，而是让搜索引擎能够发现、抓取、理解并正确展示页面，同时让页面真正解决用户的问题。有效的 SEO 需要内容、前端、服务端、产品和数据分析共同参与。

> SEO 通常需要数周甚至数月才能看到稳定变化。不要把短期排名波动直接归因于某一次代码修改，应通过抓取、索引、曝光、点击和转化数据逐层判断。

## 目录

1. [SEO 的工作链路](#seo-的工作链路)
2. [制定目标与关键词策略](#制定目标与关键词策略)
3. [抓取与索引](#抓取与索引)
4. [页面级技术 SEO](#页面级技术-seo)
5. [JavaScript 与 Docsify SEO](#javascript-与-docsify-seo)
6. [结构化数据](#结构化数据)
7. [内容与内部链接](#内容与内部链接)
8. [图片、移动端与多语言](#图片、移动端与多语言)
9. [性能与 Core Web Vitals](#性能与-core-web-vitals)
10. [监控、诊断与迭代](#监控、诊断与迭代)
11. [上线检查清单](#上线检查清单)

## SEO 的工作链路

### 从发现到转化

一个页面获得自然搜索流量，通常要经过以下阶段：

```text
发现 URL → 抓取页面 → 渲染内容 → 建立索引
    → 理解主题与质量 → 参与排序 → 搜索结果曝光
    → 用户点击 → 页面解决问题 → 完成业务转化
```

每个阶段对应不同问题：

| 现象 | 优先检查 |
| --- | --- |
| 搜索引擎不知道页面存在 | 内部链接、sitemap、外部发现入口 |
| 已发现但长期不抓取 | 服务器稳定性、重复 URL、站点质量、抓取预算 |
| 已抓取但未索引 | `noindex`、canonical、内容重复或价值不足 |
| 已索引但没有曝光 | 搜索意图不匹配、主题不明确、竞争力不足 |
| 有曝光但点击率低 | title、description、品牌与结果展示形式 |
| 有点击但快速离开 | 内容与查询不匹配、性能差、页面不可用 |
| 流量增长但没有价值 | 关键词意图与业务目标不一致 |

不要跳过前一阶段直接优化后一阶段。例如页面尚未索引时，反复调整关键词密度没有意义。

### SEO 的三个层面

1. **技术 SEO**：抓取、索引、状态码、URL、渲染、性能和结构化数据。
2. **内容 SEO**：搜索意图、主题覆盖、可信度、更新维护和信息结构。
3. **站点与品牌信号**：内部链接、外部引用、品牌认知和真实用户反馈。

SEO 不是单个排名因子的游戏。搜索系统会综合页面相关性、内容质量、可用性、来源可信度和查询场景。

## 制定目标与关键词策略

### 先确定业务目标

将 SEO 指标分成三层：

| 层级 | 指标示例 | 作用 |
| --- | --- | --- |
| 搜索表现 | 索引量、曝光、平均排名、点击率 | 判断能否被发现和点击 |
| 用户行为 | 有效阅读、关键交互、回访 | 判断内容是否解决问题 |
| 业务结果 | 注册、询价、订阅、购买 | 判断流量是否产生价值 |

“自然流量增长 30%”不是完整目标。更好的目标是：“六个月内，让 JavaScript 教程相关非品牌查询带来的有效阅读用户增长 30%，并保持核心页面转化率不下降。”

### 理解搜索意图

同一个关键词背后可能有不同意图：

- **信息型**：了解概念或解决问题，例如“JavaScript 防抖怎么写”
- **导航型**：寻找特定网站或产品，例如“MDN Promise”
- **比较型**：评估多个方案，例如“Electron 和 Tauri 对比”
- **交易型**：准备购买、下载或注册

内容形式要匹配意图。查询“如何配置 robots.txt”的用户需要示例和排错方法，不需要先阅读大段搜索引擎历史。

### 建立主题集群

不要让多篇文章争夺同一个查询。可以用“中心页 + 子主题”的结构组织内容：

```text
JavaScript 完全指南（中心页）
├─ 数据类型与判断
├─ 函数与作用域
├─ 数组常用方法
├─ 防抖与节流
└─ 深度优先和广度优先遍历
```

中心页解释知识结构并链接到详细文章，详细文章再链接回中心页和相关主题。这样既帮助读者导航，也让搜索引擎理解页面关系。

### 关键词研究的实际步骤

1. 收集产品、用户问题、站内搜索和客服反馈中的原始主题。
2. 从 Search Console、Google/Bing/Baidu 建议词及第三方工具扩展查询。
3. 查看搜索结果，判断真实意图和常见内容形式。
4. 按主题合并同义词，不为每个拼写变体创建一篇页面。
5. 评估业务相关性、竞争程度和内容成本。
6. 将目标查询映射到唯一的主页面。

关键词工具给出的搜索量是估算值，不应成为唯一依据。小流量但意图明确的长尾查询，可能比宽泛的大词更有价值。

## 抓取与索引

### 使用正确的 HTTP 状态码

| 状态码 | 使用场景 | SEO 影响 |
| --- | --- | --- |
| `200` | 页面正常并有有效内容 | 可以参与索引 |
| `301` / `308` | URL 永久迁移 | 通常传递主要信号到新地址 |
| `302` / `307` | 临时跳转 | 原 URL 可能继续保留 |
| `404` | 页面不存在 | URL 会逐渐移出索引 |
| `410` | 内容明确永久删除 | 比 404 更明确地表达删除 |
| `429` | 请求过多 | 提示爬虫稍后再试 |
| `500` / `503` | 服务异常或临时维护 | 长期持续会影响抓取和索引 |

错误页面不能返回 `200`，否则会形成 soft 404。维护期间优先返回 `503` 和合理的 `Retry-After`，不要把全站临时重定向到首页。

### robots.txt

根目录的 `robots.txt` 用来控制爬虫是否允许抓取路径：

```text
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml
```

注意：

- `Disallow` 只阻止抓取，不保证 URL 不出现在搜索结果中。
- 要阻止索引，应让爬虫能够访问页面并读取 `noindex`。
- 不要在 robots.txt 中暴露后台、测试地址或敏感文件名；它是公开文件。
- robots.txt 不是访问控制，真正的私密内容必须经过身份认证。

### noindex 与 nofollow

不希望页面进入索引时使用：

```html
<meta name="robots" content="noindex, follow" />
```

也可以通过响应头控制非 HTML 文件：

```http
X-Robots-Tag: noindex
```

`nofollow` 不是隐藏链接或阻止抓取的可靠方法。站内正常导航一般不需要添加它；广告、赞助和用户生成链接应使用合适的 `rel` 值，例如 `sponsored` 或 `ugc`。

### XML Sitemap

Sitemap 应只包含希望被索引的规范 URL：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/js/</loc>
    <lastmod>2026-07-30</lastmod>
  </url>
  <url>
    <loc>https://example.com/seo/</loc>
    <lastmod>2026-07-30</lastmod>
  </url>
</urlset>
```

实践原则：

- 不包含重定向、404、`noindex` 或 canonical 指向别处的 URL。
- `lastmod` 只在主要内容真实变化时更新，不要每次部署都伪造更新时间。
- 大型站点可按内容类型拆分 sitemap，并使用 sitemap index。
- Sitemap 能帮助发现 URL，但不能保证索引。

### URL 与 canonical

一个内容可能因参数、大小写、尾斜杠或协议产生多个 URL。应选择唯一规范地址：

```html
<link rel="canonical" href="https://example.com/articles/seo-guide" />
```

canonical 是强提示，不是绝对指令。以下信号应保持一致：

- 内部链接都指向规范 URL
- sitemap 只包含规范 URL
- HTTP 到 HTTPS、旧域名到新域名使用永久重定向
- canonical 页面返回 `200`，且内容与当前页等价

不要把所有页面 canonical 到首页，这会让搜索引擎忽略错误配置。

### 参数、筛选和分页

电商筛选、排序和追踪参数容易产生大量重复 URL：

```text
/products?category=phone&sort=price&utm_source=newsletter
```

常见策略：

- 追踪参数不改变主体内容，canonical 到无追踪参数的 URL。
- 只有具备独立搜索需求的筛选组合才创建可索引落地页。
- 无价值组合使用 `noindex`、限制内部链接或服务端规范化。
- 分页页面需要可抓取的普通 `<a href>`，不能只依赖滚动事件。
- 无限滚动应提供可独立访问的分页 URL 和历史记录更新。

## 页面级技术 SEO

### Title

Title 应准确、唯一，并把页面最重要的主题放在前面：

```html
<title>Electron IPC 通信与安全实践 | YangZhenHong Blogs</title>
```

不要机械堆叠关键词。搜索引擎可能根据查询和页面内容重写标题，因此 title 必须与可见主标题和正文保持一致。

### Meta Description

Description 主要影响搜索结果摘要和点击意愿，通常不是直接排名开关：

```html
<meta
  name="description"
  content="通过完整示例理解 Electron 主进程、preload 与渲染进程之间的 IPC 通信，并掌握参数校验和安全边界。"
/>
```

每个重要页面使用独立描述，说明读者能获得什么。搜索引擎仍可能按查询截取正文中的其他段落。

`meta keywords` 已不被主流搜索引擎用作现代网页排名依据，不需要维护关键词列表。页面主题应通过 title、标题、正文、链接关系和实际内容表达。

### 标题层级与语义 HTML

```html
<header>
  <nav aria-label="主导航">...</nav>
</header>
<main>
  <article>
    <h1>SEO 优化完全指南</h1>
    <section>
      <h2>抓取与索引</h2>
      <h3>XML Sitemap</h3>
    </section>
  </article>
</main>
<footer>...</footer>
```

原则：

- 页面主内容通常只有一个清晰的 H1。
- 不要为了字号跳过标题层级，用 CSS 控制视觉样式。
- 链接使用能描述目标的文字，避免大量“点击这里”。
- 按钮执行动作，链接负责导航，不要用不可抓取的 `div onclick` 代替链接。
- 主要内容应存在于 HTML 文本中，不要只放在 canvas 或图片里。

### Open Graph 与社交分享

社交元数据不直接提高自然排名，但会改善分享展示：

```html
<meta property="og:type" content="article" />
<meta property="og:title" content="SEO 优化完全指南" />
<meta property="og:description" content="从抓取、索引到内容和监控的完整实践。" />
<meta property="og:url" content="https://example.com/seo/" />
<meta property="og:image" content="https://example.com/images/seo-cover.png" />
<meta name="twitter:card" content="summary_large_image" />
```

图片使用绝对 HTTPS 地址，并保证公开可访问、尺寸合适且内容与页面相关。

### 站内搜索页和错误页

- 站内搜索结果通常内容重复且组合无限，通常设置 `noindex, follow`。
- 404 页面提供返回首页、搜索和相关入口，但响应必须保持 `404`。
- 登录页、购物车、个人中心等无搜索价值页面通常不需要索引。
- 测试环境应通过认证或网络策略隔离，不只依赖 `noindex`。

## JavaScript 与 Docsify SEO

### 搜索引擎如何处理 JavaScript

搜索引擎可能先抓取初始 HTML，再排队执行 JavaScript 渲染。不同搜索引擎和社交爬虫的渲染能力、等待时间并不一致，因此重要内容不应只在长时间异步请求后出现。

| 渲染方式 | SEO 特点 | 适合场景 |
| --- | --- | --- |
| 服务端渲染 SSR | 请求时返回完整 HTML | 高频更新、个性化较少的内容站 |
| 静态生成 SSG | 构建时生成每个页面 HTML | 博客、文档、营销页 |
| 客户端渲染 CSR | 初始 HTML 内容少，依赖 JS | 登录后的应用、SEO 非核心页面 |
| 预渲染 | 为指定路由提前生成 HTML | 规模有限的现有 SPA |

博客和公开文档通常优先考虑 SSG，因为内容稳定、缓存简单，爬虫和分享工具也能直接读取完整 HTML。

### Docsify 的特殊问题

Docsify 默认在浏览器中读取 Markdown 并渲染，路由常使用 hash：

```text
https://example.com/#/seo/index
```

`#` 后面的片段不会发送给服务器，部分爬虫、统计工具和社交分享服务可能只把它视为同一个首页。即使主流搜索引擎能够执行 JavaScript，也不代表所有页面都会稳定获得独立索引。

如果自然搜索是博客的重要获客渠道，建议按优先级处理：

1. 使用静态站点生成器为每篇 Markdown 生成独立 HTML URL。
2. 或在构建阶段预渲染所有公开 Docsify 路由。
3. 保证每个页面拥有独立 title、description、canonical 和分享元数据。
4. sitemap 中只放真实可请求的无 hash URL，不要放 `#` 路由。
5. 用 Search Console URL 检查工具查看搜索引擎实际渲染到的 HTML。

如果博客只是个人知识库，SEO 不是核心目标，可以继续使用 Docsify，但应接受长尾页面收录可能不稳定的限制。

### 动态更新页面标题

下面的 Docsify 插件可以改善浏览器标签和用户体验：

```html
<script>
  window.$docsify = {
    plugins: [
      function pageMetadata(hook) {
        hook.doneEach(function () {
          const heading = document.querySelector('.markdown-section h1')
          const title = heading?.textContent?.trim() || '首页'
          document.title = `${title} | YangZhenHong Blogs`
        })
      },
    ],
  }
</script>
```

这不能替代静态 HTML 或预渲染，因为部分爬虫不会等待脚本执行。它只是 CSR 环境中的基础补强。

### 可抓取链接

```html
<!-- 推荐：有真实 URL，禁用 JavaScript 时仍能理解目标 -->
<a href="/articles/electron-ipc">Electron IPC</a>

<!-- 不推荐：爬虫无法可靠发现目标 -->
<button onclick="router.push('/articles/electron-ipc')">Electron IPC</button>
```

懒加载路由不能阻止生成真实链接，接口失败时也应保留基础导航。

## 结构化数据

结构化数据帮助搜索引擎理解实体和页面类型，有机会获得富媒体结果，但不保证展示。

### Article 示例

推荐使用 JSON-LD：

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "SEO 优化完全指南",
  "datePublished": "2026-07-30",
  "dateModified": "2026-07-30",
  "author": {
    "@type": "Person",
    "name": "YangZhenHong",
    "url": "https://github.com/yzhenhong"
  },
  "mainEntityOfPage": "https://example.com/seo/"
}
</script>
```

### Breadcrumb 示例

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "SEO 优化",
      "item": "https://example.com/seo/"
    }
  ]
}
</script>
```

结构化数据必须与页面可见内容一致。不要标记页面中不存在的评分、作者、问题或价格，也不要把 FAQ 标记当作获取额外搜索结果空间的技巧。

## 内容与内部链接

### 写出真正解决问题的内容

高质量技术文章通常包含：

1. 问题适用范围和前置条件。
2. 可运行的最小示例。
3. 为什么这样实现，而不只是代码结果。
4. 失败路径、边界条件和安全影响。
5. 版本差异与官方资料链接。
6. 验证方法和常见错误。

“字数更多”不等于“内容更好”。删除与主题无关的铺垫，让读者更快获得可靠答案。

### E-E-A-T 应如何理解

经验、专业性、权威性和可信度是评估内容质量的思路，不是给页面填写四个字段就能得到的排名分数。技术博客可以通过以下方式增强可信度：

- 标明作者和真实经验背景
- 给出可验证的代码、测试环境和版本
- 引用官方文档或一手资料
- 区分事实、经验判断与推测
- 及时修复过时或错误内容
- 对安全、财务、医疗等高风险主题更加谨慎

### 内部链接

内部链接同时承担导航、主题关联和权重传递：

- 从高层专题页链接到重要子文章。
- 子文章链接回专题页和真正相关的下一篇内容。
- 使用描述性锚文本，例如“Electron IPC 安全实践”。
- 避免每篇文章都机械链接到所有页面。
- 定期检查孤立页面和失效链接。

### 内容更新与合并

定期检查：

- 示例是否仍适用于当前版本
- 页面是否持续有曝光但点击率下降
- 多篇文章是否回答同一个问题并互相竞争
- 旧页面是否有外部链接，迁移时是否需要 301

内容过时但仍有价值时应更新；多个薄弱页面主题相同，可以合并成一个完整页面并永久重定向旧地址。不要只改发布日期却不改正文。

## 图片、移动端与多语言

### 图片 SEO

```html
<figure>
  <img
    src="/images/electron-process-model.webp"
    width="1200"
    height="675"
    alt="Electron 主进程、预加载脚本和渲染进程之间的通信关系"
    loading="lazy"
    decoding="async"
  />
  <figcaption>Electron 进程模型</figcaption>
</figure>
```

- alt 描述图片传达的信息，不堆叠关键词。
- 装饰图片使用空 `alt=""`，避免屏幕阅读器重复朗读。
- 设置 width 和 height，减少布局偏移。
- 首屏 LCP 图片通常不应懒加载，并可考虑 `fetchpriority="high"`。
- 文件名、周围文字和图注应与图片主题一致。

### 移动优先

搜索引擎主要依据移动版本内容建立索引，因此移动端不能删除关键正文、结构化数据或内部链接。确保：

- viewport 配置正确
- 字体和点击区域可用
- 内容不被横向滚动或遮挡
- 移动端与桌面端主内容和元数据一致
- 弹窗不阻挡用户立即阅读主要内容

### 多语言 hreflang

不同语言或地区页面使用独立 URL，并相互声明：

```html
<link rel="alternate" hreflang="zh-CN" href="https://example.com/zh/seo/" />
<link rel="alternate" hreflang="en" href="https://example.com/en/seo/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/seo/" />
```

每个版本都应包含自己和其他版本的完整返回链接。不要仅根据 IP 强制跳转，用户和爬虫应能主动切换语言。

## 性能与 Core Web Vitals

当前核心体验指标包括：

| 指标 | 衡量内容 | 良好目标 |
| --- | --- | --- |
| LCP | 最大主要内容出现速度 | 不超过 2.5 秒 |
| INP | 用户交互到下一帧反馈的延迟 | 不超过 200 毫秒 |
| CLS | 页面生命周期中的意外布局偏移 | 不超过 0.1 |

这些目标通常按真实用户数据的第 75 百分位评估，并分别观察移动端和桌面端。FID 已被 INP 取代，不能再作为当前核心指标。

常见优化方向：

- LCP：降低 TTFB、预加载关键资源、优化首屏图片、减少阻塞 CSS/JS。
- INP：拆分长任务、减少第三方脚本、缩小渲染范围、避免同步大计算。
- CLS：为图片和广告预留尺寸、避免在已有内容上方动态插入元素、优化字体切换。

性能是搜索体验的一部分，不会让不相关或低质量内容自动获得排名。完整排查方法见 [Web 性能优化指南](/engineering-quality/optimization/index.md)。

## 监控、诊断与迭代

### 数据来源

| 工具 | 主要用途 |
| --- | --- |
| Google Search Console | Google 抓取、索引、查询、曝光和点击 |
| Bing Webmaster Tools | Bing 搜索表现和站点诊断 |
| 百度搜索资源平台 | 面向百度的抓取与索引反馈 |
| Analytics / 自建分析 | 落地页行为、事件和转化 |
| Lighthouse | 单次实验室技术检查 |
| PageSpeed Insights | 实验室结果与可用的真实用户数据 |
| 服务端日志 | 爬虫请求、状态码、耗时和抓取频率 |

Search Console 的数据会延迟和聚合，不适合当实时监控。服务可用性、错误率和发布异常仍需独立监控。

### 建立 SEO 看板

至少按页面类型、设备和国家/地区观察：

- 可索引页面数与有效索引页数
- 站点地图提交 URL 与索引 URL 差异
- 自然搜索曝光、点击、点击率和排名分布
- 品牌词与非品牌词流量
- 核心页面的自然搜索转化
- 404、5xx、重定向链和 canonical 异常
- Core Web Vitals 达标比例

平均排名容易掩盖查询结构变化，应同时看具体页面和查询群组。

### 常见问题排查

#### 页面未被索引

1. 直接请求 URL，确认返回 `200` 和正确内容。
2. 检查 robots.txt、meta robots 与响应头。
3. 检查 canonical 是否指向其他页面。
4. 确认 sitemap 和内部链接使用同一个规范 URL。
5. 使用 URL 检查工具查看抓取和渲染结果。
6. 判断页面是否重复、内容过薄或缺少独立价值。

#### 排名突然下降

1. 排除统计代码、筛选条件和数据延迟问题。
2. 检查站点是否出现 5xx、错误重定向或批量 `noindex`。
3. 对比下降的查询、页面、设备和国家，不只看全站汇总。
4. 检查搜索意图或搜索结果形态是否变化。
5. 查看竞争页面是否提供了更完整或更新的信息。
6. 对照近期发布记录和搜索系统公开更新，但不要仅凭时间重合下结论。

#### 曝光稳定但点击率下降

检查排名位置、title/description、富媒体结果、品牌信号及结果页新增模块。不要使用夸张标题提高短期点击，否则落地体验和信任会下降。

### 迭代节奏

```text
每次发布：状态码、meta、canonical、结构化数据、链接检查
每周：抓取错误、异常流量、关键页面索引状态
每月：查询与页面表现、内容衰退、Core Web Vitals
每季度：主题结构、内容合并、技术债和竞争结果复盘
```

## 上线检查清单

### 抓取与索引检查

```text
[ ] 生产环境未被 robots.txt 意外屏蔽
[ ] 重要页面返回 200，删除页面返回 404/410
[ ] 重定向没有循环或多跳链路
[ ] sitemap 只包含可索引的规范 URL
[ ] canonical、内部链接和 sitemap 地址一致
[ ] 测试页、搜索页和账户页按需设置 noindex
```

### 页面内容

```text
[ ] 每个重要页面拥有准确且独立的 title、H1 和 description
[ ] 标题层级清晰，主要内容存在于可解析文本中
[ ] 页面回答明确的搜索意图，不与其他页面重复竞争
[ ] 作者、更新时间、来源和示例能够验证
[ ] 图片 alt、尺寸和文件体积合理
[ ] 重要页面有来自专题页或导航的内部链接
```

### 技术与体验

```text
[ ] 移动端包含与桌面端一致的主要内容和元数据
[ ] LCP、INP、CLS 使用真实用户数据监控
[ ] JavaScript 失败时仍能看到关键内容或基础导航
[ ] 结构化数据与可见内容一致并通过验证
[ ] 404、分享卡片和多语言链接工作正常
[ ] Analytics、Search Console 等环境使用正式配置
```

## 延伸阅读

- [Google Search Central](https://developers.google.com/search/docs)
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Schema.org](https://schema.org/)
- [Web 性能优化指南](/engineering-quality/optimization/index.md)
