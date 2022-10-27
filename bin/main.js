#! /usr/bin/env node

// commander 命令行指令配置
const program = require('commander')
const package = require('../package.json')
// chalk 命令行美化工具
const chalk = require('chalk')
// figlet
const figlet = require('figlet')

// 配置--help首行提示
program.name('hdg-cli').usage(`<command> [option]`)

// 配置版本号
program.version(`hdg-cli ${package.version}`)

// 配置 create 命令，command方法的第一个参数为命令名称
program
    .command('create <project-name>') // 增加创建指令
    .description('create a new project') // 添加指令描述
    .option('-f, --force', 'overwrite target directory if it exists') // 强制覆盖
    .action((projectName, cmd) => {
        // 处理用户输入create 指令附加的参数
        // 引入 create 模块，并传入参数
        require('../lib/create')(projectName, cmd)
    })

// 监听 --help 指令
program.on('--help', function () {
    console.log()
    console.log(
        `\r\n${figlet.textSync('HDG-CLI', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 80,
            whitespaceBreak: true
        })}`
    )
    console.log(` Run ${chalk.cyan('hdg-cli <command> --help')} for detailed usage of given command.`)
    console.log()
})

// 解析用户执行时输入的参数
// process.argv 是 nodejs 提供的属性
// npm run server --port 3000
// 后面的 --port 3000 就是用户输入的参数
program.parse(process.argv)
