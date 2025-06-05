# JavaScript 完全指南

## 目录
1. [JavaScript 基础](#javascript-基础)
2. [数据类型](#数据类型)
3. [函数](#函数)
4. [对象](#对象)
5. [数组](#数组)
6. [异步编程](#异步编程)
7. [设计模式](#设计模式)
8. [性能优化](#性能优化)

## JavaScript 基础

### 变量声明
1. var（不推荐）
```javascript
var name = 'John';
console.log(name); // John
```

2. let（推荐）
```javascript
let age = 25;
console.log(age); // 25
```

3. const（推荐）
```javascript
const PI = 3.14159;
console.log(PI); // 3.14159
```

### 作用域
1. 全局作用域
```javascript
var globalVar = '全局变量';
function test() {
  console.log(globalVar); // 可以访问
}
```

2. 函数作用域
```javascript
function test() {
  var localVar = '局部变量';
  console.log(localVar); // 可以访问
}
console.log(localVar); // 报错：localVar is not defined
```

3. 块级作用域
```javascript
{
  let blockVar = '块级变量';
  console.log(blockVar); // 可以访问
}
console.log(blockVar); // 报错：blockVar is not defined
```

### 运算符
1. 算术运算符
```javascript
let a = 10, b = 3;
console.log(a + b);  // 13
console.log(a - b);  // 7
console.log(a * b);  // 30
console.log(a / b);  // 3.333...
console.log(a % b);  // 1
```

2. 比较运算符
```javascript
console.log(5 > 3);   // true
console.log(5 >= 5);  // true
console.log(5 == '5'); // true
console.log(5 === '5'); // false
```

3. 逻辑运算符
```javascript
console.log(true && false); // false
console.log(true || false); // true
console.log(!true);        // false
```

## 数据类型

### 基本类型
1. Number
```javascript
let num = 42;
let float = 3.14;
let infinity = Infinity;
let nan = NaN;
```

2. String
```javascript
let str = 'Hello';
let template = `Hello ${name}`;
let multiLine = `
  第一行
  第二行
`;
```

3. Boolean
```javascript
let isTrue = true;
let isFalse = false;
```

4. Undefined
```javascript
let notDefined;
console.log(notDefined); // undefined
```

5. Null
```javascript
let empty = null;
console.log(empty); // null
```

6. Symbol
```javascript
let sym1 = Symbol('description');
let sym2 = Symbol('description');
console.log(sym1 === sym2); // false
```

### 引用类型
1. Object
```javascript
let obj = {
  name: 'John',
  age: 30,
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
```

2. Array
```javascript
let arr = [1, 2, 3];
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
```

3. Function
```javascript
function greet(name) {
  return `Hello ${name}`;
}
```

## 函数

### 函数声明
1. 函数声明
```javascript
function add(a, b) {
  return a + b;
}
```

2. 函数表达式
```javascript
const add = function(a, b) {
  return a + b;
};
```

3. 箭头函数
```javascript
const add = (a, b) => a + b;
```

### 函数特性
1. 闭包
```javascript
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

2. 高阶函数
```javascript
function map(arr, fn) {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const doubled = map(numbers, x => x * 2);
console.log(doubled); // [2, 4, 6]
```

3. 柯里化
```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3)); // 6
```

## 对象

### 对象创建
1. 字面量
```javascript
const obj = {
  name: 'John',
  age: 30,
  sayHello() {
    console.log(`Hello, I'm ${this.name}`);
  }
};
```

2. 构造函数
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const person = new Person('John', 30);
```

3. Object.create()
```javascript
const proto = {
  greet() {
    return `Hello ${this.name}`;
  }
};

const obj = Object.create(proto);
obj.name = 'John';
console.log(obj.greet()); // Hello John
```

### 原型链
```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a noise.`;
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return `${this.name} barks.`;
};

const dog = new Dog('Rex');
console.log(dog.speak()); // Rex barks.
```

## 数组

### 数组方法
1. 修改原数组
```javascript
const arr = [1, 2, 3];

// push, pop
arr.push(4);
console.log(arr); // [1, 2, 3, 4]
arr.pop();
console.log(arr); // [1, 2, 3]

// shift, unshift
arr.unshift(0);
console.log(arr); // [0, 1, 2, 3]
arr.shift();
console.log(arr); // [1, 2, 3]

// splice
arr.splice(1, 0, 'a');
console.log(arr); // [1, 'a', 2, 3]
```

2. 不修改原数组
```javascript
const arr = [1, 2, 3];

// map
const doubled = arr.map(x => x * 2);
console.log(doubled); // [2, 4, 6]

// filter
const evens = arr.filter(x => x % 2 === 0);
console.log(evens); // [2]

// reduce
const sum = arr.reduce((a, b) => a + b, 0);
console.log(sum); // 6
```

### 数组操作
1. 遍历
```javascript
const arr = [1, 2, 3];

// forEach
arr.forEach(item => console.log(item));

// for...of
for (const item of arr) {
  console.log(item);
}
```

2. 查找
```javascript
const arr = [1, 2, 3, 4, 5];

// find
const found = arr.find(x => x > 3);
console.log(found); // 4

// findIndex
const index = arr.findIndex(x => x > 3);
console.log(index); // 3
```

## 异步编程

### Promise
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const random = Math.random();
    if (random > 0.5) {
      resolve('成功');
    } else {
      reject('失败');
    }
  }, 1000);
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Async/Await
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 事件循环
```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// 输出顺序：1, 4, 3, 2
```

## 设计模式

### 单例模式
```javascript
class Singleton {
  static instance;
  
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
  }
  
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();
console.log(instance1 === instance2); // true
```

### 观察者模式
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event]
        .filter(cb => cb !== callback);
    }
  }
}

const emitter = new EventEmitter();
emitter.on('data', data => console.log(data));
emitter.emit('data', 'Hello World');
```

### 工厂模式
```javascript
class VehicleFactory {
  createVehicle(type) {
    switch(type) {
      case 'car':
        return new Car();
      case 'truck':
        return new Truck();
      default:
        throw new Error('Unknown vehicle type');
    }
  }
}

class Car {
  drive() {
    console.log('Driving a car');
  }
}

class Truck {
  drive() {
    console.log('Driving a truck');
  }
}

const factory = new VehicleFactory();
const car = factory.createVehicle('car');
car.drive(); // Driving a car
```

## 性能优化

### 代码优化
1. 避免全局变量
```javascript
// 不好的做法
var globalVar = 'global';

// 好的做法
(function() {
  var localVar = 'local';
})();
```

2. 使用 const 和 let
```javascript
// 不好的做法
var name = 'John';

// 好的做法
const name = 'John';
let age = 30;
```

3. 避免闭包陷阱
```javascript
// 不好的做法
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}

// 好的做法
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}
```

### 内存管理
1. 垃圾回收
```javascript
// 自动垃圾回收
let obj = { data: 'some data' };
obj = null; // 对象可以被垃圾回收
```

2. 内存泄漏
```javascript
// 避免内存泄漏
function addHandler() {
  const element = document.getElementById('button');
  element.addEventListener('click', function() {
    // 处理点击事件
  });
  
  // 记得在不需要时移除事件监听器
  return function() {
    element.removeEventListener('click', handler);
  };
}
```

### 性能监控
1. 性能指标
```javascript
// 使用 Performance API
performance.mark('start');
// 执行一些操作
performance.mark('end');
performance.measure('duration', 'start', 'end');
```

2. 性能分析工具
```javascript
// 使用 console.time
console.time('operation');
// 执行一些操作
console.timeEnd('operation');
```

### 代码分割
```javascript
// 动态导入
async function loadModule() {
  const module = await import('./module.js');
  module.doSomething();
}
```

### 缓存优化
```javascript
// 使用 localStorage 缓存数据
function cacheData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getCachedData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
```

### **new操作符**

#### 基本概念
当使用 new 调用函数时，会发生以下步骤：
1. 创建一个空的简单 js 对象（即{}）
2. 为步骤1新创建的对象上面添加属性 proto，并将该属性链接至构造函数的原型对象
3. 将步骤1创建的对象作为 this 的上下文
4. 如果函数没有返回对象，则返回 this

#### 实现示例
```javascript
function myNew(constructor, ...args) {
    // Step 1: 创建一个新的空对象
    const newObj = {};
    // Step 2: 将新对象的原型设置为构造函数的 prototype 属性
    newObj.__proto__ = constructor.prototype;
    // Step 3 & 4: 将构造函数的作用域绑定到新对象并执行构造函数的代码
    const result = constructor.call(newObj, ...args);
    // Step 5: 如果构造函数没有返回其他对象，则返回新创建的对象
    return result instanceof Object ? result : newObj;
}

function newApply(construct, ...rest) {
    // 步骤一 创建一个空对象
    const newObj = {} 
    // 步骤二 新创建的对象上面添加属性 __proto__, 
    // 并将该属性链接至构造函数的原型对象
    newObj.__proto__ = construct.prototype 
    // 步骤三 新创建的对象作为 this 的上下文
    const result = construct.apply(newObj, rest)
    // 步骤四 如果执行结果有返回值并且是一个对象，就返回执行的结果，
    // 否者返回 this 也就是新创建的对象 newObj
    return typeof result === 'object' ? result : newObj
}
```

#### 使用示例
```javascript
// 常规构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  console.log(`Hello, my name is ${this.name}`);
};
```

#### new 与普通函数调用的区别

| **特性**      | **使用 new 调用**     | **普通函数调用**              |
| ------------- | --------------------- | ----------------------------- |
| **this 指向** | 新创建的对象          | 全局对象(或undefined严格模式) |
| **返回值**    | 默认返回新对象        | 默认返回undefined             |
| **原型链**    | 连接到构造函数的prototype | 无特殊原型连接            |
| **用途**      | 创建特定类型的对象    | 执行普通功能                  |

#### ES6 类与 new
ES6 的 class 语法糖本质还是基于原型和 new：

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

// 必须用new调用，否则报错
const animal = new Animal('Dog');
```

#### 注意事项
- 忘记使用 new：某些构造函数会检查是否用 new 调用
- 箭头函数不能用作构造函数：没有自己的 this 和 prototype
- 性能考虑：大量创建对象时，考虑对象池等优化模式

### **__proto__**

#### 基本概念
__proto__ 是 JavaScript 中用于访问对象原型链的非标准属性（现已标准化为可选特性）。它是理解 JavaScript 原型继承机制的关键概念。

#### 定义
- 是一个访问器属性（getter/setter），暴露了对象的内部 [[Prototype]]
- 形成了 JavaScript 的原型链，用于实现继承

#### 与 prototype 的区别

| **特性**     | __proto__              | prototype                        |
| ------------ | ---------------------- | -------------------------------- |
| **所属对象** | 所有对象都有           | 只有函数对象才有                 |
| **作用**     | 访问对象的原型链       | 作为构造函数创建实例时的原型模板 |
| **标准性**   | 非标准（但被广泛实现） | 标准属性                         |

#### 基本用法
```javascript
// 1. 查看原型
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype); // true

// 2. 修改原型（不推荐）
const animal = { eats: true };
const rabbit = { jumps: true };
rabbit.__proto__ = animal; // 设置原型
console.log(rabbit.eats); // true (通过原型链访问)
```

#### 现代替代方案
```javascript
// 1. Object.getPrototypeOf()
const arr = [];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// 2. Object.setPrototypeOf()
const animal = { eats: true };
const rabbit = { jumps: true };
Object.setPrototypeOf(rabbit, animal); // 更安全的设置原型方式
```

#### 原型链图示
```
rabbit { jumps: true }
  │
  ▼ __proto__
animal { eats: true }
  │
  ▼ __proto__
Object.prototype
  │
  ▼ __proto__
null
```

#### 注意事项
- 性能影响：修改现有对象的 __proto__ 会破坏 JavaScript 引擎优化
- 标准替代：应优先使用 Object.getPrototypeOf() 和 Object.setPrototypeOf()
- 不可滥用：过度使用原型链会影响代码可维护性
- 浏览器兼容：所有现代浏览器都支持，但生产环境建议用标准方法

### **函数柯里化**

#### 基本概念
- 多个参数的函数变换成接受单一参数的函数，并且返回接受余下参数的新函数的技术
- 固定部分参数，返回一个接受剩余参数的函数，也称为部分计算函数
- 目的是为了缩小适用范围，创建一个针对性更强的函数
- 核心思想是把多参数传入的函数拆成一个个的单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数

#### 优点
- 提高代码的可读性和维护性：通过将复杂函数分解为简单的函数，使得代码更加清晰易懂
- 实现部分应用：通过柯里化，可以创建只接受部分参数的函数，这在处理可选参数或默认参数时非常有用
- 延迟计算：柯里化允许函数的参数被逐步计算，这在处理复杂计算时可以提高效率

#### 缺点
- 性能开销：柯里化会增加函数的调用次数，可能会引入额外的性能开销，尤其是在处理大量参数时
- 代码膨胀：柯里化会导致生成的函数数量增加，可能会使代码体积增大，影响运行效率

#### 简单示例
```javascript
// 普通函数
function add(a, b) {
  return a + b;
}

// 柯里化版本
function curriedAdd(a) {
  return function(b) {
    return a + b;
  };
}

add(2, 3);       // 5
curriedAdd(2)(3); // 5
```

#### 实现原理
```javascript
/**
 * 将函数柯里化
 * @param {Function} fn 需要柯里化的原函数
 * @returns {Function} 柯里化后的函数
 */
function curry(fn) {
  return function curried(...args) {
    // 如果当前参数数量 >= 原函数参数数量，直接执行
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    // 否则返回一个新函数，接收剩余参数
    else {
      return function(...moreArgs) {
        // 递归调用，合并新旧参数
        return curried.apply(this, args.concat(moreArgs));
      }
    }
  };
}

// 使用示例
function sum(a, b, c) {
  return a + b + c;
}
const curriedSum = curry(sum);
curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3);  // 6
curriedSum(1)(2, 3);  // 6
```

#### 使用场景

1. 参数复用与函数组合
```javascript
// 基础URL构建函数
const buildUrl = (protocol) => (domain) => (path) => 
  `${protocol}://${domain}/${path}`;

// 创建特定协议的函数
const buildHttpsUrl = buildUrl('https');
const buildHttpUrl = buildUrl('http');

// 创建特定网站的URL构建函数
const buildMySiteUrl = buildHttpsUrl('mysite.com');
const buildApiUrl = buildHttpsUrl('api.mysite.com');

// 使用
buildMySiteUrl('home'); // "https://mysite.com/home"
buildApiUrl('users');   // "https://api.mysite.com/users"
```

2. 延迟执行与按需调用
```javascript
// 表单验证器
const validate = (rule) => (value) => rule.test(value);

// 创建特定验证规则
const isEmail = validate(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const isPhone = validate(/^1[3-9]\d{9}$/);
const isStrongPassword = validate(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/);

// 使用
isEmail('test@example.com'); // true
isPhone('13800138000');      // true
```

3. 动态配置与预设参数
```javascript
// 日志记录器
const createLogger = (level) => (message) => 
  console.log(`[${level.toUpperCase()}] ${new Date().toISOString()}: ${message}`);

// 创建特定级别的日志函数
const logInfo = createLogger('info');
const logError = createLogger('error');
const logDebug = createLogger('debug');

// 使用
logInfo('System started'); // [INFO] 2023-05-01T10:00:00.000Z: System started
logError('DB connection failed'); // [ERROR] 2023-05-01T10:00:01.000Z: DB connection failed
```

4. 函数管道与数据转换
```javascript
// 数据处理函数
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// 柯里化的处理函数
const filter = predicate => arr => arr.filter(predicate);
const map = mapper => arr => arr.map(mapper);
const sort = comparator => arr => [...arr].sort(comparator);

// 构建处理管道
const processUsers = pipe(
  filter(user => user.active),
  map(user => ({ ...user, name: user.name.toUpperCase() })),
  sort((a, b) => a.age - b.age)
);

// 使用
const users = [{name: 'alice', age: 30, active: true}, ...];
const result = processUsers(users);
```

### **call、apply、bind**

#### 共同点
- 都是改变 this 的指向
- 传入的第一个参数都是绑定 this 的指向
- 在非严格模式中，如果第一个参数是 null 或者 undefined，会把全局对象（浏览器是 window）作为 this 的值
- 在严格模式中，null 就是 null，undefined 就是 undefined

#### 区别
- call 和 apply 唯一的区别是：call 传入的是参数列表，apply 传入的是数组，也可以是类数组
- bind 和 call、apply 的区别：bind 返回的是一个改变了 this 指向的函数，便于稍后调用，不像 call 和 apply 会立即调用
- bind 和 call 很像，传入的也是参数列表，但是可以多次传入，不需要像 call，一次传入

#### 注意事项
当 bind 返回的函数使用 new 作为构造函数时，绑定的 this 值会失效，this 指向实例对象，但传入的参数依然生效（new 调用的优先级 > bind 调用）

#### 对比表格

|                    | **bind**                           | **apply**                                                | **call**              |
| ------------------ | ---------------------------------- | -------------------------------------------------------- | --------------------- |
| 是否执行调用的函数 | 否                                 | 是                                                       | 是                    |
| 参数               | (this指向，参1，参2…)              | (this指向，[参数数组])                                   | (this指向，参1，参2…) |
| 用途               | 改变定时器内部的 this 指向等       | 跟数组有关系，比如借助于数学对象实现数组最大值最小值     | 经常用做继承          |

### **Array 常用方法**

#### 一、修改原数组的方法
```javascript
1. push() - 末尾添加元素
const arr = [1, 2];
arr.push(3); // arr变为[1, 2, 3]

2. pop() - 删除并返回最后一个元素
const last = arr.pop(); // last=3, arr变回[1, 2]

3. unshift() - 开头添加元素
arr.unshift(0); // arr变为[0, 1, 2]

4. shift() - 删除并返回第一个元素
const first = arr.shift(); // first=0, arr变回[1, 2]

5. splice() - 添加/删除元素
arr.splice(1, 0, 'a'); // 在索引1处插入'a'，arr变为[1, 'a', 2]
arr.splice(1, 1); // 删除索引1处的元素，arr变回[1, 2]

6. reverse() - 反转数组
arr.reverse(); // arr变为[2, 1]

7. sort() - 数组排序
[3, 1, 2].sort((a, b) => a - b); // [1, 2, 3]
```

#### 二、不修改原数组的方法
```javascript
1. concat() - 合并数组
const newArr = arr.concat([3, 4]); // [1, 2, 3, 4]

2. slice() - 截取数组
arr.slice(1); // [2]
arr.slice(0, 1); // [1]

3. join() - 数组转字符串
arr.join('-'); // "1-2"
```

#### 三、遍历方法
```javascript
1. forEach() - 遍历执行函数
arr.forEach(item => console.log(item));

2. map() - 映射新数组
const doubled = arr.map(x => x * 2); // [2, 4]

3. filter() - 过滤数组
const evens = [1, 2, 3].filter(x => x % 2 === 0); // [2]

4. reduce() - 累计计算
const sum = [1, 2, 3].reduce((acc, cur) => acc + cur, 0); // 6

5. find() - 查找元素
const found = [1, 2, 3].find(x => x > 1); // 2

6. findIndex() - 查找元素索引
[1, 2, 3].findIndex(x => x === 2); // 1

7. some() - 是否有元素满足条件
const hasEven = [1, 2, 3].some(x => x % 2 === 0); // true

8. every() - 是否所有元素满足条件
const allEven = [2, 4, 6].every(x => x % 2 === 0); // true
```

#### 四、ES6+ 新增方法
```javascript
1. includes() - 是否包含某元素
arr.includes(2); // true

2. flat() - 数组扁平化
[1, [2, [3]]].flat(2); // [1, 2, 3]

3. flatMap() - 映射后扁平化
[1, 2].flatMap(x => [x, x * 2]); // [1, 2, 2, 4]

4. Array.from() - 类数组转数组
Array.from('123'); // ['1', '2', '3']

5. Array.of() - 创建数组
Array.of(1, 2, 3); // [1, 2, 3]
```

#### 五、实用技巧
```javascript
1. 数组去重
[...new Set([1, 2, 2, 3])]; // [1, 2, 3]

2. 数组浅拷贝
const copy = [...arr]; // 或 arr.slice()

3. 数组转对象
Object.fromEntries([['a', 1], ['b', 2]]); // {a: 1, b: 2}

4. 数组空位处理
[, ,].fill(0); // [0, 0]
```

#### 六、性能注意事项
1. for 循环通常比 forEach/map 等更快
2. 大数据量时避免频繁修改数组
3. reduce 可以替代多个遍历操作

### **对象常用方法**

#### 一、对象属性操作
```javascript
1. Object.keys() - 获取对象所有键
const obj = { a: 1, b: 2 };
Object.keys(obj); // ['a', 'b']

2. Object.values() - 获取对象所有值
Object.values(obj); // [1, 2]

3. Object.entries() - 获取键值对数组
Object.entries(obj); // [['a', 1], ['b', 2]]

4. Object.fromEntries() - 键值对数组转对象
Object.fromEntries([['a', 1], ['b', 2]]); // { a: 1, b: 2 }
```

#### 二、对象属性描述符
```javascript
1. Object.getOwnPropertyDescriptor() - 获取属性描述
Object.getOwnPropertyDescriptor(obj, 'a');
// { value: 1, writable: true, enumerable: true, configurable: true }

2. Object.defineProperty() - 定义属性
Object.defineProperty(obj, 'c', {
  value: 3,
  writable: false, // 不可写
  enumerable: true // 可枚举
});

3. Object.defineProperties() - 定义多个属性
Object.defineProperties(obj, {
  d: { value: 4 },
  e: { value: 5 }
});
```

#### 三、对象原型操作
```javascript
1. Object.create() - 创建原型对象
const parent = { a: 1 };
const child = Object.create(parent);
child.a; // 1 (继承自parent)

2. Object.getPrototypeOf() - 获取原型
Object.getPrototypeOf(child) === parent; // true

3. Object.setPrototypeOf() - 设置原型
Object.setPrototypeOf(child, { b: 2 });
child.b; // 2
```

#### 四、对象冻结与密封
```javascript
1. Object.freeze() - 冻结对象
const frozen = Object.freeze({ a: 1 });
frozen.a = 2; // 静默失败（严格模式报错）

2. Object.seal() - 密封对象
const sealed = Object.seal({ a: 1 });
sealed.a = 2; // 允许修改已有属性
sealed.b = 3; // 不能添加新属性

3. Object.isFrozen() / Object.isSealed() - 检查状态
Object.isFrozen(frozen); // true
Object.isSealed(sealed); // true
```

#### 五、对象复制与合并
```javascript
1. Object.assign() - 浅拷贝合并
const target = { a: 1 };
const source = { b: 2 };
Object.assign(target, source); // { a: 1, b: 2 }

2. 扩展运算符(...) - 浅拷贝
const copy = { ...obj }; // { a: 1, b: 2 }

3. 结构化克隆 - 深拷贝
const deepCopy = JSON.parse(JSON.stringify(obj));
```

#### 六、对象比较与检查
```javascript
1. Object.is() - 严格比较
Object.is(NaN, NaN); // true
Object.is(0, -0); // false

2. Object.hasOwn() - 检查自有属性
Object.hasOwn(obj, 'a'); // true

3. in 操作符 - 检查属性（包括原型链）
'a' in obj; // true
```

#### 七、ES6+ 新增方法
```javascript
1. Object.groupBy() - 按条件分组
const inventory = [
  { name: 'apples', type: 'fruit' },
  { name: 'carrots', type: 'vegetable' }
];
Object.groupBy(inventory, ({ type }) => type);
// { fruit: [...], vegetable: [...] }

2. Object.fromEntries() - Map转对象
const map = new Map([['a', 1], ['b', 2]]);
Object.fromEntries(map); // { a: 1, b: 2 }
```

#### 八、实用技巧
```javascript
1. 动态属性名
const key = 'name';
const obj = { [key]: 'Alice' }; // { name: 'Alice' }

2. 对象解构
const { a, ...rest } = { a: 1, b: 2, c: 3 };
// a=1, rest={b:2, c:3}

3. 属性简写
const name = 'Alice';
const user = { name }; // { name: 'Alice' }
```

#### 九、注意事项
- 大多数对象方法不会遍历原型链上的属性
- 修改原型会影响性能，应谨慎使用
- 深拷贝复杂对象时考虑使用专用库(lodash等)
- 现代 JavaScript 推荐使用 Map/Set 处理特殊场景

### **拷贝**

#### 一、浅拷贝（Shallow Copy）
浅拷贝只复制对象的第一层属性，如果属性是引用类型，则复制的是引用地址。

```javascript
// 1. 数组浅拷贝方法
const arr = [1, 2, { a: 3 }];

// 方法1：扩展运算符
const copy1 = [...arr];

// 方法2：slice()
const copy2 = arr.slice();

// 方法3：Array.from()
const copy3 = Array.from(arr);

// 方法4：concat()
const copy4 = arr.concat();

// 2. 对象浅拷贝方法
const obj = { a: 1, b: { c: 2 } };

// 方法1：扩展运算符
const copy1 = { ...obj };

// 方法2：Object.assign()
const copy2 = Object.assign({}, obj);

// 方法3：Object.create()
const copy3 = Object.create(Object.getPrototypeOf(obj), 
  Object.getOwnPropertyDescriptors(obj));
```

#### 二、深拷贝（Deep Copy）
深拷贝会递归复制所有层级的属性，完全独立于原对象。

```javascript
// 1. JSON 方法（有限制的深拷贝）
const deepCopy = JSON.parse(JSON.stringify(obj));

// 限制：
// - 不能拷贝函数、RegExp、Date等特殊对象
// - 会丢失原型链
// - 不能处理循环引用

// 2. 递归实现深拷贝
function deepClone(source) {
  if (typeof source !== 'object' || source == null) {
    return source;
  }
  const target = Array.isArray(source) ? [] : {};
  for (const key in source) {
    // 只拷贝对象自身属性（不拷贝原型链上的属性）
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone(source[key]);
    }
  }
  return target;
}

// 特点：
// - 处理循环引用
// - 保留对象类型
// - 可以扩展处理特殊对象

// 3. 使用第三方库
// lodash
const _ = require('lodash');
const deepCopy = _.cloneDeep(obj);

// jQuery
const deepCopy = jQuery.extend(true, {}, obj);
```

#### 三、特殊拷贝场景
```javascript
// 1. 只拷贝自身可枚举属性
const shallowCopy = Object.assign({}, obj);

// 2. 拷贝包括不可枚举属性
const copy = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj)
);

// 3. 拷贝 Set/Map
const setCopy = new Set(originalSet);
const mapCopy = new Map(originalMap);
```

#### 四、拷贝方法对比

| **方法**         | **类型** | **是否拷贝原型** | **是否处理循环引用** | **是否拷贝函数** |
| ---------------- | -------- | ---------------- | -------------------- | ---------------- |
| ...              | 浅拷贝   | ❌                | ❌                    | ✔️                |
| Object.assign()  | 浅拷贝   | ❌                | ❌                    | ✔️                |
| JSON             | 深拷贝   | ❌                | ❌                    | ❌                |
| 递归实现         | 深拷贝   | 可选             | ✔️                    | ✔️                |
| lodash.cloneDeep | 深拷贝   | ✔️                | ✔️                    | ✔️                |

#### 五、如何选择拷贝方法
1. 简单数据结构：使用 JSON.parse(JSON.stringify())
2. 需要保留函数：使用递归实现或 lodash.cloneDeep
3. 性能要求高：根据情况选择浅拷贝或特定深拷贝
4. 处理特殊对象：使用专门的库或自定义拷贝逻辑

### **设计模式**

#### 发布-订阅模式 (Pub/Sub)
发布-订阅模式使用一个中介（通常是事件通道）来协调发布者和订阅者，彼此不知道对方的存在。

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 发布事件
  emit(eventName, ...args) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(...args);
      });
    }
  }

  // 取消订阅
  off(eventName, callback) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      this.events[eventName] = callbacks.filter(cb => cb !== callback);
    }
  }

  // 一次性订阅
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

// 使用示例
const eventBus = new EventEmitter();

// 订阅者1
eventBus.on('message', (msg) => {
  console.log(`订阅者1收到消息: ${msg}`);
});

// 订阅者2
const handler = (msg) => {
  console.log(`订阅者2收到消息: ${msg}`);
};
eventBus.on('message', handler);

// 发布者发布消息
eventBus.emit('message', 'Hello World!');
// 输出:
// 订阅者1收到消息: Hello World!
// 订阅者2收到消息: Hello World!

// 取消订阅者2
eventBus.off('message', handler);

// 再次发布
eventBus.emit('message', 'Hello again!');
// 输出:
// 订阅者1收到消息: Hello again!

// 一次性订阅
eventBus.once('one-time', (msg) => {
  console.log(`一次性订阅收到: ${msg}`);
});

eventBus.emit('one-time', '第一次触发'); // 会执行
eventBus.emit('one-time', '第二次触发'); // 不会执行
```

#### 观察者模式 (Observer Pattern)
观察者模式定义了对象间的一对多依赖关系，当一个对象状态改变时，所有依赖它的对象都会得到通知。

```javascript
// 被观察者 (Subject)
class Subject {
  constructor() {
    this.observers = [];
  }

  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // 通知所有观察者
  notify(data) {
    this.observers.forEach(observer => {
      observer.update(data);
    });
  }
}

// 观察者 (Observer)
class Observer {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(`${this.name} 收到更新: ${data}`);
  }
}

// 使用示例
const subject = new Subject();

const observer1 = new Observer('观察者1');
const observer2 = new Observer('观察者2');

// 添加观察者
subject.addObserver(observer1);
subject.addObserver(observer2);

// 通知观察者
subject.notify('第一次通知');
// 输出:
// 观察者1 收到更新: 第一次通知
// 观察者2 收到更新: 第一次通知

// 移除观察者2
subject.removeObserver(observer2);

// 再次通知
subject.notify('第二次通知');
// 输出:
// 观察者1 收到更新: 第二次通知
```

#### 单例模式 (Singleton Pattern)
单例模式确保一个类只有一个实例，并提供全局访问点。

```javascript
class Singleton {
  constructor(data) {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    
    this.data = data;
    Singleton.instance = this;
    
    return this;
  }
}

// 使用示例
const instance1 = new Singleton('First instance');
const instance2 = new Singleton('Second instance');

console.log(instance1 === instance2); // true
console.log(instance1.data); // 'First instance'
console.log(instance2.data); // 'First instance' (不会被修改)
```

#### 工厂模式 (Factory Pattern)
工厂模式定义一个创建对象的接口，但让子类决定实例化哪个类。

```javascript
class Car {
  constructor(options) {
    this.type = options.type || 'car';
    this.color = options.color || 'white';
  }
  
  drive() {
    console.log(`Driving a ${this.color} ${this.type}`);
  }
}

class Truck {
  constructor(options) {
    this.type = options.type || 'truck';
    this.color = options.color || 'blue';
    this.weight = options.weight || 'heavy';
  }
  
  drive() {
    console.log(`Driving a ${this.color} ${this.type} (${this.weight})`);
  }
}

class VehicleFactory {
  createVehicle(options) {
    switch(options.vehicleType) {
      case 'car':
        return new Car(options);
      case 'truck':
        return new Truck(options);
      default:
        throw new Error('Unknown vehicle type');
    }
  }
}

// 使用示例
const factory = new VehicleFactory();

const myCar = factory.createVehicle({
  vehicleType: 'car',
  color: 'red'
});

const myTruck = factory.createVehicle({
  vehicleType: 'truck',
  color: 'yellow',
  weight: 'very heavy'
});

myCar.drive();    // Driving a red car
myTruck.drive();  // Driving a yellow truck (very heavy)
```