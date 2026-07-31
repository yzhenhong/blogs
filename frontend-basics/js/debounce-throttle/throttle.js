// 函数节流(throttle);
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
