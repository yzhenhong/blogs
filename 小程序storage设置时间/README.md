```javascript
// 设置缓存的过期时间
const dtime = '_deadtime';
function setStorage(k, v, t) {
  wx.setStorageSync(k, v)
  const seconds = parseInt(t);
  if (seconds > 0) {
    const timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    wx.setStorageSync(k + dtime, timestamp + "")
  } else {
    wx.removeStorageSync(k + dtime)
  }
}

function getStorage(k, def) {
  const deadtime = parseInt(wx.getStorageSync(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return; }
    }
  }
  const res = wx.getStorageSync(k);
  if (res) {
    return res;
  } else {
    return def;
  }
}
 
function removeStorage(k) {
  wx.removeStorageSync(k);
  wx.removeStorageSync(k + dtime);
}
 
function clearStorage() {
  wx.clearStorageSync();
}
 
module.exports = {
  setStorage: setStorage,
  getStorage: getStorage,
  removeStorage: removeStorage,
  clearStorage: clearStorage,
}
```