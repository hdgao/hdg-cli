const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')
const { getGitRepo, getTagsByRepo } = require('./api')

/**
 * 睡眠函数
 * @param {Number} n 睡眠时间
 */
function sleep(n) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, n)
    })
}

/**
 * loading加载效果
 * @param {String} message 加载信息
 * @param {Function} fn 加载函数
 * @param {List} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
async function loading(message, fn, ...args) {
    const spinner = ora(message)
    spinner.start() // 开始加载
    try {
        let executeRes = await fn(...args)
        // 加载成功
        spinner.succeed()
        return executeRes
    } catch (error) {
        // 加载失败
        console.log(error)
        spinner.fail('request fail, refetching')
        await sleep(1000)
        // 重新拉取
        return loading(message, fn, ...args)
    }
}

class Creator {
    // 项目名称及项目路径
    constructor(name, target) {
        this.name = name
        this.target = target
        // download-git-repo 模块并不支持Promise，因此借助 node 的 util 模块提供的
        // promisify 方法将其转化为 Promise 的方法。
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    // 核心创建逻辑 -- 创建项目部分
    async create() {
        // 仓库信息 -- 模板信息
        let repo = await this.getRepoInfo()
        // 标签信息 -- 版本信息
        let tag = await this.getTagInfo(repo)
        // 下载模板到模板目录
        await this.download(repo, tag)
        // 模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n cd ${chalk.cyan(this.name)}`)
        console.log('  npm install\r\n')
        console.log('  npm run dev\r\n')
    }

    // 获取模板信息及用户最终选择的模板
    async getRepoInfo() {
        // 获取组织下的仓库信息
        let repoList = await loading('获取模板', getGitRepo)
        // github提取仓库名
        const repos = repoList.map(item => item.name)
        // 选取模板信息
        let { repo } = await inquirer.prompt([
            {
                name: 'repo',
                type: 'list',
                message: 'Please choose a template',
                choices: repos
            }
        ])
        // console.log(`你选择了：${repo} 模板`)
        return repo
    }

    // 获取版本信息及用户选择的版本
    async getTagInfo(repo) {
        let tagList = await loading('获取版本', getTagsByRepo, repo)
        const tags = tagList.map(item => item.name)
        // 选取模板信息
        let { tag } = await inquirer.prompt([
            {
                name: 'tag',
                type: 'list',
                message: 'Please choose a version',
                choices: tags
            }
        ])
        console.log(`你选择了：${repo} 模板，${tag} 版本`)
        return tag
    }

    // 下载模板
    async download(repo, tag) {
        // 模板下载地址
        // github -- github:owner/name 或者 owner/name
        // gitlab -- gitlab:owner/name
        // bitbucket -- bitbucket:owner/name
        const templateUrl = `hdg-cli/${repo}${tag ? '#' + tag : ''}`

        // 调用 downloadGitRepo 方法将对应模板下载到指定目录

        await loading(
            'downloading template, please wait',
            this.downloadGitRepo,
            templateUrl,
            path.join(process.cwd(), this.name) // 项目创建的位置
        )
    }
}

module.exports = Creator
