# Electron 完全指南

Electron 使用 Chromium 渲染界面，并通过 Node.js 与操作系统交互。它适合把 Web 技术栈带到 Windows、macOS 和 Linux 桌面端，但也意味着应用需要同时处理浏览器安全、Node.js 权限、桌面生命周期和安装包发布。

> 本文以现代 Electron 的安全默认值为基准：渲染进程不直接使用 Node.js，通过 preload 暴露最小 API，并使用 IPC 完成跨进程调用。

## 目录

1. [认识 Electron](#认识-electron)
2. [创建第一个应用](#创建第一个应用)
3. [进程模型与生命周期](#进程模型与生命周期)
4. [Preload 与 IPC 通信](#preload-与-ipc-通信)
5. [窗口与系统能力](#窗口与系统能力)
6. [本地数据与文件](#本地数据与文件)
7. [在前端框架中使用](#在前端框架中使用)
8. [安全清单](#安全清单)
9. [打包、签名与发布](#打包签名与发布)
10. [调试与性能优化](#调试与性能优化)
11. [常见问题](#常见问题)

## 认识 Electron

### 它解决什么问题

浏览器中的页面运行在沙箱内，通常不能直接读取任意文件、创建原生菜单或控制系统托盘。Electron 在 Web 页面之外增加了一个拥有 Node.js 和桌面 API 的主进程，使应用可以完成这些工作。

常见应用场景包括：

- 编辑器、数据库客户端和开发者工具
- 企业内部桌面系统
- 即时通信、音乐、会议等多媒体客户端
- 需要离线运行或访问本地文件的 Web 应用

如果目标只是网站或 PWA，不需要安装包和系统能力，Electron 通常不是成本最低的方案；如果目标是 iOS 或 Android，应优先考虑 [React Native](/cross-platform/react-native.md)、[Taro](/cross-platform/taro.md) 或 [UniApp](/cross-platform/uni-app.md)。

### 三类运行环境

| 环境 | 职责 | 可用能力 |
| --- | --- | --- |
| 主进程 Main | 管理应用生命周期、窗口和系统资源 | Node.js、Electron 主进程 API |
| 预加载脚本 Preload | 在页面加载前运行，搭建受控桥梁 | 部分 Node.js、`contextBridge`、`ipcRenderer` |
| 渲染进程 Renderer | 展示 UI、响应用户交互 | DOM、CSS、浏览器 API，以及 preload 暴露的 API |

一个应用只有一个主进程，但可以创建多个窗口；通常每个窗口对应一个独立渲染进程。渲染进程崩溃不应直接拖垮主进程，这也是需要跨进程通信的原因。

```text
操作系统
  └─ 主进程
      ├─ BrowserWindow A ─ preload ─ 渲染进程 A
      ├─ BrowserWindow B ─ preload ─ 渲染进程 B
      └─ 菜单、托盘、文件系统、通知
```

### Electron 与常见方案对比

| 方案 | UI 技术 | 主要平台 | 优点 | 主要成本 |
| --- | --- | --- | --- | --- |
| Electron | HTML/CSS/JavaScript | Windows/macOS/Linux | Web 生态成熟、跨平台一致 | 安装包和内存占用较大 |
| Tauri | Web + Rust WebView | Windows/macOS/Linux | 体积较小、权限模型严格 | Rust 与平台 WebView 差异 |
| React Native | React + 原生组件 | iOS/Android | 移动端原生体验较好 | 原生工程与平台适配 |
| PWA | 浏览器能力 | 支持现代浏览器的平台 | 发布简单、无需安装包 | 系统 API 和后台能力受限 |

## 创建第一个应用

### 环境要求

准备当前维护中的 Node.js LTS 和 npm，并确认版本：

```bash
node -v
npm -v
```

正式项目推荐使用 Electron Forge，它集成了开发、打包和生成安装包的流程：

```bash
npm init electron-app@latest my-electron-app -- --template=vite-typescript
cd my-electron-app
npm start
```

第一次学习时，也可以从下面的最小项目开始，理解每个文件的职责。

### 最小可运行项目

```bash
mkdir electron-quick-start
cd electron-quick-start
npm init -y
npm install --save-dev electron
```

目录结构：

```text
electron-quick-start/
├─ main.cjs       # 主进程
├─ preload.cjs    # 安全桥接层
├─ renderer.js    # 页面逻辑
├─ index.html
└─ package.json
```

在 npm 生成的 `package.json` 中补充入口和启动命令，保留安装时自动写入的 `devDependencies`：

```json
{
  "name": "electron-quick-start",
  "version": "1.0.0",
  "main": "main.cjs",
  "private": true,
  "scripts": {
    "start": "electron ."
  }
}
```

> 应用应提交 `package-lock.json`，保证团队和 CI 使用同一依赖版本。

主进程 `main.cjs`：

```js
const { app, BrowserWindow } = require('electron')
const path = require('node:path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 720,
    minHeight: 480,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // macOS 点击 Dock 图标且没有窗口时，重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  // macOS 应用通常在窗口全部关闭后继续运行
  if (process.platform !== 'darwin') app.quit()
})
```

预加载脚本 `preload.cjs`：

```js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('appInfo', {
  platform: process.platform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
})
```

页面 `index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Electron Quick Start</title>
  </head>
  <body>
    <h1>Electron Quick Start</h1>
    <p id="runtime"></p>
    <script src="./renderer.js"></script>
  </body>
</html>
```

渲染进程 `renderer.js`：

```js
const { platform, versions } = window.appInfo

document.querySelector('#runtime').textContent =
  `${platform} / Electron ${versions.electron} / Chrome ${versions.chrome}`
```

运行应用：

```bash
npm start
```

## 进程模型与生命周期

### 为什么不能把所有代码放在页面中

渲染进程会加载 HTML、执行第三方前端依赖，也可能展示来自网络或用户输入的内容。如果它同时拥有完整 Node.js 权限，一个 XSS 漏洞就可能升级为任意文件读写甚至命令执行。

合理的职责划分是：

- 渲染进程只负责视图、交互和纯前端状态
- preload 只暴露明确、窄小、可验证的接口
- 主进程执行文件、窗口、菜单、更新等特权操作
- 主进程不信任渲染进程传来的参数，每次都校验

### 应用生命周期

常用事件和阶段：

```js
const { app } = require('electron')

app.on('will-finish-launching', () => {
  // macOS 中适合尽早注册 open-file、open-url 等事件
})

app.whenReady().then(() => {
  // Electron API 就绪后再创建窗口、菜单和托盘
})

app.on('before-quit', (event) => {
  // 有未保存内容时可阻止退出，但不要造成无法退出的死循环
})

app.on('will-quit', () => {
  // 注销快捷键、关闭数据库连接等
})
```

不要在 `app.whenReady()` 之前创建 `BrowserWindow`。耗时初始化可以和窗口加载并行，避免白屏等待。

### 单实例应用

登录回调、文件关联和深链接通常要求只运行一个实例：

```js
const { app, BrowserWindow } = require('electron')

const hasLock = app.requestSingleInstanceLock()

if (!hasLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    const win = BrowserWindow.getAllWindows()[0]
    if (!win) return

    if (win.isMinimized()) win.restore()
    win.focus()
    console.log('第二个实例参数：', commandLine)
  })
}
```

### 窗口状态管理

窗口对象若只保存在局部变量中，可能被垃圾回收。多窗口应用可以使用 `Map` 按业务 ID 管理：

```js
const windows = new Map()

function openProjectWindow(projectId) {
  const existing = windows.get(projectId)
  if (existing && !existing.isDestroyed()) {
    existing.focus()
    return existing
  }

  const win = new BrowserWindow({ width: 1000, height: 700 })
  windows.set(projectId, win)
  win.on('closed', () => windows.delete(projectId))
  return win
}
```

## Preload 与 IPC 通信

### 三种 IPC 模式

| 模式 | 渲染进程 | 主进程 | 使用场景 |
| --- | --- | --- | --- |
| 请求并等待结果 | `ipcRenderer.invoke` | `ipcMain.handle` | 打开文件、查询设置、保存数据 |
| 单向通知主进程 | `ipcRenderer.send` | `ipcMain.on` | 日志、无需返回值的动作 |
| 主进程推送事件 | `webContents.send` | `ipcRenderer.on` | 下载进度、菜单命令、后台状态 |

业务调用优先使用 `invoke/handle`，因为它天然返回 Promise，也更容易处理异常。

### 保存文本的完整示例

主进程注册处理器：

```js
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { writeFile } = require('node:fs/promises')

ipcMain.handle('file:save-text', async (event, content) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender)

  if (typeof content !== 'string') {
    throw new TypeError('content 必须是字符串')
  }
  if (Buffer.byteLength(content, 'utf8') > 5 * 1024 * 1024) {
    throw new RangeError('文件不能超过 5 MB')
  }

  const result = await dialog.showSaveDialog(senderWindow, {
    title: '保存文本',
    defaultPath: 'note.txt',
    filters: [{ name: '文本文件', extensions: ['txt'] }],
  })

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  await writeFile(result.filePath, content, 'utf8')
  return { canceled: false, filePath: result.filePath }
})
```

preload 暴露一项具体能力：

```js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('fileApi', {
  saveText: (content) => ipcRenderer.invoke('file:save-text', content),
})
```

渲染进程调用：

```js
const saveButton = document.querySelector('#save')
const editor = document.querySelector('#editor')

saveButton.addEventListener('click', async () => {
  try {
    const result = await window.fileApi.saveText(editor.value)
    if (!result.canceled) console.log('已保存到：', result.filePath)
  } catch (error) {
    console.error('保存失败：', error)
  }
})
```

不要把整个 `ipcRenderer` 暴露给页面：

```js
// 错误：页面可以向任意频道发送任意参数
contextBridge.exposeInMainWorld('ipc', ipcRenderer)

// 正确：只开放业务需要的动作
contextBridge.exposeInMainWorld('settingsApi', {
  read: () => ipcRenderer.invoke('settings:read'),
  updateTheme: (theme) => ipcRenderer.invoke('settings:update-theme', theme),
})
```

### 主进程向页面推送事件

preload 中包装订阅，并返回取消订阅函数：

```js
contextBridge.exposeInMainWorld('downloadApi', {
  onProgress: (callback) => {
    const listener = (_event, progress) => callback(progress)
    ipcRenderer.on('download:progress', listener)
    return () => ipcRenderer.removeListener('download:progress', listener)
  },
})
```

主进程推送：

```js
win.webContents.send('download:progress', {
  receivedBytes: 512,
  totalBytes: 1024,
})
```

页面卸载时调用取消订阅函数，避免热更新或页面切换后重复监听。

### TypeScript 类型声明

使用 TypeScript 时，为 preload API 添加全局类型：

```ts
// src/types/electron.d.ts
export {}

declare global {
  interface Window {
    fileApi: {
      saveText(content: string): Promise<
        | { canceled: true }
        | { canceled: false; filePath: string }
      >
    }
  }
}
```

类型声明改善开发体验，但不能代替主进程的运行时校验。渲染进程仍然可能被注入恶意脚本。

## 窗口与系统能力

### BrowserWindow 常用配置

```js
const win = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 800,
  minHeight: 600,
  show: false,
  backgroundColor: '#ffffff',
  titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  webPreferences: {
    preload: path.join(__dirname, 'preload.cjs'),
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
  },
})

win.once('ready-to-show', () => win.show())
```

`show: false` 配合 `ready-to-show` 可以减少首次显示时的白屏。若首屏本身加载较慢，可以先显示轻量骨架屏，不要让用户长时间看不到窗口。

### 原生菜单

```js
const { Menu } = require('electron')

const template = [
  {
    label: '文件',
    submenu: [
      {
        label: '新建',
        accelerator: 'CmdOrCtrl+N',
        click: (_item, focusedWindow) => {
          focusedWindow?.webContents.send('menu:new-file')
        },
      },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: '编辑',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
]

Menu.setApplicationMenu(Menu.buildFromTemplate(template))
```

优先使用 `role`，Electron 会自动处理平台文案、快捷键和系统行为。

### 托盘

```js
const { Menu, Tray } = require('electron')
const path = require('node:path')

let tray

function createTray(win) {
  tray = new Tray(path.join(__dirname, 'assets', 'tray.png'))
  tray.setToolTip('My Electron App')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '显示主窗口', click: () => win.show() },
    { label: '退出', role: 'quit' },
  ]))
  tray.on('click', () => win.show())
}
```

`Tray` 必须保留引用，否则可能被垃圾回收。不同平台对托盘图标尺寸和模板图片有不同要求，发布前需要分别验证。

### 通知、剪贴板与外部链接

```js
const { clipboard, Notification, shell } = require('electron')

clipboard.writeText('复制到剪贴板的内容')

if (Notification.isSupported()) {
  new Notification({
    title: '任务完成',
    body: '文件已经导出',
  }).show()
}

await shell.openExternal('https://example.com')
```

打开外部链接前应校验协议和域名，绝不能把未经验证的用户输入直接传给 `shell.openExternal`。

### 全局快捷键

```js
const { app, globalShortcut } = require('electron')

app.whenReady().then(() => {
  const registered = globalShortcut.register('CommandOrControl+Shift+P', () => {
    console.log('打开命令面板')
  })

  if (!registered) console.warn('快捷键注册失败')
})

app.on('will-quit', () => globalShortcut.unregisterAll())
```

应用窗口内的快捷键优先使用菜单 `accelerator` 或前端键盘事件；只有应用在后台也必须响应时，才使用全局快捷键。

## 本地数据与文件

### 应该存到哪里

不要把运行时数据写入应用安装目录。打包后该目录可能只读，也会在升级时被替换。

```js
const { app } = require('electron')

console.log(app.getPath('userData'))  // 配置、数据库、业务数据
console.log(app.getPath('documents')) // 用户文档
console.log(app.getPath('temp'))      // 临时文件
console.log(app.getPath('logs'))      // 日志目录
```

常见选择：

- 少量偏好设置：JSON 或专门的配置库
- 可查询的结构化数据：SQLite
- 密钥、令牌：系统凭据库，不要明文放进 JSON 或 `localStorage`
- 大文件：业务目录中保存文件，数据库只保存索引和元数据

### 原子写入 JSON

直接覆盖配置文件时，进程崩溃可能留下半个 JSON。可以先写临时文件再替换：

```js
const path = require('node:path')
const { writeFile, rename } = require('node:fs/promises')

async function writeJsonAtomically(filePath, value) {
  const tempPath = `${filePath}.tmp`
  const json = JSON.stringify(value, null, 2)
  await writeFile(tempPath, json, 'utf8')
  await rename(tempPath, filePath)
}

const settingsPath = path.join(app.getPath('userData'), 'settings.json')
await writeJsonAtomically(settingsPath, { theme: 'dark' })
```

还应处理首次启动、JSON 损坏、字段迁移和并发写入。重要数据需要备份策略，不能只依赖单个本地文件。

### 文件拖放

现代 Electron 不应依赖页面中的 `File.path` 获取绝对路径。将 `File` 交给 preload 中的 `webUtils.getPathForFile`：

```js
const { contextBridge, webUtils } = require('electron')

contextBridge.exposeInMainWorld('fileApi', {
  getPathForFile: (file) => webUtils.getPathForFile(file),
})
```

```js
dropZone.addEventListener('drop', (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) console.log(window.fileApi.getPathForFile(file))
})
```

拿到路径后仍然要在主进程检查扩展名、文件大小和允许访问的目录。

## 在前端框架中使用

### 推荐目录边界

无论使用 Vue、React 还是原生页面，都应保持进程边界清晰：

```text
src/
├─ main/              # 主进程代码
│  ├─ index.ts
│  ├─ ipc/
│  └─ services/
├─ preload/           # 桥接 API
│  └─ index.ts
├─ renderer/          # Vue/React 应用
│  ├─ components/
│  ├─ pages/
│  └─ main.tsx
└─ shared/            # 纯类型、常量、数据结构
```

`shared` 中不要导入 `electron`、Node.js 文件模块或 DOM 专属模块，这样才能真正被多个环境安全复用。

### 开发与生产加载地址

开发环境通常加载 Vite dev server，生产环境加载打包后的 HTML。具体环境变量由脚手架注入，不要只靠 `process.env.NODE_ENV` 猜测：

```ts
if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  await win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
} else {
  await win.loadFile(
    path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
  )
}
```

使用 history 路由时，生产环境的 `file://` 加载可能刷新后找不到页面。桌面应用通常使用 hash 路由，或者为自定义协议实现回退处理。

### 不要把 Electron API 放进前端状态库

页面组件只调用业务接口，例如 `window.projectApi.open()`；不要在 Redux、Pinia 或 Zustand 中保存 `BrowserWindow`、IPC event 等对象。桌面能力的实现留在主进程，前端状态库只保存可序列化的 UI 和业务状态。

## 安全清单

Electron 应用拥有比普通网页更高的权限。发布前至少确认以下事项：

- `nodeIntegration: false`
- `contextIsolation: true`
- `sandbox: true`，确有兼容问题时才局部关闭
- preload 只暴露具体业务方法，不暴露 `ipcRenderer`、`require` 或文件系统
- 所有 IPC 参数均在主进程校验，包括类型、长度、路径和权限
- 不加载不受信任的远程页面；必须加载时使用独立且无权限的窗口
- 设置严格的 Content Security Policy，生产环境不使用 `unsafe-eval`
- 拒绝未知的新窗口、导航和权限请求
- 外部链接只允许 `https:` 且校验目标域名
- 不在日志、localStorage 或普通配置文件中保存令牌和密码
- 持续更新 Electron，因为 Chromium 和 Node.js 的安全修复由 Electron 版本带入

### Content Security Policy

本地页面可通过 meta 标签配置 CSP：

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self' https://api.example.com"
/>
```

Vite 开发服务器可能需要额外的 WebSocket 和脚本配置。开发 CSP 与生产 CSP 可以分开，但生产策略必须收紧。

### 限制导航、新窗口和权限

```js
const { shell, session } = require('electron')

function isTrustedExternalUrl(rawUrl) {
  try {
    const url = new URL(rawUrl)
    return url.protocol === 'https:' && url.hostname === 'example.com'
  } catch {
    return false
  }
}

win.webContents.setWindowOpenHandler(({ url }) => {
  if (isTrustedExternalUrl(url)) void shell.openExternal(url)
  return { action: 'deny' }
})

session.defaultSession.setPermissionRequestHandler(
  (_webContents, permission, callback) => {
    const allowed = permission === 'notifications'
    callback(allowed)
  },
)
```

权限策略应按真实需求逐项允许。摄像头、麦克风、地理位置等敏感权限还要结合页面来源判断。

## 打包、签名与发布

### package、make 和 publish 的区别

Electron Forge 将发布流程拆成三个概念：

- `package`：生成可运行的应用目录，适合本地验证
- `make`：基于已打包应用生成安装包或分发文件
- `publish`：把产物上传到 GitHub Releases 等发布目标

```bash
npm run package
npm run make
```

默认产物位于 `out/`。安装包格式取决于 maker 配置，例如 Windows 的 Squirrel、macOS 的 ZIP/DMG、Linux 的 deb/rpm。

### Forge 基础配置

```ts
// forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon',
  },
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    new MakerDeb({}),
  ],
}

export default config
```

图标源文件需要满足各平台格式和尺寸要求。配置中的 `icon` 通常不写扩展名，由打包器按平台选择 `.ico` 或 `.icns`。

### 为什么需要代码签名

未签名应用在 Windows 和 macOS 上会触发明显的安全警告。面向真实用户发布时通常需要：

- Windows：代码签名证书；发布系统需妥善保存证书和密码
- macOS：Apple Developer ID、Hardened Runtime、代码签名与 notarization
- Linux：不同发行版的包格式和仓库签名策略

签名密钥只放在 CI Secret 或安全的密钥服务中，不提交到仓库。macOS 安装包通常需要在 macOS 环境构建和公证，各平台产物最好由对应系统的 CI runner 生成。

### 自动更新

自动更新不是“上传一个安装包”这么简单，它依赖发布源、平台元数据、签名和版本号。设计时要明确：

1. 应用启动后异步检查更新，不阻塞首屏。
2. 下载前或安装前向用户说明版本和重启影响。
3. 更新失败不影响当前版本继续使用。
4. 服务端只提供经过签名验证的正式产物。
5. 保留灰度发布、暂停发布和回滚能力。

使用 GitHub Releases 的 Forge 项目可以评估 `update-electron-app`；需要私有发布源或复杂更新策略时，可直接使用 Electron 的 `autoUpdater` 并搭建兼容服务。不同安装包目标的支持范围不同，接入前必须核对所选 maker。

### 发布前检查

```text
[ ] 干净环境可以安装、启动和卸载
[ ] Windows、macOS、Linux 目标平台分别验证
[ ] 应用名称、版本、图标、版权信息正确
[ ] 用户数据在升级后仍可读取，并有迁移方案
[ ] 深链接、文件关联、托盘、快捷键正常
[ ] 离线、代理、弱网和更新失败不会卡死应用
[ ] 崩溃日志中没有密码、令牌和用户隐私
[ ] 安装包已签名，更新包来源可信
```

## 调试与性能优化

### 调试主进程和渲染进程

渲染进程使用 Chromium DevTools：

```js
if (!app.isPackaged) {
  win.webContents.openDevTools({ mode: 'detach' })
}
```

主进程可以使用 Node.js Inspector：

```bash
electron --inspect=9229 .
```

然后使用支持 Node.js 调试协议的 IDE 连接端口。只在本机开发环境开放调试端口，不要将其带入生产启动参数。

### 记录崩溃和无响应

```js
win.webContents.on('render-process-gone', (_event, details) => {
  console.error('渲染进程退出：', details.reason, details.exitCode)
})

win.on('unresponsive', () => {
  console.error('窗口无响应')
})

process.on('uncaughtException', (error) => {
  console.error('主进程未捕获异常：', error)
})
```

生产日志应写入 `app.getPath('logs')`，并设置轮转和大小上限。`uncaughtException` 适合最后记录错误，不应成为忽略异常后继续运行的常规手段。

### 常见性能问题

1. **主进程阻塞**：同步文件 IO、巨量 JSON 解析会让所有窗口操作变慢。改用异步 IO，CPU 密集任务放入 Worker Thread 或独立 utility process。
2. **首屏过重**：延迟加载编辑器、图表等大型模块，先显示窗口骨架。
3. **IPC 过于频繁**：不要在鼠标移动或动画每一帧传输大对象；合并事件或限制频率。
4. **窗口隐藏但未释放**：确认关闭窗口时注销监听器、定时器和流。
5. **后台持续运行**：根据窗口可见性暂停轮询、动画和非必要任务。
6. **一次创建过多窗口**：能用单窗口路由或同一窗口切换的场景，不必创建额外渲染进程。

### 测量内存

```js
const metrics = app.getAppMetrics()

for (const metric of metrics) {
  console.log(metric.type, metric.pid, metric.memory)
}
```

还可以用 Chromium Task Manager、DevTools Performance/Memory 面板和系统任务管理器定位问题。优化前先建立启动时间、空闲内存和关键交互耗时基线。

## 常见问题

### 页面里为什么不能使用 require

现代安全配置下 `nodeIntegration` 默认关闭。页面不应该直接 `require('fs')`，应由 preload 暴露具体能力，再通过 IPC 交给主进程执行。

### 开发正常，打包后白屏

按顺序检查：

1. 生产环境是否使用 `loadFile` 加载正确的构建产物。
2. Vite 的资源基础路径是否适用于 `file://`。
3. history 路由刷新是否找不到入口，必要时改用 hash 路由。
4. 文件名大小写是否与 Linux/macOS 文件系统一致。
5. 资源是否被 Forge 忽略规则排除。
6. 打包应用中的 DevTools 和主进程日志是否有 CSP 或路径错误。

### preload 已配置但 window API 是 undefined

确认 preload 使用绝对路径、脚本没有运行时错误，并且暴露名称和 TypeScript 声明一致。调试时监听 preload 的控制台错误，不要用关闭 `contextIsolation` 的方式掩盖问题。

### IPC 调用一直没有返回

检查频道名是否一致、`ipcMain.handle` 是否在窗口调用前注册，以及处理器的每条分支是否都返回或抛错。同一个频道不能重复注册多个 handler，热更新主进程时可先 `ipcMain.removeHandler(channel)`。

### 如何减小安装包体积

- 只打包生产依赖和需要的资源
- 检查是否把测试数据、source map、大图片或重复二进制带进安装包
- 使用 `asar` 归档普通资源，但原生模块仍可能需要解包
- 按平台和架构分别发布，避免把多个架构塞进同一个包
- 如果极度关注体积和内存，重新评估 Tauri 等使用系统 WebView 的方案

### 如何选择原生模块

先确认 Electron 版本、Node ABI、目标平台和 CPU 架构是否受支持。含 C/C++ 的原生依赖通常需要针对 Electron 重编译；Electron Forge 会处理常见场景，但 CI 仍需安装对应编译工具。能够使用 Electron 内置 API 或纯 JavaScript 实现时，维护成本通常更低。

## 延伸阅读

- [Electron 官方文档](https://www.electronjs.org/docs/latest/)
- [Electron 安全建议](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Forge](https://www.electronforge.io/)
- [Electron 发布与代码签名](https://www.electronjs.org/docs/latest/tutorial/code-signing)
- [跨端开发选型](/cross-platform/index.md)
