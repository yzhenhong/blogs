# CSS 完全指南

## 目录
1. [CSS 基础](#css-基础)
2. [选择器](#选择器)
3. [盒模型](#盒模型)
4. [布局](#布局)
5. [响应式设计](#响应式设计)
6. [动画与过渡](#动画与过渡)
7. [性能优化](#性能优化)

## CSS 基础

### CSS 简介
CSS（Cascading Style Sheets）是一种样式表语言，用于描述 HTML 文档的呈现方式。

### CSS 引入方式
1. 内联样式
```html
<div style="color: red;">内联样式</div>
```

2. 内部样式表
```html
<style>
  .internal { color: blue; }
</style>
```

3. 外部样式表
```html
<link rel="stylesheet" href="styles.css">
```

### CSS 选择器优先级
1. !important
2. 内联样式
3. ID 选择器
4. 类选择器、属性选择器、伪类
5. 元素选择器、伪元素

## 选择器

### 基础选择器
1. 元素选择器
```css
div { color: red; }
```

2. 类选择器
```css
.class { color: blue; }
```

3. ID 选择器
```css
#id { color: green; }
```

### 组合选择器
1. 后代选择器
```css
div p { color: red; }
```

2. 子元素选择器
```css
div > p { color: blue; }
```

3. 相邻兄弟选择器
```css
div + p { color: green; }
```

### 属性选择器
```css
[title] { color: red; }
[title="hello"] { color: blue; }
[title~="hello"] { color: green; }
```

## 盒模型

### 标准盒模型
```css
.box {
  width: 200px;
  height: 200px;
  padding: 20px;
  border: 10px solid black;
  margin: 30px;
}
```

### IE 盒模型
```css
.box {
  box-sizing: border-box;
}
```

### 盒模型计算
- 标准盒模型：width = content
- IE 盒模型：width = content + padding + border

## 布局

### BFC（Block Formatting Context）
BFC 是一个独立的渲染区域，元素在 BFC 内部进行布局，外部的布局不会影响到内部，反之亦然。

#### 触发 BFC 的条件
1. overflow 不为 visible
2. display 为 flow-root 或 inline-block
3. position 为 absolute 或 fixed
4. float 不为 none
5. column 属性

#### BFC 的作用
1. 清除浮动
2. 防止 margin 重叠
3. 创建独立的上下文

### Flexbox 布局
```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Grid 布局
```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

## 响应式设计

### 媒体查询
```css
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

### 相对单位
1. rem
```css
html {
  font-size: 16px;
}
.element {
  font-size: 1.5rem; /* 24px */
}
```

2. em
```css
.parent {
  font-size: 16px;
}
.child {
  font-size: 1.5em; /* 24px */
}
```

3. vw/vh
```css
.element {
  width: 50vw; /* 视口宽度的 50% */
  height: 50vh; /* 视口高度的 50% */
}
```

## 动画与过渡

### Transition（过渡）
```css
.element {
  transition: all 0.3s ease;
}
```

### Animation（动画）
```css
@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slide 1s ease;
}
```

### Transform（变换）
```css
.element {
  transform: translate(100px, 100px) rotate(45deg) scale(1.5);
}
```

## 性能优化

### 选择器优化
1. 避免过度嵌套
2. 避免使用通配符
3. 避免使用标签选择器

### 渲染性能
1. 使用 transform 代替 top/left
2. 使用 opacity 代替 visibility
3. 避免频繁重排

### 加载优化
1. 压缩 CSS 文件
2. 使用 CSS Sprite
3. 使用字体图标

### 现代 CSS 特性
1. CSS 变量
```css
:root {
  --primary-color: #007bff;
}
.element {
  color: var(--primary-color);
}
```

2. CSS Grid
```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

3. CSS 函数
```css
.element {
  width: calc(100% - 20px);
  color: rgb(255, 0, 0);
}
```