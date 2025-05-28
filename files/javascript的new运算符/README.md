new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。
```javascript
// JavaScript Demo: Expressions - new operator
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

const car1 = new Car('Eagle', 'Talon TSi', 1993);

console.log(car1.make);
// expected output: "Eagle"

// 语法
new constructor[([arguments])]

// 参数
constructor
一个指定对象实例的类型的类或函数。
arguments
一个用于被 constructor 调用的参数列表。
```

描述
new 关键字会进行如下的操作：
- 创建一个空的简单JavaScript对象（即{}）；
- 为步骤1新创建的对象添加属性__proto__，将该属性链接至构造函数的原型对象 ；
- 将步骤1新创建的对象作为this的上下文 ；
- 如果该函数没有返回对象，则返回this。
（译注：关于对象的 constructor，参见 Object.prototype.constructor）

 上面的第二、三步，箭头函数都是没有办法执行的。

 参考：
 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new