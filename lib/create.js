const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Creator = require('./Creator')

module.exports = async function (projectName, options) {
    // 获取当前工作目录
    const cwd = process.cwd()
    // 拼接得到项目目录
    const targetDirectory = path.join(cwd, projectName)
    // 判断目录是否存在
    if (fs.existsSync(targetDirectory)) {
        // 判断是否使用 --force（强制覆盖）参数
        if (options.force) {
            // 删除重名目录（remove是个异步方法）
            await fs.remove(targetDirectory)
        } else {
            let { isOverwrite } = await new inquirer.prompt([
                // 返回值为promise
                {
                    name: 'isOverwrite', // 与返回值对应
                    type: 'list',
                    message: 'Target directory exists, Please choose an action',
                    choices: [
                        { name: 'Overwrite', value: true },
                        { name: 'Cancel', value: false }
                    ]
                }
            ])
            // 选择 Cancel
            if (!isOverwrite) {
                console.log('Cancel')
                return
            } else {
                //选择 Overwrite，先删除掉原有重名目录
                console.log('\r\nRemoving')
                await fs.remove(targetDirectory)
            }
        }
    }

    // 创建项目
    const creator = new Creator(projectName, targetDirectory)
    creator.create()
}
