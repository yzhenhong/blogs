## 概念

函数防抖(debounce)：

触发高频事件后n秒内函数只会执行一次， 如果n秒内高频事件再次被触发，则重新计算时间。                 

函数节流(throttle)：              

高频事件触发，但在n秒内只会执行一次， 所以节流会稀释函数的执行频率。              

函数节流（throttle）与 函数防抖（debounce）都是为了限制函数的执行频次， 以优化函数触发频率过高导致的响应速度跟不上触发频率，出现延迟，假死或卡顿的现象。     



​         

## 函数防抖(debounce)

实现方式：每次触发事件时设置一个延迟调用方法，并且取消之前的延时调用方法 缺点：如果事件在规定的时间间隔内被不断的触发，则调用方法会被不断的延迟              

```javascript
// 非立即执行版
function debounce(func, wait) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// 立即执行版
function debounce2(func, wait) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer);
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    if (callNow) func.apply(context, args);
  };
}

// 合成版
/**
 * @desc 函数防抖
 * @param func 目标函数
 * @param wait 延迟执行毫秒数
 * @param immediate true - 立即执行， false - 延迟执行
 */
function debounce3(func, wait, immediate) {
  let timer = null;
  return function () {
    let _this = this,
      arg = arguments;
    timer && clearTimeout(timer);
    if (immediate) {
      let doVal = !timer;
      setTimeout(function () {
        timer = null;
      }, wait);
      if (doVal) {
        func.apply(_this, arg);
      }
    } else {
      timer = setTimeout(function () {
        func.apply(_this, arg);
      }, wait);
    }
  };
}
```

## 函数节流(throttle)

实现方式：每次触发事件时，如果当前有等待执行的延时函数，则直接return
```javascript
// 时间戳版
function throttle(func, wait) {
  let previous = 0;
  return function () {
    let _this = this,
      arg = arguments;
    let now = new Date();
    if (now - previous > wait) {
      func.apply(_this, arg);
      previous = now;
    }
  };
}

// 定时器版
function throttle2(func, wait) {
  let timer;
  return function () {
    let _this = this,
      arg = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        timer = null;
        func.apply(_this, arg);
      }, wait);
    }
  };
}
```

## 总结

函数防抖：将多次操作合并为一次操作进行。 原理是维护一个计时器，规定在delay时间后触发函数， 但是在delay时间内再次触发的话，就会取消之前的计时器而重新设置。 这样一来，只有最后一次操作能被触发。 

函数节流：使得一定时间内只触发一次函数。原理是通过判断是否有延迟调用函数未执行。 

区别： 函数节流不管事件触发有多频繁， 都会保证在规定时间内一定会执行一次真正的事件处理函数， 而函数防抖只是在最后一次事件后才触发一次函数。  比如在页面的无限加载场景下，我们需要用户在滚动页面时， 每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。 这样的场景，就适合用节流技术来实现。              