### **类型声明:**

​                ● 通过类型声明可以指定TS中变量（参数、形参）的类型；

​                ● 指定类型后，当为变量赋值时，TS编译器会自动检查值是否符合类型声明，符合则赋值，否则报错；

​                ● 简而言之，类型声明给变量设置了类型，使得变量只能存储某种类型的值；

### **自动类型判断:**

​                ● TS拥有自动的类型判断机制

​                ● 当对变量的声明和赋值是同时进行的，TS编译器会自动判断变量的类型

​                ● 所以如果你的变量的声明和赋值时同时进行的，可以省略掉类型声明 let a = 1,此时a默认为number类型

### **数据类型：**

​                ● number：任意数字

​                ● string：任意字符串

​                ● boolean：布尔值true或false

​                ● 字面量： 限制变量的值就是该字面量的值

​                ● any：任意类型

​                ● unknown：类型安全的any

​                ● void：没有值（或undefined）

​                ● never：不能是任何值

​                ● object：任意的JS对象

​                ● array：任意JS数组

​                ● tuple：元组，TS新增类型，固定长度数组

​                ● enum：枚举，TS中新增类型

**示例代码：**



```
// number
let a: number;
a = 1;
 
// string
let b: string;
b = "yzh";
 
// boolean
let c: boolean;
c = true;
c = false;
 
// 字面量
let d: 10;
d = 10;
let d1: "title" | "subtitle";
d1 = "title";
d1 = "subtitle";
let d2: boolean | string;
d2 = true;
d2 = "yzh";
 
// any
let e: any; // 显式的any
e = 1;
e = false;
e = "yzh";
let e1; // 隐式的any，声明变量如果不指定类型，则ts解析器会自动判断变量的类型为any（隐式的any）
e1 = 1;
e1 = true;
 
// unknown 表示未知类型的值
let f: unknown;
f = 10;
f = false;
f = "yzh";
let f1: string;
f1 = e; // e的类型是any,它可以赋值给任意变量
// f1 = f; // 不能将类型“unknown”分配给其 它类型“string”
// unknown 实际上就是一个类型安全的any
// unknown 类型的变量,不能直接赋值给其他变量
if (typeof f === "string") {
  f1 = f;
}
 
// 类型断言 可以用来告诉解析器 变量的类型
f1 = f as string; // 写法1 变量as 类型
f1 = <string>f; // 写法2 <类型>变量
 
// void 用来表示空,以函数为例,就表示没有返回值的函数
function fn(): void {
  return;
  // return undefined;
}
 
// never 表示永远不会返回结果
function fn1(): never {
  throw new Error("error");
}
 
// object表示一个js对象
let g: object;
g = {};
g = function () {};
let g1: {
  name: string;
  age?: number; // 在属性名后边加上? 表示属性是可选的
  [keyName: string]: any; // 表示任意类型的属性
};
g1 = {
  name: "yzh",
  age: 1,
  sex: "男",
  tel: 123,
};
let g3: (a: number, b: number) => number; // 设置函数结构的类型声明 语法(形参: 类型, ...) => 返回值
g3 = function (a: number, b: number): number {
  return a + b;
};
g3(1, 2);
 
// array 数组的类型声明 写法: 类型[]  者 Array<类型>
let h: string[];
h = ["a", "b", "c"];
let h1: number[];
h1 = [1, 2, 3];
let h3: Array<number>;
h3 = [1, 2, 3];
 
// tuple元组: 元组就是固定长度的数组 语法: [类型, 类型]
let h4: [string, string, number];
h4 = ["a", "b", 1];
 
// enum 枚举
enum Sex {
  Male = 0,
  Female = 1,
}
let i: {
  name: string;
  sex: string;
};
i = {
  name: "yzh",
  sex: "男",
};
let i1: {
  name: string;
  sex: Sex;
};
i1 = {
  name: "yzh",
  sex: Sex.Male,
};
console.log(i1.sex === Sex.Male);
```





### **关键词：**

#### **as(类型断言)**

**作用：**类型断言允许你手动指定一个值的类型，让编译器信任你对该值的类型判断。常用于将一个类型的值“断言”为另一个类型，实际上并不改变类型，只是对编译器的一个提示。

**用法：**变量值 as 类型 ， <类型>变量值



```
1. 尖括号语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
 
2. as 语法（更常用）
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
 
 
将 any 断言为一个具体的类型
const foo: any = 123;
const bar = foo as number;
 
 
类型断言 vs 类型声明
类型声明更安全，因为它会进行额外的属性检查，而类型断言不会。
interface Animal {
  name: string;
}
// 类型声明
const animal: Animal = {
  name: 'cat'
};
// 类型断言
const animal2 = {
  name: 'cat'
} as Animal;
```





**类型断言的注意事项**

​                ● 不是类型转换：类型断言只影响 TypeScript 编译时的类型检查，不会真正改变变量的类型

​                ● 要谨慎使用：错误的类型断言可能导致运行时错误

​                ● 双重断言：当直接断言不成立时，可以先用 any 或 unknown 中转

 

#### **identity(泛型)**

**作用：**在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

**用法：**传递一个类型参数，并在函数内部使用该类型。



```
function identity<T>(arg: T): T {
    return arg;
}
let output = identity<string>("myString");
 
 
这里的 <T> 就是类型变量，它捕获用户传入的类型，使得我们可以跟踪函数里使用的类型信息。
 
 
1. 泛型函数
function logAndReturn<T>(arg: T): T {
    console.log(arg);
    return arg;
}
// 使用
let output = logAndReturn<string>("myString");  // 显式指定类型
let output2 = logAndReturn("myString");         // 类型推断
 
 
2. 泛型接口
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
 
 
3. 泛型类
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = (x, y) => x + y;
 
 
泛型约束
有时候我们需要限制泛型的类型范围：
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
// 现在这个泛型函数被约束为必须包含length属性
loggingIdentity(3);  // 错误，数字没有length属性
loggingIdentity({length: 10, value: 3}); // 正确
```





####  **type (类型别名)**

**作用：**给一个类型起一个新名字的方式，它可以作用于原始类型、联合类型、元组类型以及其他任何你需要手写的类型。

条件类型:

**用法：**



```
1. 为基本类型创建别名
type UserName = string;
type ID = number | string;
type BooleanLike = boolean | 0 | 1;
const name: UserName = "Alice";
const userId: ID = 123;  // 也可以是 "123"
const isActive: BooleanLike = 1;
 
 
2. 为对象类型创建别名
type User = {
  id: number;
  name: string;
  email?: string;  // 可选属性
};
const user: User = {
  id: 1,
  name: "Bob"
};
 
 
3. 为函数类型创建别名
type GreetFunction = (name: string) => string;
const greet: GreetFunction = (name) => `Hello, ${name}!`;
 
 
4. 为联合类型创建别名
type Status = 'active' | 'inactive' | 'pending';
const currentStatus: Status = 'active';
 
 
5. 为元组类型创建别名
type Point = [number, number];
const point: Point = [10, 20];
```





 

#### **interface(接口)**

**作用：**用来定义类型契约，即规定对象应该具有的结构。

**用法：**



```
1. 定义对象形状（核心作用）
interface User {
  id: number;
  name: string;
  email?: string;  // 可选属性
  readonly registerTime: Date;  // 只读属性
}
const user: User = {
  id: 1,
  name: "张三",
  registerTime: new Date()
};
// user.registerTime = new Date(); // 报错，因为是只读属性
 
 
2. 定义函数类型
interface SearchFunc {
  (source: string, keyword: string): boolean;
}
const mySearch: SearchFunc = (src, kw) => src.includes(kw);
 
 
3. 定义可索引类型
interface StringArray {
  [index: number]: string;  // 索引签名
}
const arr: StringArray = ["Apple", "Banana"];
 
 
4. 类实现接口（面向对象编程）
interface Alarm {
  alert(): void;
}
class Door implements Alarm {
  alert() {
    console.log("Door alarm");
  }
}
 
 
5. 接口继承（扩展性强）
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}
const bear: Bear = {
  name: "Winnie",
  honey: true
};
 
 
6. 声明合并（独特优势）
interface Box {
  height: number;
}
interface Box {
  width: number;
}
// 自动合并为 { height: number; width: number }
const box: Box = { height: 100, width: 200 };
```





 

#### **类型别名 vs 接口**

类型别名（type）和接口（interface）都可以用来定义对象类型，

非常相似，但有一些关键区别：

| **特性**           | **类型别名 (type)** | **接口 (interface)**   |
| ------------------ | ------------------- | ---------------------- |
| 语法               | type Name = ...     | interface Name { ... } |
| 扩展方式           | 使用 &（交叉类型）  | 使用 extends 继承      |
| 合并声明           | 不支持              | 同名接口会自动合并     |
| 描述类型           | 可以描述任何类型    | 主要描述对象形状       |
| 实现类             | 不能                | 可以（implements）     |
| 映射类型等高级特性 | 支持                | 不支持                 |

 

​                ● 对于简单的对象类型，优先考虑使用 interface

​                ● 当需要联合类型、元组或其他复杂类型时，使用 type

​                ● 需要扩展或实现时，优先选择 interface

​                ● 需要高级类型特性（如映射类型、条件类型）时，使用 type

 

 

#### **implements(实现)**

**作用：**用于类实现接口的关键字，它确保类符合特定的接口契约。

**用法：**



```
class ClassName implements InterfaceName {
  // 必须实现接口的所有成员
}
 
 
1. 实现单个接口
interface Animal {
  name: string;
  makeSound(): void;
}
class Dog implements Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  makeSound() {
    console.log("Woof! Woof!");
  }
}
const myDog = new Dog("Buddy");
myDog.makeSound(); // 输出: Woof! Woof!
 
 
2. 实现多个接口
interface Animal {
  name: string;
}
interface CanMakeSound {
  makeSound(): void;
}
class Cat implements Animal, CanMakeSound {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  makeSound() {
    console.log("Meow!");
  }
}
 
 
高级用法
1. 实现泛型接口
interface Repository<T> {
  get(id: number): T;
  save(item: T): void;
}
class UserRepository implements Repository<User> {
  get(id: number): User {
    // 实现获取逻辑
  }
  save(user: User): void {
    // 实现保存逻辑
  }
}
 
 
2. 部分实现与抽象类结合
abstract class AnimalBase {
  abstract name: string;
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m`);
  }
}
interface CanSwim {
  swim(): void;
}
class Fish extends AnimalBase implements CanSwim {
  name: string;
  constructor(name: string) {
    super();
    this.name = name;
  }
  swim() {
    console.log(`${this.name} is swimming`);
  }
}
```





 

#### **class(类)**

**作用：**TypeScript 的类系统是基于 ES6 类语法并添加了类型注解和其他面向对象特性。

**用法：**

\1. 基本类结构



```
class Person {
  // 属性声明（可带类型注解）
  name: string;
  age: number;
  // 构造函数
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  // 方法
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}
const person = new Person("Alice", 30);
person.greet(); // 输出: Hello, my name is Alice
```





\2. 访问修饰符

TypeScript 扩展了类的访问控制：

| **修饰符** | **类内访问** | **子类访问** | **实例访问** |
| ---------- | ------------ | ------------ | ------------ |
| public     | ✅            | ✅            | ✅            |
| protected  | ✅            | ✅            | ❌            |
| private    | ✅            | ❌            | ❌            |
| readonly   | ✅            | ✅            | ✅            |



```
class Animal {
  public name: string;
  protected age: number;
  private secret: string;
  readonly id: number;
 
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
    this.secret = "my secret";
    this.id = Math.random();
  }
}
```





\3. 继承与 super



```
class Employee extends Person {
  department: string;
 
  constructor(name: string, age: number, department: string) {
    super(name, age); // 必须首先调用 super()
    this.department = department;
  }
 
  // 方法重写
  greet() {
    super.greet(); // 调用父类方法
    console.log(`I work in ${this.department}`);
  }
}
```





 

#### **abstract(抽象类)**

**作用：**抽象类是 TypeScript 面向对象编程中的重要概念，它介于普通类和接口之间，提供了一种定义部分实现并要求子类完成剩余部分的方式。

**用法：**

\1. 定义抽象类

使用 abstract 关键字定义抽象类：



```
abstract class Animal {
  abstract makeSound(): void;  // 抽象方法
  
  move(): void {              // 普通方法
    console.log("Moving...");
  }
}
```





\2. 抽象类特点

​                ● 不能被实例化：只能被继承

​                ● 可以包含抽象方法：只有声明没有实现

​                ● 可以包含具体实现：普通方法和属性

​                ● 可以包含构造函数

**抽象方法**



```
1. 定义抽象方法
abstract class Department {
  constructor(public name: string) {}
 
  abstract printMeeting(): void;  // 必须在派生类中实现
  
  printName(): void {
    console.log("Department name: " + this.name);
  }
}
 
 
2. 实现抽象方法
class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing");
  }
 
  printMeeting(): void {  // 必须实现抽象方法
    console.log("The Accounting Department meets each Monday at 10am.");
  }
}
 
const dept = new AccountingDepartment();
dept.printMeeting();
dept.printName();
```





**抽象属性**

TypeScript 也支持抽象属性：



```
abstract class Person {
  abstract name: string;  // 抽象属性
  
  displayName(): void {
    console.log(`Name is: ${this.name}`);
  }
}
 
class Employee extends Person {
  name: string;  // 必须实现抽象属性
  
  constructor(name: string) {
    super();
    this.name = name;
  }
}
```





**抽象类 vs 接口**

 

| **特性**       | **抽象类**                    | **接口**                    |
| -------------- | ----------------------------- | --------------------------- |
| **实现**       | 可以包含具体实现              | 只有声明，没有实现          |
| **多继承**     | 不支持（只能继承一个抽象类）  | 支持（可继承多个接口）      |
| **构造函数**   | 可以有构造函数                | 不能有构造函数              |
| **访问修饰符** | 支持 public/protected/private | 所有成员默认且只能是 public |
| **实例化**     | 不能实例化                    | 不能实例化                  |

**注意事项**

​                ● 必须实现所有抽象成员：派生类必须实现基类中的所有抽象方法和属性

​                ● 访问限制：抽象成员不能是 private 的

​                ● 构造函数：抽象类可以有构造函数，但不能直接实例化

​                ● 设计考量：当需要部分实现和共享代码时使用抽象类，当只需要契约定义时使用接口

 

 

#### **decorators (装饰器)**

**作用：**在类声明、方法、访问器、属性或参数上添加注解和元编程语法的方式。

**用法：**



```
在 tsconfig.json 中启用：
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
 
 
1. 类装饰器
应用于类构造函数，用于观察、修改或替换类定义。
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
 
@sealed
class Greeter {
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
  
  greet() {
    return "Hello, " + this.greeting;
  }
}
 
 
2. 方法装饰器
应用于方法描述符，可以用于观察、修改或替换方法定义。
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`Called ${propertyKey}, returned: ${JSON.stringify(result)}`);
    return result;
  };
  
  return descriptor;
}
 
class Calculator {
  @log
  add(x: number, y: number): number {
    return x + y;
  }
}
 
 
 
3. 访问器装饰器
应用于访问器（getter/setter）。
function configurable(value: boolean) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
 
class Point {
  private _x: number;
  private _y: number;
  
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  
  @configurable(false)
  get x() { return this._x; }
  
  @configurable(false)
  get y() { return this._y; }
}
 
 
4. 属性装饰器
应用于类的属性。
function format(formatString: string) {
  return function(target: any, propertyKey: string) {
    let value = target[propertyKey];
    
    const getter = () => {
      return `${formatString} ${value}`;
    };
    
    const setter = (newVal: string) => {
      value = newVal;
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}
 
class Greeter {
  @format("Hello,")
  greeting: string;
  
  constructor(message: string) {
    this.greeting = message;
  }
}
 
```





####  

#### **namespace (命名空间)**

**作用：**提供了一种逻辑分组代码的方式，避免全局作用域污染。

**用法：**



```
1. 定义命名空间
namespace MyNamespace {
  export interface Person {
    name: string;
    age: number;
  }
 
  export class Employee implements Person {
    constructor(public name: string, public age: number) {}
  }
 
  export function greet(person: Person) {
    console.log(`Hello, ${person.name}`);
  }
}
 
 
2. 使用命名空间内容
const employee = new MyNamespace.Employee("Alice", 30);
MyNamespace.greet(employee);
```





**命名空间特性**



```
1. 多文件命名空间
utils.ts
namespace Utilities {
  export function log(message: string) {
    console.log(message);
  }
}
 
app.ts
/// <reference path="utils.ts" />
namespace Utilities {
  export function error(message: string) {
    console.error(message);
  }
}
Utilities.log("Info message");
Utilities.error("Error message");
 
 
 
2. 嵌套命名空间
namespace Outer {
  export namespace Inner {
    export const message = "Hello from inner namespace";
  }
}
console.log(Outer.Inner.message);
 
 
3. 别名
import Employee = MyNamespace.Employee;
const emp = new Employee("Bob", 25);
```





**命名空间 vs 模块**

| **特性**     | **命名空间 (Namespace)**       | **模块 (Module)**        |
| ------------ | ------------------------------ | ------------------------ |
| **组织方式** | 逻辑分组                       | 文件为单位               |
| **作用域**   | 全局/局部                      | 模块作用域               |
| **依赖管理** | 需要手动引用 (/// <reference>) | 自动处理 (import/export) |
| **现代使用** | 逐渐被模块替代                 | 推荐使用                 |
| **编译输出** | 合并为全局变量                 | 保持模块化结构           |

**现代 TypeScript 中的使用建议**

​                ● 优先使用 ES6 模块（import/export）

​                ● 命名空间的适用场景：

​            \1.     在全局环境中定义类型（.d.ts 声明文件）

​            \2.     与旧代码库集成

​            \3.     某些第三方库的类型定义

##  

 

#### **Pick（选择）**

**作用：**是 TypeScript 内置的实用类型(Utility Type)之一，它允许你从一个类型中选择部分属性来创建一个新类型。

**用法：**



```
基本语法
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
T：源类型
K：要选择的属性名的联合类型（必须是 T 的键）
 
 
基础用法
1. 选择单个属性
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}
 
type UserName = Pick<User, 'name'>;
/* 等价于：
type UserName = {
  name: string;
}
*/
 
 
2. 选择多个属性
type UserBasicInfo = Pick<User, 'id' | 'name'>;
/* 等价于：
type UserBasicInfo = {
  id: number;
  name: string;
}
*/
```





 

#### **Omit（排除）**

**作用：**是 TypeScript 内置的实用类型(Utility Type)之一，它允许你从一个类型中排除某些属性来创建一个新类型。

**用法：**



```
基本语法
type Omit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P];
};
T：源类型
K：要排除的属性名的联合类型
 
 
基础用法
1. 排除单个属性
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  password: string;
}
 
type SafeUser = Omit<User, 'password'>;
/* 等价于：
type SafeUser = {
  id: number;
  name: string;
  age: number;
  email: string;
}
*/
 
2. 排除多个属性
type UserPreview = Omit<User, 'password' | 'email'>;
/* 等价于：
type UserPreview = {
  id: number;
  name: string;
  age: number;
}
*/
```





 

#### **declare**

**作用：**是 TypeScript 中用来声明类型信息而不包含具体实现的关键字，主要用于描述已存在的 JavaScript 代码的类型。

**用法：**



```
基本用途
1. 声明变量
declare const jQuery: (selector: string) => any;
2. 声明函数
declare function greet(name: string): void;
3. 声明类
declare class Animal {
  constructor(name: string);
  makeSound(): void;
}
4. 声明命名空间/模块
declare namespace MyLib {
  function doSomething(): void;
  const version: string;
}
 
 
主要应用场景
1. 类型声明文件（.d.ts）
为 JavaScript 库编写类型定义：
// jquery.d.ts
declare namespace JQuery {
  interface AjaxSettings {
    url: string;
    method?: 'GET' | 'POST';
  }
  
  function ajax(settings: AjaxSettings): void;
}
 
declare const $: JQuery;
2. 声明全局变量
// global.d.ts
declare const __VERSION__: string;
declare const __DEV__: boolean;
3. 扩展已有声明
// 扩展Window接口
declare global {
  interface Window {
    myCustomProp: string;
  }
}
 
```





与常规声明的区别

| **特性**     | declare **声明**           | **常规声明**               |
| ------------ | -------------------------- | -------------------------- |
| **生成代码** | 不生成任何 JavaScript 代码 | 会生成对应 JavaScript 代码 |
| **用途**     | 仅类型声明                 | 实际实现                   |
| **位置**     | 通常在 .d.ts 文件中        | 在 .ts 文件中              |
| **运行时**   | 无影响                     | 会影响运行时行为           |

​                ● 为第三方库编写声明文件：当使用纯 JavaScript 库时

​                ● 避免实现细节：只包含类型信息，不包含具体实现

​                ● 使用模块声明：为非模块化代码提供类型支持

​                ● 合理组织声明文件：按照 @types 规范组织

 

 

 

#### **Required（必须）**

**作用：**是 TypeScript 内置的实用类型(Utility Type)之一，它可以将类型 T 中的所有可选属性转换为必需属性。

**用法：**



```
基本语法
type Required<T> = {
  [P in keyof T]-?: T[P];
};
T：源类型
-?：移除可选修饰符（?）
 
 
基础用法
1. 转换简单接口
interface User {
  id?: number;
  name?: string;
  age?: number;
}
 
type RequiredUser = Required<User>;
/* 等价于：
type RequiredUser = {
  id: number;
  name: string;
  age: number;
}
*/
 
2. 与部分类型结合使用
type PartialUser = Partial<User>; // 所有属性变为可选
type FullUser = Required<PartialUser>; // 再全部变为必需
```





#### **Partial（**可选**）**

**作用：**是 TypeScript 内置的实用类型(Utility Type)之一，它可以将类型 T 中的所有属性转换为可选属性。

**用法：**



```
基本语法
type Partial<T> = {
  [P in keyof T]?: T[P];
};
T：源类型
?：添加可选修饰符
 
 
基础用法
1. 转换简单接口
interface User {
  id: number;
  name: string;
  age: number;
}
 
type PartialUser = Partial<User>;
/* 等价于：
type PartialUser = {
  id?: number;
  name?: string;
  age?: number;
}
*/
 
2. 创建可选的更新对象
function updateUser(id: number, userUpdate: Partial<User>) {
  // 只需要传入需要更新的字段
}
 
updateUser(1, { name: "Alice" });
updateUser(2, { age: 31 });
```





 

#### **Record**

**作用：** 是 TypeScript 内置的实用类型(Utility Type)之一，它用于构造一个对象类型，其属性键为类型 K，属性值为类型 T。

**用法：**



```
基本语法
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
K：对象的键类型（必须是 string | number | symbol 的子类型）
T：对象的值类型
 
 
基础用法
1. 创建简单映射类型
type StringToNumber = Record<string, number>;
 
const scores: StringToNumber = {
  math: 90,
  english: 85,
  science: 95
};
 
 
2. 使用联合类型作为键
type Weekday = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type Schedule = Record<Weekday, string>;
 
const workSchedule: Schedule = {
  Mon: '9:00-18:00',
  Tue: '9:00-18:00',
  Wed: '9:00-18:00',
  Thu: '9:00-18:00',
  Fri: '9:00-17:00'
};
```