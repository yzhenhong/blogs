## 安装typescript
// 全局安装typescript
npm install -g typescript
// node不能直接运行ts,需要先将ts转成js，然后再运行。但是用下面的东西就可以直接在node上运行ts了。
npm install -g ts-node
npm install -g @types/node



## 配置tsconfig.json
```javascript
{
  "compilerOptions": {
    // 指定 ECMAScript 版本
    "target": "esnext",
    // 指定模块代码生成
    "module": "esnext",
    // 启用所有严格类型检查选项
    "strict": true,
    // 在.tsx文件中支持JSX: react或preserve
    "jsx": "preserve",
    // 使用 Node.js 风格解析模块
    "moduleResolution": "node",
    // 允许编译 JavaScript 文件
    "allowJs": true,
    // 跳过所有声明文件的类型检查
    "skipLibCheck": true,
    // 禁用命名空间引用 (import * as fs from "fs") 启用 CJS/AMD/UMD 风格引用 (import fs from "fs")
    "esModuleInterop": true,
    // 允许从没有默认导出的模块进行默认导入
    "allowSyntheticDefaultImports": true,
    // 不允许对同一个文件使用不一致格式的引用
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    // 生成相应的.map文件
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env",
      "jest",
      "unplugin-vue-define-options"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  // include 用来指定哪些ts文件需要被编译
  // 路径: ** 表示任意目录 *表示任意文件
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  // exclude 不需要被编译的文件目录
  // 默认值: ["node_modules", "bower_components", "jspm_packages", "dist"]
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```



## 数据类型
类型声明:
- 通过类型声明可以指定TS中变量（参数、形参）的类型；
- 指定类型后，当为变量赋值时，TS编译器会自动检查值是否符合类型声明，符合则赋值，否则报错；
- 简而言之，类型声明给变量设置了类型，使得变量只能存储某种类型的值；

自动类型判断:
- TS拥有自动的类型判断机制
- 当对变量的声明和赋值是同时进行的，TS编译器会自动判断变量的类型
- 所以如果你的变量的声明和赋值时同时进行的，可以省略掉类型声明 let a = 1,此时a默认为number类型

类型：
- number：任意数字
- string：任意字符串
- boolean：布尔值true或false
- 字面量： 限制变量的值就是该字面量的值
- any：任意类型
- unknown：类型安全的any
- void：没有值（或undefined）
- never：不能是任何值
- object：任意的JS对象
- array：任意JS数组
- tuple：元组，TS新增类型，固定长度数组
- enum：枚举，TS中新增类型


### number：任意数字
```typescript
let a: number;
a = 1;
```

### string：任意字符串
```typescript
let b: string;
b = 'yzh';
```

### boolean：布尔值true或false
```typescript
let c: boolean;
c = true;
c = false;
```

### 字面量： 限制变量的值就是该字面量的值
```typescript
let d: 10;
d = 10;
let d1: 'title' | 'subtitle';
d1 = 'title';
d1 = 'subtitle';
let d2: boolean | string;
d2 = true;
d2 = 'yzh';
```

### any：任意类型
```typescript
let e: any; // 显示的any
e = 1;
e = false;
e = 'yzh';
let e1; // 隐式的any
e1 = 1;
e1 = true;
```

### unknown：类型安全的any   表示未知类型的值
```typescript
let f: unknown;
f = 10;
f = false;
// f = 'yzh';
let f1: string;
// f1 = e;  // e的类型是any 它可以赋值给任意变量
// f1 = f; // 不能将类型'unknown' 分配给其他类型
// if( typeof f === 'string') {
//   f1 = f;
// }
// 类型断言 可以用来告诉ts解析器 变量的类型
f1 = f as string; // 变量 as 类型
f1 = <string>f; //<类型>变量
```

### void：没有值（或undefined）
```typescript
function fnf (): void {
  return;
  // return undefined
  // return 1; // 报错
}
```

### never：不能是任何值
```typescript
function fnf2 (): never {
 throw new Error("error");
}
```

### object：任意的JS对象
```typescript
let g: object;
g = {};
g = function () {};
let g1: {
  name: string,
  age?: number,
  [keyName: string]: any
}
g1 = {
  name: 'yzh',
  age: 24,
  tel: 'xx',
  sex: 'xx'
}
let g2: (a:number, b: number) => number; // 设置函数结构的类型声明 语法(形参: 类型, ...) => 返回值
g2 = function (a: number, b: number): number {
  return a+b;
}
g2 (1 ,2);
```

### array：任意JS数组
```typescript
let h: string[]
h = ['a', 'b']
let h1: number[]
h1 = [ 1, 2 ]
let h3: Array<number>
h3 = [ 1, 2 ]
```

### tuple：元组，TS新增类型，固定长度数组
```typescript
let h4: [ string, number ]
h4 = ['a' , 1]
```

### enum：枚举，TS中新增类型
```typescript
let i: {
  name: string,
  age: number,
  sex: string
}
i = {
  name: 'yzh',
  age: 24,
  sex: '男'
}
enum Sex {
  Male = 0,
  Female =1
}
let i1: {
  name: string,
  sex: Sex
}
i1 = {
  name: 'yzh',
  sex: Sex.Male
}
```



## 关键词
### as (类型断言)
```javascript
/*
写法：
  变量 as 类型
  <类型>变量
*/
let an: any;
an = 1;
an = "yzh";

let un: unknown;
un = 10;
un = false;
un = "yzh";

let str: string;
str = an; // an的类型是any,它可以赋值给任意变量
// str = un; // 报错 不能将类型“unknown”分配给其 它类型“string”

// 类型断言 可以用来告诉解析器 变量的类型
str = un as string; // 写法1 变量as 类型
// str = <string>un; // 写法2 <类型>变量

// | &,| 表示或者 & 表示同时
let j: string | number;
j = "a";
j = 1;

let j1: { name: string } & { age: number };
j1 = {
  name: "yzh",
  age: 24,
};
```

### type (类型别名)
```javascript
type myTypeString = string;
const myTypeStringVal: myTypeString = "1212";

let k: 1 | 2 | 3 | 4 | 5;
k = 1;
k = 2;

let k1: 1 | 2 | 3 | 4 | 5 | "a";
k1 = 1;
k1 = "a";

type myTypeK = 1 | 2 | 3 | 4 | 5 | "a";
let k2: myTypeK;
let k3: myTypeK;
k2 = 1;
k2 = "a";
k3 = 1;
k3 = "a";

// type描述一个对象的类型：
type myType = {
  name: string;
};
type myType2 = {
  mail: string;
};
type myType3 = myType & myType2;
let obj: myType3 & { tel: number } = {
  // 联合类型
  name: "yzh",
  mail: "7366",
  tel: 123,
};

// type描述一个函数的类型：
type fnType = (x: number, y: number) => number; // 函数
let fnType1: fnType = (a, b) => a + b;
console.log(fnType1(1, 3));

// type映射
// https://blog.csdn.net/dongnihao/article/details/124411997
// 使用TS映射类型的场景：
// 在需要修改用户信息时，往往不需要同时修改所有的用户数据，一般的做法是定义新的类型，把对象所有的键设为可选，这种处理方式会产生很多重复代码。那么可以使用后映射类型 （Mapped types），将原有的对象类型映射成新的对象类型。
type myType4 = myType3 & { tel: number };
type myType5<keys> = {
  [key in keyof keys]: keys[key]; // //类似 for ... in
  // [key in keyof keys]? : keys[key] // //类似 for ... in
};
let obj2: myType5<myType4> = {
  name: "yzh",
  mail: "7366",
  tel: 123,
};

type Getters<keys> = {
  [key in keyof keys as `get${Capitalize<string & key>}`]: () => keys[key];
};
/*
Getters {
  getName: ()=> string;
  getMail: ()=> string;
  getTel: ()=> number;
}
*/
let obj3: Getters<myType & myType2 & { tel: number }> = {
  getName: () => {
    return "yzh";
  },
  getMail: () => {
    return "7366";
  },
  getTel: () => {
    return 123;
  },
};
```

### identity(泛型)
```javascript
// 在定义函数或是类时，如果遇到类型不明确就可以使用泛型
function functionF<T>(a: T): T {
  return a;
}
// 可以直接调用具有泛型的函数
let result = functionF(10); // 不指定泛型，ts可以自动进行类型推断
let result2 = functionF<string>("hello"); // 指定泛型

function functionF2<T, K>(a: T, b: K): T {
  return a;
}
functionF2(10, "yzh");
functionF2<number, string>(10, "yzh");

interface Inter {
  length: number;
}
// T extends Inter 表示泛型T必须是Inter实现类(子类)
function functionF3<T extends Inter>(a: T): number {
  return a.length;
}
functionF3("yzh");
functionF3({
  length: 1,
});

class MyClass<T> {
  name: T;
  constructor(name: T) {
    this.name = name;
  }
}
const class1 = new MyClass<string>("yzh");
```

### class(类)
```javascript
class Person {
  /*
   public 修饰的属性可以在任意位置访问（修改）默认值
   private 私有属性，私有属性只能在类内部进行访问（修改）
          通过在类中添加方法使得私有属性可以被外部访问
   protected 受保护的属性，只能在当前类和当前类的子类中访问（修改）
   static 定在在类上，类能够调用，类的实例不能调用
  */
  public name: string;
  private age: number;
  protected tel: number;
  static mail: string;
  constructor(name: string, age: number, tel: number) {
    this.name = name;
    this.age = age;
    this.tel = tel;
  }
  static staticFun() {
    console.log("staticFun:", this.mail);
  }
  getAge() {
    return this.age;
  }
  setAge(value: number) {
    this.age = value;
  }
  // 存取器getters和setters的使用 ECMAScript 5+设置getter方法的方式
  // get age () {
  //     return this.age
  // }
  // set age (value: nubmer) {
  //     this.age = value
  // }
}
Person.mail = "qq.com";
console.log(Person);
console.log(Person.mail);
console.log(Person.staticFun());

const per = new Person("yzh", 24, 123);
per.name = "yzh1";
per.setAge(19);
// per.age = 1
// per.tel = 123;
class Person2 extends Person {
  tel: number;
  constructor(name: string, age: number, tel: number) {
    super(name, age, tel);
    this.tel = tel;
  }
}
const per2 = new Person2("yzh", 24, 123);
per2.tel = 1234;
per2.tel = 12345;

class Class1 {
  name: string;
  age: number;
  // 可以直接将属性定义在构造函数中
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
const classObj1 = new Class1("yzh", 24);
class Class2 {
  // 可以直接将属性定义在构造函数中
  constructor(public name: string, public age: number) {}
}
const classObj2 = new Class2("yzh", 24);
```

### interface(接口),implements(实现),class(类)
- 1、接口可以在定义类的时候去限制类的结构
- 2、接口中所有的属性都不能有实际的值
- 3、接口只定义对象的结构，而不考虑实际值
- 4、在接口中所有方法都是抽象方法
```javascript
// 1、接口可以在定义类的时候去限制类的结构
// 2、接口中所有的属性都不能有实际的值
// 3、接口只定义对象的结构，而不考虑实际值
// 4、在接口中所有方法都是抽象方法
interface myInter {
  name: string;
  sayHello(): void;
}
interface myInter extends myType2 {
  age: number;
}
/*
 * 定义类时，可以使类去实现一个接口
 * 实现接口就是使类满足接口的需求
 */
class myClass implements myInter {
  name: string;
  age: number;
  mail: string;
  constructor(name: string, age: number, mail: string) {
    this.name = name;
    this.age = age;
    this.mail = mail;
  }
  sayHello() {
    console.log("hello");
  }
}

// interface extends type
// interface extends interface
// type extends interface
// type extends type

// type专属 联合类型
interface DogInter {
  wang();
}
interface CatInter {
  miao();
}
type Pet = DogInter | CatInter;
let obj4: Pet = {
  wang() {},
};
type PetList = [DogInter, CatInter];

// abstract(抽象),class(类)
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  sauHello() {
    console.log("Hello");
  }
}
class Dog extends Animal {
  age: number;
  constructor(name: string, age: number) {
    super(name);
    this.age = age;
  }
  sayHello() {
    console.log("Dog-Hello");
  }
}

// 抽象类：
// 1、以abstract开头的类是抽象类
// 2、抽象类和其他类区别不大，只是不能用来创建对象
// 3、抽象类中可以添加抽象方法
abstract class ABAnimal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  // 定义一个抽象方法
  // 抽象方法使用abstract开头，没有方法体
  // 抽象方法只能定义在抽象类中，子类必须对抽象方法重写
  abstract sayHello(): void;
}
class Dog1 extends ABAnimal {
  sayHello() {
    console.log("Hello");
  }
}

```

### Record<key, value>
```javascript
const networkMessage: Record<number, string> = {
  401: "身份认证失败",
  403: "没有权限访问该接口",
  404: "接口不存在",
  500: "服务器内部错误",
  502: "网关错误",
};
type petsGroup = "dog" | "cat" | "fish";
interface IPetInfo {
  name: string;
  age: number;
}
type IPets = Record<petsGroup, IPetInfo>;
const animalsInfo: IPets = {
  dog: {
    name: "dogName",
    age: 1,
  },
  cat: {
    name: "catName",
    age: 2,
  },
  fish: {
    name: "fishName",
    age: 3,
  },
};
```

### Required<T>
```javascript
interface IPerson {
  name?: string;
  age?: number;
}
type IPersonRequired = Required<IPerson>; // 转成非空属性
/*
interface IPersonRequired {
  name: string;
  age: number;
} 
*/
const person: IPersonRequired = {
  name: "yzh",
  age: 24,
};
```

### Partial
```javascript
interface IPerson2 {
  name: string;
  age: number;
}
type IPersonPartial = Partial<IPerson2>; // 转成可空属性
/*
interface IPersonPartial {
  name?: string;
  age?: number;
} 
*/
const PersonB: IPersonPartial = {};
/*
内部实现
type Partial<T> = {
  [P in keyof T]?: T[P];
};
*/
```

### Pick
```javascript
interface Person3 {
  name: string;
  age: number;
  tel: number;
  like: string[];
}
interface ISinglePerson {
  name: string;
  age: number;
}
// 取出某些属性，提高interface复用率
interface ISinglePerson extends Pick<Person3, "tel" | "like"> {
  mail: string;
}
const PersonC: ISinglePerson = {
  name: "yzh",
  age: 24,
  tel: 123,
  like: ["爱好1", "爱好2"],
  mail: "7366",
};
```

### Omit
```javascript
// Omit 与 Pick 作用相似，只不过 Omit 是：以一个类型为基础支持剔除某些属性，然后返回一个新类型。
interface Person4 {
  name: string;
  age: number;
  tel: number;
  like: string[];
}
type OmitPerson = Omit<Person4, "age" | "like">;
const PersonE: OmitPerson = {
  name: "yzh",
  tel: 123,
};
```

### declare
```javascript
/*
declare
// 假如我们想使用第三方库，比如 jQuery，我们通常这样获取一个 id 是 foo 的元素：
$('#foo');
// 或
jQuery('#foo');

但是在 TypeScript 中，我们并不知道 $ 或 jQuery 是什么东西：
 error TSxxx: Cannot find name 'jQuery'.
*/
declare var jQuery: (selector: string) => any;
jQuery("#foo");
```

### ///(三斜线指令)
http://www.manongjc.com/detail/25-qivayehgfvmmeia.html
```javascript
TypeScript 引入声明文件语法格式：
/// <reference path = "./declare/index.d.ts" />
*/
/// <reference path = "./declare/index.d.ts" />
var objR = new Runoob.Calc();
// objR.doSum("Hello"); // 编译错误
console.log(objR.doSum(10));

// namespace (命名空间)
// 如果你发现自己写的功能(函数/类/接口等...)越来越多, 你想对他们进行分组管理就可以用命名空间,

/// <reference path = "./declare/SomeFileName.ts" />
new Home.Page();
```

### decorators (装饰器)
```javascript
// 方法装饰器
function methodDecorator1(param1: boolean, param2?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(
      param1 +
        ", " +
        param2 +
        ", " +
        target +
        ", " +
        propertyKey +
        ", " +
        JSON.stringify(descriptor)
    );
  };
}

class MyClass1 {
  @methodDecorator1(true, "this is static")
  public static sFunc(): void {
    console.log("call static method");
  }

  @methodDecorator1(false)
  public func(): void {
    console.log("call method");
  }
}
MyClass1.sFunc();
var obj11 = new MyClass1();
obj11.func();

// 属性装饰器
function propDecorator(param1: boolean, param2?: string) {
  return function (target: any, propertyKey: string) {
    console.log(param1 + ", " + param2 + ", " + target + ", " + propertyKey);
  };
}
class MyClassA {
  @propDecorator(false, "Hi")
  public static A: number = 0;

  @propDecorator(true)
  public a: string = "hello";
}
console.log(MyClassA.A);
var objA = new MyClassA();
console.log(objA.a);
/*
true, undefined, [object Object], a
false, Hi, function MyClass() {
  this.a = "hello";
}, A
0
hello
*/
```



