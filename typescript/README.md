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