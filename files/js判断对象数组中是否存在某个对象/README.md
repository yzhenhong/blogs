1. 如果要判断数组中是否存在某个元素的话很好判断，直接用数组的indexOf方法就好，存在返回当前索引不存在返回-1
```javascript
var arr=[1,2,3,4]
arr.indexOf(3) // 2
arr.indexOf(5) // -1
```

2. 要只是判断的话是可以遍历后判断对象的属性是否相同的，像这种
```javascript
arr.forEach(item=>{
 if(item.name=='Alex'){
  alert('存在这个元素');
 }
})
```

3. 但实际中往往是需要动态添加或删除对象或元素的，用这个方法的话不好操作，可能会添加或删除掉多个，可以是用string的indexOf方法来判断
```javascript
const option = {name:'111'}
// 如果数组里面本身不存在这个对象则把这个加进去
if(JSON.stringify(arr).indexOf(JSON.stringify(option))==-1){
  arr.push(option); // 进行动态的操作
}
```
这个判断是可以，但存在一个问题需要注意一下，如果对象的顺序不一样，是不能检测到重复的
例如arr = [{name:'张三', sex:'男'}]
option = {sex:'男', name:'张三'}
利用上述方法检测的话，实际上该数组是存在这个数组对象的，但如果用string的indexOf方法是不能检测对的，用这个方法的时候这个点需要注意

4. 还有一个常用方法是设一个flag来做判断的标识
```javascript
let flag = true;
let msg = '';
let arr = []
if(arr.length<6){
  arr.forEach(item=>{
    if(data.id===item.id){ // 对象里的唯一标识id
      msg = '请勿重复添加！'
      flag = false;
    }
  })
}else{
  msg = '最多添加6个！'
  flag = false;
}

if(flag){ // 如果满足条件-数组长度小于6，当前添加的值在数组里不存在，就把值添加进去
  arr.push(data)
}else{ // 否则弹出提示信息
  alert(msg)
}
```

5. 利用数组API some来判断
```javascript
var result = arr.some(item=>{
  if(item.name=='张三'){
    return true
  }
})
console.log(result) // 如果arr数组对象中含有name:'张三',就会返回true，否则返回false
if(result){ // 如果存在
  // do something
}
```