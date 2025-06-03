# TypeScript 完全指南

## 目录
1. [TypeScript 基础](#typescript-基础)
2. [类型系统](#类型系统)
3. [高级类型](#高级类型)
4. [面向对象](#面向对象)
5. [泛型](#泛型)
6. [装饰器](#装饰器)
7. [模块系统](#模块系统)
8. [工程化实践](#工程化实践)

## TypeScript 基础

### 什么是 TypeScript
TypeScript 是 JavaScript 的超集，它添加了可选的静态类型和基于类的面向对象编程。

### 环境配置
1. 安装 TypeScript
```bash
npm install -g typescript
```

2. 初始化配置
```bash
tsc --init
```

3. tsconfig.json 配置
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 基本语法
1. 类型注解
```typescript
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
```

2. 类型推断
```typescript
let message = 'Hello'; // 类型推断为 string
let count = 42;        // 类型推断为 number
```

3. 类型断言
```typescript
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
```

## 类型系统

### 基本类型
1. 数字类型
```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

2. 字符串类型
```typescript
let color: string = "blue";
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.`;
```

3. 布尔类型
```typescript
let isDone: boolean = false;
let isActive: boolean = true;
```

4. 数组类型
```typescript
let list: number[] = [1, 2, 3];
let array: Array<number> = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
```

5. 枚举类型
```typescript
enum Color {
  Red,
  Green,
  Blue
}

let myColor: Color = Color.Red;
console.log(myColor); // 0
```

### 高级类型
1. 联合类型
```typescript
let value: string | number;
value = "hello";
value = 42;
```

2. 交叉类型
```typescript
interface A { a: string; }
interface B { b: number; }
type C = A & B;

const obj: C = {
  a: "hello",
  b: 42
};
```

3. 类型别名
```typescript
type Point = {
  x: number;
  y: number;
};

type ID = string | number;
```

4. 字面量类型
```typescript
type Direction = "North" | "South" | "East" | "West";
let direction: Direction = "North";
```

## 面向对象

### 类
1. 基本类定义
```typescript
class Animal {
  private name: string;
  protected age: number;
  
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}
```

2. 继承
```typescript
class Dog extends Animal {
  bark() {
    console.log('Woof! Woof!');
  }
}

const dog = new Dog('Rex', 3);
dog.move(10);
dog.bark();
```

3. 访问修饰符
```typescript
class Person {
  public name: string;
  protected age: number;
  private id: string;
  
  constructor(name: string, age: number, id: string) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}
```

### 接口
1. 基本接口
```typescript
interface User {
  name: string;
  age: number;
  email?: string;
  readonly id: number;
}

const user: User = {
  name: "John",
  age: 30,
  id: 1
};
```

2. 函数类型接口
```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = function(source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

3. 可索引接口
```typescript
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Bob", "Fred"];
```

## 泛型

### 基本泛型
1. 泛型函数
```typescript
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
let output2 = identity<number>(42);
```

2. 泛型接口
```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

3. 泛型类
```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束
```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

loggingIdentity({ length: 10, value: 3 });
```

## 装饰器

### 类装饰器
```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Example {
  // ...
}
```

### 方法装饰器
```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Example {
  @enumerable(false)
  method() {}
}
```

### 属性装饰器
```typescript
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    // ...
  };
}

class Example {
  @format("Hello, %s")
  greeting: string;
}
```

## 模块系统

### 导出
1. 命名导出
```typescript
// validator.ts
export interface StringValidator {
  isValid(s: string): boolean;
}

export class ZipCodeValidator implements StringValidator {
  isValid(s: string) {
    return s.length === 5;
  }
}
```

2. 默认导出
```typescript
// default.ts
export default class ZipCodeValidator {
  // ...
}
```

### 导入
1. 命名导入
```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";
```

2. 默认导入
```typescript
import ZipCodeValidator from "./ZipCodeValidator";
```

3. 重命名导入
```typescript
import { ZipCodeValidator as Zip } from "./ZipCodeValidator";
```

## 工程化实践

### 类型声明文件
1. 声明文件
```typescript
// types.d.ts
declare module "my-module" {
  export function doSomething(): void;
  export interface Config {
    name: string;
    version: string;
  }
}
```

2. 三斜线指令
```typescript
/// <reference path="types.d.ts" />
```

### 编译选项
1. 严格模式
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

2. 模块解析
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

### 最佳实践
1. 类型推断
```typescript
// 让 TypeScript 自动推断类型
let x = 3; // 类型为 number
let y = "hello"; // 类型为 string
```

2. 类型断言
```typescript
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
```

3. 类型保护
```typescript
function isString(value: any): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // value 的类型被收窄为 string
    console.log(value.toUpperCase());
  } else {
    // value 的类型被收窄为 number
    console.log(value.toFixed(2));
  }
}
```

### 工具类型
1. Partial
```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// 等价于
// {
//   name?: string;
//   age?: number;
// }
```

2. Required
```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];
};

interface User {
  name?: string;
  age?: number;
}

type RequiredUser = Required<User>;
// 等价于
// {
//   name: string;
//   age: number;
// }
```

3. Pick
```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type UserBasicInfo = Pick<User, "name" | "age">;
// 等价于
// {
//   name: string;
//   age: number;
// }
```

4. Omit
```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface User {
  name: string;
  age: number;
  email: string;
}

type UserWithoutEmail = Omit<User, "email">;
// 等价于
// {
//   name: string;
//   age: number;
// }
```

### 高级特性
1. 条件类型
```typescript
type TypeName<T> = 
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object";

type T0 = TypeName<string>;  // "string"
type T1 = TypeName<number>;  // "number"
type T2 = TypeName<boolean>; // "boolean"
```

2. 映射类型
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// 等价于
// {
//   readonly name: string;
//   readonly age: number;
// }
```

3. 索引类型
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = {
  name: "John",
  age: 30
};

const name = getProperty(user, "name"); // 类型为 string
const age = getProperty(user, "age");   // 类型为 number
```