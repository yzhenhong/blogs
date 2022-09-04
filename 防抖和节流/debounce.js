// 函数防抖(debounce)
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
