### BFC

Block Formatting Context，是一种在CSS布局中非常重要的概念。它描述了一个区域，该区域内的块级盒子会在上下文中进行布局，而与外部内容无关。

**定义：**Block Formatting Context 是一种独立的布局环境，元素在 BFC 内部进行布局，外部的布局不会影响到内部，反之亦然。换句话说，BFC 是一个隔离的渲染区域，有助于控制布局和清除浮动等问题。

**触发BFC的条件：**

​                ● overflow 值为 hidden、scroll、auto （不为 visible）

​                ● display 属性为 flow-root 或 inline-block

​                ● position 属性为 absolute 或 fixed

​                ● float 属性不为 none

​                ● column 属性

**作用：**

​                ● 清除浮动：

BFC 可以解决浮动元素对其父元素的影响。如果某个元素的父元素形成 BFC，则它会包含其内部的浮动子元素，避免父元素高度塌陷的问题。

​                ● 防止 margin 重叠：

当两个块级元素的垂直边距（margin）相遇时，它们的外边距会合并，形成一个更大的外边距。但如果这两个元素分别处于不同的 BFC 中，则边距不会合并，这有助于避免布局意外变动。

​                ● 创建独立的上下文：

在 BFC 内部的元素可以独立于外部的元素进行布局，这对于复杂的布局管理非常重要。它能帮助开发者在相互独立的上下文中对元素进行定位和排版。



```
清除浮动示例：
 
<div class="container">
    <div class="box" style="float: left; width: 100px; height: 100px; background-color: red;"></div>
    <div class="box" style="float: left; width: 100px; height: 100px; background-color: blue;"></div>
</div>
 
在这个例子中，.container 的高度将会塌陷。为了让 .container 包裹住这两个浮动的 .box，我们可以给 .container 设定 overflow: auto; 或者其他能触发 BFC 的样式：
 
.container {
    overflow: auto;  /* 生成 BFC */
    background-color: lightgray;
}
 
 
防止 margin 重叠示例：
 
<div class="box" style="margin-bottom: 20px; background-color: red; height: 100px;"></div>
<div class="box" style="margin-top: 20px; background-color: blue; height: 100px;"></div>
 
这两个元素的 margin 会发生重叠，形成一个更大的外边距。如果其中一个元素设定为 BFC：
 
.box {
    display: flow-root;  /* 生成 BFC */
}
```





 

 

 

### **响应式布局**

#### **rem**





```
function setRemUnit() {
  const docEl = document.documentElement;
  const clientWidth = docEl.clientWidth;
  if (!clientWidth) return;
  const rem = clientWidth / 3.75; // 假设设计图是基于375px宽度
  docEl.style.fontSize = `${rem}px`;
}
 
window.addEventListener('resize', setRemUnit);
window.addEventListener('DOMContentLoaded', setRemUnit);
setRemUnit();
```





#### **vw & vh**





```
vw：可视窗口的宽度
1vw = 设备可视窗口的宽度/100
100vw = 设备可视窗口的宽度
 
vh:可视窗口的高度
1vh = 设备可视窗口的高度/100
100vh = 设备可视窗口的高度
```





#### **媒体查询**





```
@media screen and (min-width: 769px) and (max-width: 1260px) {}
@media screen and (max-width: 768px) {}
 
```





### **动画**



#### **Transition（过渡）**

​                ● 使用transition属性可以创建从一种样式到另一种样式的平滑过渡效果。

​                ● 这个属性通常用来响应用户交互，例如鼠标悬停、点击或获取焦点。

​                ● transition属性可以设置为多个值，分别对应不同的CSS属性，也可以设置为all来应用到所有可过渡的属性上。

**示例：**



```
     .example {
       transition: margin-right 2s;
     }
```





#### **Transform（变换）**

​                ● transform属性可以改变元素的形状、尺寸和位置，通常与transition结合使用以创建动画。

​                ● 可以实现缩放、旋转、倾斜和平移等效果。

**示例：**



```
  .example{
       transform: scale();
     } 
```





#### **Animation（动画）**

​                ● css 动画的实现主要包含两方面：animation（即动画规则配置属性），@keyfram（即动画过程配置属性）。：该属性允许配置动画时间、时长以及其他动画细节;

​                ● ：关键帧@keyframes规则通过在动画序列中定义关键帧（或 waypoints）的样式来控制 CSS 动画序列中的中间步骤。和相比，关键帧 keyframes 可以控制动画序列的中间步骤。

**示例：**



```
<style>
.slidein {
  animation-duration: 3s;
  animation-name: slidein;
  animation-iteration-count: 3;
  animation-direction: alternate;
}
 
@keyframes slidein {
  from {
    margin-left: 100%;
    width: 300%;
  }
 50%{
    font-size:3em;
 }
  to {
    margin-left: 0%;
    width: 100%;
  }
}
 
</style>
<body>
  <h1 class="slidein">Watch me move</h1>
</body>
```