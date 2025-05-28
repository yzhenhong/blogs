函数简单的说就是重复执行的代码块。它只定义一次，但可能被执行或调用任意次。

```javascript
// 普通函数-----------------------------------
function fn(){ ... }    
// 该函数就是普通函数，也叫命名函数，fn就是函数的名字 
var fn = function(){ ... }  
// 该函数是匿名函数，function后面没有跟名字，只不过将该函数赋值给了定义的变量fn 

function person2 (name,age) { // undefined
  console.log('this:',this)
  this.name = name;
  this.age = age;
  my = 'dhk'
  this.sayName = function () { // undefined
    console.log(this.name);
  }
  console.log(this.age);
}
var person = person2("lucy","23"); // this 指向window
window.sayName(); // luck

// 构造函数-----------------------------------
// 能通过 new 函数名(是function后面跟的名字)   来实例化对象的函数叫构造函数。
// 构造函数定义时首字母大写（规范）。
function Fn(){ ... }  // 这就是一个构造函数
var f = new Fn()  // 这个叫实例化对象

function Person (name,age) {   //一般都是首字母大写
  this.name=name;
  this.age=age;
  this.sayName=function (){
    console.log(this.name);
  }
}
var personw =new Person("make","18");   //new 一个对象    this指向Person
personw.sayName();   //make

// 匿名函数-----------------------------------
(function () {
  var x = "Hello!!";   
})() // 外部括上小括号，

!function() {
	console.log('test');
}() // 默认返回false

~function() {
	console.log('test');
}() // 默认返回-1

+function() {
	console.log('test');
}() // 默认返回NaN

(function(){
  console.log("匿名函数自我调用");
})(); //调用匿名函数

// 将匿名函数赋值给变量
var cat = function () {
  console.log("赋值的匿名函数");
}
cat();

// 闭包-----------------------------------
var mybox = (function box (n) {
  return function(x){
    return n+x;
  }
})('测试')
console.log(mybox('dddd'));
 
// 箭头函数-----------------------------------
1、ES6允许使用"箭头"（=>）定义函数。
2、箭头函数是匿名函数，不能做构造函数，不能使用new，没有原型属性
3、箭头函数的出现就是为了解决this指向问题。
（this始终指向父级上下文，也就是父级的this）
4、箭头函数内没有arguments，可以用展开运算符 ...arg 解决 
5、箭头函数不能通过call() 、 apply() 、bind()方法直接修改它的this指向。
但是可以正常传参

var arrowFn = () => { ... }  // 这就是一个箭头函数，因为是个匿名函数，所以赋值给了arrowFn变量 
var arrowFn = arg => { ... }  // 一个参数的话可以简写
var arrowFn = arg => arg + 100  // 简短的retuen 可以省略{}

var fn = (...arg) => {  // 通过展开运算符...
	console.log(arg)  // Array(9) [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
}
fn(1,2,3,4,5,6,7,8,9)
console.log(fn.prototype)  // undefined

x => x * x; // 相当于 function(x){return xx}
()=> 36;
(x,y)=>x*y;

// 箭头函数闭包
var a = 10;
var foo = (a => (() => a++))(a);
foo()

// 箭头函数没有prototype(原型)，所以箭头函数本身没有this
let a = () =>{};
console.log(a.prototype); // undefined

// 箭头函数没有this，是继承上级的this （箭头函数的this指向在定义的时候继承自外层第一个普通函数的this）
function f(){undefined
  this.a = 1
  return ()=> console.log(this.a)
}
f()() // 1

// 箭头函数没有arguments，是继承上级的arguments （在箭头函数中访问arguments实际上获得的是外层局部（函数）执行环境中的值）
function f(){ // undefined
  return ()=> console.log(arguments)
}
f(1,2)(3,4) // [1,2]

// 箭头函数不能作为构造函数使用
我们先了解一下构造函数的new都做了些什么？
简单来说，分为四步：
 ① JS内部首先会先生成一个对象； 
 ② 再把函数中的this指向该对象； 
 ③ 然后执行构造函数中的语句；
 ④ 最终返回该对象实例。
因为箭头函数没有自己的this，它的this其实是继承了外层执行环境中的this，
且this指向永远不会随在哪里调用、被谁调用而改变，
所以箭头函数不能作为构造函数使用，或者说构造函数不能定义成箭头函数，
否则用new调用时会报错！
```

```javascript
构造函数不仅只出现在JavaScript中，它同样存在于很多主流的程序语言里，
比如c++、Java、PHP等等。
与这些主流程序语言一样，构造函数在js中的作用，
也是用来创建对象时初始化对象，并且总与new运算符一起使用。

在js中，构造函数与普通函数的区别不是很大。接下来就主要讲讲两者的区别。

1.在命名规则上，构造函数一般是首字母大写，普通函数则是遵照小驼峰式命名法。
2.在函数调用时。

//构造函数
function Egperson (name,age) {
  this.name = name;
  this.age = age;
  this.sayName = function () {
    alert(this.name);
  }
}
var person = new Egperson('mike','18'); // this-->person
person.sayName();  // 'mike'

构造函数的执行流程：（构造函数会马上创建一个新对象，并将该新对象作为返回值返回）
A、立刻在堆内存中创建一个新的对象
B、将新建的对象设置为函数中的this
C、逐个执行函数中的代码
D、将新建的对象作为返回值

//普通函数
function egPerson (name,age) {
  this.name = name;
  this.age = age;
  this.sayName = function () {
    alert(this.name);
  }
}
egPerson('alice','23'); // this-->window
window.sayName();  // 'alice'

可以看出：
- 构造函数内部会创建一个实例，调用普通函数时则不会创建新的对象。
- 构造函数内部的this指向是新创建的person实例，
而普通函数内部的this指向调用函数的对象（如果没有对象调用，默认为window）
- 返回值

返回值方面，对于构造函数而言，
如果返回值是基本数据类型，那么返回值就是this指向的实例；
如果是复杂数据类型，那么返回值为对象（不知道这句话对不对）。
 

参考：http://www.cnblogs.com/aishangJava/p/7232680.html

```