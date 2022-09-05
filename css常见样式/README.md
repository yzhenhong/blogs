## CSS文本超出省略号显示
```css
/* 单行文本不换行，并将超出文本隐藏 */
.box-content{
  width: 220px;
  height: 20px;
  white-space: nowrap;  //让文本不换行，在同一行里面
  overflow: hidden; //让超出的范围进行隐藏
  text-overflow: ellipsis;  //超出的部分用省略号表示
}

/* 多行隐藏 */
{
  word-break: break-all;            //在恰当的断字点进行换行 
  overflow: hidden;                 //文字超出的进行隐藏
  text-overflow: ellipsis;          //超出的文字用省略号表示
  display: -webkit-box;             //将元素设为盒子伸缩模型显示
  -webkit-box-orient: vertical;     //伸缩方向设为垂直方向
  -webkit-line-clamp: 3;            //设定一共3行，超出的部分隐藏，并用省略号来表示
}

/* 兼容所有浏览器的方法 */
.content{
  overflow: hidden;
  position: relative;
  line-height: 20px; 
  max-height: 40px;
}
.content:after{
  content: "...";
  position: absolute;
  bottom: 0;
  right: 5px;
  padding-left: 4px;
  background: linear-gradient(to right, transparent, #fff 55%);
}
.more{
  position: absolute;
  bottom: 0;
  color: #2522ff;
  right: 283px;
  z-index: 9;
  cursor: pointer;
}
/* 备注：
1、将height设置为line-height的整数倍，防止超出的文字露出。
2、给.content::after添加渐变背景可避免文字只显示一半。
3、由于ie6-7不显示content内容，所以要添加标签兼容ie6-7（如：<span>…<span/>）；兼容ie8需要将::after替换成:after。 */
```

## 超出一行时高度自适应
```css
{
  display: flex;
  flex-wrap: wrap;
  padding-left: 5px;
  width: 180px;
  line-height: 20px;
  max-height: 60px;
  align-items: center;
  white-space:normal;
}
```

## 隐藏滚到条
```css
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
```

## 清除默认样式
```css
height:unset!important;
```

## 鼠标移上去变小手
```css
cursor:pointer
```

## input记住账号密码默认样式清除
```css
input {
  color: transparent;
  border-radius: 0%;
  border: none;
  background: transparent;
  background-color: transparent;
  &:-webkit-autofill {
    -webkit-text-fill-color: #c3c7d2 !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }
}
```

## 动画属性
### 一：transition和animation的区别:
1. Transition 强调过渡; Animation 强调流程与控制 。
2. 两者的控制粒度不一样
  1. 某种程度上, transition 更加粗一点, 比如过渡的速度进行了封装, 可以控制是匀速改变还是贝塞尔曲线之类的。
  2. animation 提供的 keyframe 方法, 可以让你手动去指定每个阶段的属性; 此外 animation 还封装了循环次数, 动画延迟等功能, 更加自由和强大。
3. 动画状态: 
  1. CSS的 transition 只有两个状态:开始状态 和 结束状态 。
  2. animation 可能是多个状态, 有帧的概念 。
4. 动画触发方式:
  1. CSS的transition需要借助别的方式来触发, 比如CSS的状态选择器（如:hover）或 借助JavaScript来触发 。
  2. animation 不但可以使用上面的方式触发, 更重要的是可以自动触发 。
5. animation 控制动效上要比 transition 强，因为它具备一些控制动效的属性，比如“播放次数”、“播放方向”、“播放状态”等。
6. 动画实现的范围:
  1. transition 是有一定限制的, 并不是所有 CSS 的属性都具有过渡效果 。
  2. 另外相比而言, CSS 的 animation 要比 transition 强大的多, 几乎所有的 css 属性都可以实现动画效果。
  3. 这也是为什么使用 animation 制作 Web 动画的场景更多 。
7. 动画实现方式
  1. CSS 的 animation 是离不开 @keyframes 的，换句话说，我们需要先使用 @keyframes 来注册一个动画效果，即帧来描述动画效果。当然，只注册也不见得有效果，还是需要使用 animation-name 属性引用 @keyframes 注册好的动画效果。
"注意": CSS transform 也是用来制作动效的，这个说法有点偏颇，CSS transform 只不过提供了一些函数，可以做不同的变换，这些函数运用于 CSS 的 transition 或 @keyframes 中能得到一些不同的效果，特别是配上时间，缓动函数之类的，效果会更佳。因此也被识认为是动效中不可或缺。其实在 animation 中，可以发挥你的想象，使用 CSS 中任意属性，实现一些有创意的动效。
### 二：transition和animation的共同点:
1. 从整体来看，animation 和 transition 想做的事情都是一样, 通过控制属性变化的过程也, 实现动画; 都是立足于控制本身 dom 的 css 属性变化过程, 来实现动画的视觉效果。而你看 transform 就不同, 本身一个 css 属性 。
2. 他们都有“持续时间”、“延迟时间” 和“时间缓动函数”等概念，这些都是用来控制动效的效果。
```css
/* 向此元素应用动画效果 */
/* animation: name duration timing-function delay iteration-count direction; */
animation-name	规定需要绑定到选择器的 keyframe 名称。。
animation-duration	规定完成动画所花费的时间，以秒或毫秒计。
animation-timing-function	规定动画的速度曲线。
animation-delay	规定在动画开始之前的延迟。
animation-iteration-count	规定动画应该播放的次数。
animation-direction	规定是否应该轮流反向播放动画。
div {
  width: 100px;
  height: 100px;
  background-color: red;
  /* animation:mymove 5s infinite; */
  /* 动画名称 */
  animation-name: mymove;
  /* 动画持续四秒 */
  animation-duration: 4s;
  /* 属性指定动画应运行的次数。 */
  animation-iteration-count: infinite;
  /* 这个属性规定动画开始的延迟时间 */
  animation-delay: 2s;
}
@keyframes mymove {
  from {background-color: red;}
  to {background-color: blue;}
}
/* 可以通过百分比设置 */
/* 动画代码 ,以百分比的形式来完成动画*/
@keyframes mymove {
  0% {background-color: red;}
  25% {background-color: yellow;}
  50% {background-color: blue;}
  100% {background-color: green;}
}


{
  transition: all .3s ease;
}
linear:
规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。(匀速)
ease:
规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）（相对于匀速，中间快，两头慢）。
ease-in:
规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）（相对于匀速，开始的时候慢，之后快）。
ease-out:
规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）（相对于匀速，开始时快，结束时候间慢，）。
ease-in-out:
规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）（相对于匀速，（开始和结束都慢）两头慢）。
cubic-bezier(n,n,n,n):
在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。
```

## 媒体查询@media
通过@media可以针对不同屏幕大小定义不同样式的网页，页面会根据浏览器长宽来渲染页面。
语法：
```css
@media mediaType and|not|only (media feature) {
  /*CSS-Code;*/
}
```
常用电脑屏幕使用宽度:
1024 1280 1366 1440 1680 1920

### 逻辑操作符

- and：用于将多个媒体查询组合成一条媒体查询，当每个查询规则都为真时则该条媒体查询为真，另外通过 and 操作符还可以将媒体特性与媒体类型结合在一起；
- not：用于否定媒体查询，当查询规则不为真时则返回 true，否则返回 false。如果使用 not 操作符，则还必须指定媒体类型；
- only：仅在整个查询匹配时才会生效，当不使用 only 时，旧版的浏览器会将 screen and (max-width: 500px) 简单地解释为 screen，忽略查询的其余部分，并将样式应用于所有屏幕。 如果使用 only 运算符，则还必须指定媒体类型。

and|not|only
and放在mediaType后，连接属性，代表将多个media feature结合在一起；
not否定，放在@media后，代表对该条信息取反；
only代表仅仅，一般放在@media后，例如：@media only screen，代表仅仅针对彩色屏幕有效；

逻辑操作符包含 not、and 和 only 三个，通过逻辑操作符可以构建复杂的媒体查询，您还可以通过逗号来分隔多个媒体查询，将它们组合为一个规则。

### mediaType媒体类型
- all所有屏幕;
- screen 用于电脑屏幕，平板电脑，智能手机等;
- print 用于打印机和打印预览;
- speech 应用于屏幕阅读器等发声设备

media feature: 媒体功能,max-width:页面最大宽度，min-width:页面最小宽度

在使用媒体查询前面，首先要设置meta标签，其次要加载兼容文件js,设置ie渲染为最高；
```css
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```

注意：
1. 一般引入第一条meta标签就可以使用
2. and|not|only (media feature)注意啦and和(media feature)之间有一个空格！！！ 

### 定义媒体查询

目前您可以通过以下两种方式来定义媒体查询：

- 使用 @media 或 @import 规则在样式表中指定对应的设备类型；
- 用 media 属性在
1. @media
    使用 @media 您可以指定一组媒体查询和一个 CSS 样式块，当且仅当媒体查询与正在使用的设备匹配时，指定的 CSS 样式才会应用于文档。示例代码如下：
```css
/* 在小于或等于 992 像素的屏幕上，将背景色设置为蓝色 */
@media screen and (max-width: 992px) {
  body {background-color: blue;}
}
 
/* 在 600 像素或更小的屏幕上，将背景色设置为橄榄色 */
@media screen and (max-width: 600px) {
  body {background-color: olive;}
}
```

用min-width时，小的放上面大的在下面
```css
/*>=1024的设备*/
@media (min-width: 1024px){
  body{font-size: 18px;}
}
 
/*>=1280的设备*/
@media (min-width: 1280px) {
  body{font-size: 20px;}
}
```

用max-width那么就是大的在上面，小的在下面
```css
@media (max-width: 1680px) {
  body {background-color: #ff6699;}
}
 
@media (max-width: 1440px) {
  body {background-color: #00ff66;}
}
```

2. @import
@import 用来导入指定的外部样式文件并指定目标的媒体类型，示例代码如下：
```css
@import url("css/screen.css") screen;   /* 引入外部样式，该样式仅会应用于电脑显示器 */
@import url("css/print.css") print;     /* 引入外部样式，该样式仅会应用于打印设备 */
body {
  background: #f5f5f5;
  line-height: 1.2;
}
```
注意：所有 @import 语句都必须出现在样式表的开头，而且在样式表中定义的样式会覆盖导入的外部样式表中冲突的样式。

3. link标签使用
```html
/* 当页面宽度大于等于 900 像素时应用该样式 */
<link rel="stylesheet" media="screen and (min-width: 900px)" href="widescreen.css">
/* 当页面宽度小于等于 600 像素时应用该样式 */
<link rel="stylesheet" media="screen and (max-width: 600px)" href="smallscreen.css">
```
提示：在 media 属性中您还可以指定多种媒体类型，每种媒体类型之间使用逗号进行分隔，例如 media=“screen, print”。

## 容器查询@container

将父元素的样式应用于子元素。

```css
/* 当父容器宽度小于 650px 时，
减小 .card 元素之间的网格间距到 1rem */
@container (max-width: 650px) {
  .card {
    gap: 1rem;
  }
  /* ... */
}
```