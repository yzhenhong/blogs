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
```

```