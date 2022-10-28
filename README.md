# hdg-cli
hdg-cli脚手架项目，通过选择模板和版本，快速创建项目

## 项目初始化
1. 创建 hdg-cli 文件夹，执行 npm init -y 初始化仓库，生成 package.json 文件
```
{
    "name": "hdg-cli",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
}
```
2. 在 hdg-cli 下创建 bin 文件夹，并在里面创建 node 入口文件 main.js
```
// main.js
#! /usr/bin/env node
console.log('hello hdg-cli')
```
3. 在 package.json 中增加 bin 字段
```
// package.json
"bin": {
        "hdg-cli": "bin/main.js"
    }
```
4. 执行npm link
在 hdg-cli 文件下执行 npm link 将项目链接到本地环境，就可以临时实现 hdg-cli 指令全局调用。
（要撤销本地指令可以使用 npm unlink <包名>）
5. 运行 hdg-cli 命令，成功打印出 hello hdg-cli。此时，hdg-cli 项目初始化完成。
## 安装依赖
npm i commander chalk figlet fs-extra inquirer ora axios download-git-repo
注意：依赖的版本可以参考本项目，所有依赖均使用 require 引入，因为有些依赖的新版本已经不支持 require。
1. commander 命令行配置指令
2. chalk 命令行美化工具，字体颜色等
3. figlet 生成基于ASCII的艺术字
4. fs-extra 文件操作工具
5. inquirer 命令行交互工具，提供list、checkbox等交互操作
6. ora 命令行loading工具，请求loading
7. axios http请求工具，请求仓库模板和版本
8. download-git-repo 命令行下载工具（支持github、gitlab、bitbucket）
