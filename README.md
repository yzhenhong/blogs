# YangZhenHong 的前端笔记

这里整理我在前端开发中的学习记录和实践总结。内容不只罗列 API，也会说明适用场景、实现思路、常见问题和工程取舍。

## 从这里开始

| 方向 | 主要内容 | 入口 |
| --- | --- | --- |
| 前端基础 | CSS、JavaScript、TypeScript | [CSS](/frontend-basics/css/index.md) · [JavaScript](/frontend-basics/js/index.md) · [TypeScript](/frontend-basics/ts/index.md) |
| 前端框架 | Vue、React 及其全栈框架 | [Vue](/frontend-frameworks/vue/index.md) · [React](/frontend-frameworks/react/index.md) · [Nuxt.js](/frontend-frameworks/nuxt/index.md) · [Next.js](/frontend-frameworks/next/index.md) |
| 跨端开发 | 小程序、移动端和桌面端 | [跨端选型](/cross-platform/index.md) |
| 工程质量 | 性能、SEO、调试和工程工具 | [性能优化](/engineering-quality/optimization/index.md) · [SEO 优化](/engineering-quality/seo/index.md) · [工具](/tool/index.md) |

## 跨端开发

跨端方案首先要按目标平台选择，再比较语法偏好、原生能力、运行性能和发布成本。

| 目标平台 | 专题 | 适合场景 |
| --- | --- | --- |
| 小程序、H5、App | [UniApp](/cross-platform/uni-app.md) | Vue 团队、多端业务快速交付 |
| 小程序、H5 | [Taro](/cross-platform/taro.md) | React/Vue 团队、小程序为主要目标 |
| iOS、Android | [React Native](/cross-platform/react-native.md) | 重视移动端原生交互和扩展能力 |
| Windows、macOS、Linux | [Electron](/cross-platform/electron.md) | 桌面工具、编辑器和本地文件应用 |

不确定如何选择时，先阅读[跨端开发选型指南](/cross-platform/index.md)。它包含对比维度、原型验证方法和通用工程实践。

## 专题笔记

### JavaScript 与 TypeScript

- [JavaScript 数据类型与判断](/frontend-basics/js/data-types/index.md)
- [数组常用方法](/frontend-basics/js/array-methods/index.md)
- [对象常用方法](/frontend-basics/js/object-methods/index.md)
- [判断对象数组中是否存在指定对象](/frontend-basics/js/array-object-lookup/index.md)
- [函数](/frontend-basics/js/functions/index.md)
- [new 运算符](/frontend-basics/js/new-operator/index.md)
- [防抖与节流](/frontend-basics/js/debounce-throttle/index.md)
- [深度优先与广度优先遍历](/frontend-basics/js/traversal/index.md)
- [TypeScript 入门与配置](/frontend-basics/ts/getting-started/index.md)

### CSS、工具与数据服务

- [CSS 常见样式](/frontend-basics/css/common-styles/index.md)
- [CSS 优先级](/frontend-basics/css/specificity/index.md)
- [Git 使用笔记](/tool/git/index.md)
- [数据库安装](/tool/database/index.md)
- [使用 Chrome 调试微信 Web 页面](/tool/index.md)

## 阅读建议

1. 先通过专题首页建立知识结构，再进入具体 API 和示例。
2. 复制示例后主动补上失败分支、类型约束和边界条件。
3. 框架和构建工具更新较快，正式项目中应同时核对对应版本的官方文档。
4. 性能和选型结论要用真实业务原型验证，不只依赖理论对比。

## 关于我

专注前端开发，现居深圳。代码与其他项目见 [GitHub](https://github.com/yzhenhong)。
