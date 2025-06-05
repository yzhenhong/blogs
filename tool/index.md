<!--
 * @Author: yangzhenhong
 * @Date: 2025-06-04 17:21:16
 * @LastEditors: yangzhenhong
 * @LastEditTime: 2025-06-05 20:29:26
 * @FilePath: \blogs\tool\index.md
 * @Description: 
-->
# 如何用 Chrome 调试微信 web 页面

微信调试有官方的微信开发者工具，这个工具很方便，但是有一个不方便就是调试公众号页面的时候，需要公众号给你授予开发者权限。  
但是有的时候，你仅仅只是想调试页面的样式和一些 DOM 结构，这个时候直接用 Chrome 调试微信 web 页面就显得特别方便了。

1. **打开 Android 手机的开发者模式 和 USB 调试**  
   每个手机打开方式都不一样，请自行搜索解决方案。

2. **打开 Chrome 的 Remote Devices**  
   在 Chrome 地址栏输入：`chrome://inspect/#devices`

   <img src="./imgs/tool/1.png" width="600" height="400" />

3. **手机连接电脑**  
   手机连接电脑的时候，会弹出一个 USB 授权提示弹窗，点击确定。

4. **在 Chrome 上的 Remote Devices 上查看链接的手机情况**  
   确保设备已连接并显示在列表中。

   <img src="./imgs/tool/2.png" width="500" height="300" />

5. **调试手机上的页面**  
   点击要调试的页面的右边的 **Inspect** 按钮，就可以打开进行调试了。  
   但是这个时候我们发现仅仅只能看到浏览器的页面，没有看到微信的 web 页面。

6. **手机微信打开 `http://debugx5.qq.com`，并勾选「打开 TBS 内核 Inspector 调试功能」**  
   勾选后会提示重启，点击确定就行。

   <img src="./imgs/tool/3.png" width="300" height="400" />

7. **微信上打开要调试的 web 页面，就可以在 Chrome 中看到了**  
   刷新 Chrome 的 Remote Devices 页面，此时应该能看到微信的 Web 页面。

   <img src="./imgs/tool/4.png" width="300" height="500" />
   <img src="./imgs/tool/5.png" width="500" height="400" />

8. **点击 Chrome 中 Inspect 按钮即可开始调试**  
   现在可以像调试普通网页一样调试微信内的页面了。

   <img src="./imgs/tool/6.png" width="600" height="400" />
