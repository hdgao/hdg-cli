const axios = require('axios')

// 拦截全局请求响应
axios.interceptors.response.use(res => {
    return res.data
})

/**
 * 获取模板
 * @returns Promise 仓库信息
 */
async function getGitRepo() {
    return axios.get(`https://api.github.com/orgs/hdg-cli/repos`)
    // return axios.get('https://gitee.com/api/v5/users/sns/repos')
}

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise 版本信息
 */
async function getTagsByRepo(repo) {
    return axios.get(`https://api.github.com/repos/hdg-cli/${repo}/tags`)
    // return axios.get(`https://gitee.com/api/v5/repos/sns/${repo}/tags`)
}

module.exports = {
    getGitRepo,
    getTagsByRepo
}
