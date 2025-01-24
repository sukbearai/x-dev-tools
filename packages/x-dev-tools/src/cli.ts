import path from 'node:path'
import process from 'node:process'
import { confirm, input, select } from '@inquirer/prompts'
import consola from 'consola'
import fs from 'fs-extra'
import { createProject } from './create'
// const [targetDir, templateName] = process.argv.slice(2)
type TemplateName = 'vite' | 'nuxt' | 'uniapp'
const cwd = process.cwd()
async function main() {
  const targetDir = await input({ message: '创建应用的目录', default: 'my-app' })
  const dir = path.resolve(cwd, targetDir)
  const existed = await fs.exists(dir)
  if (existed) {
    const isOverwrite = await confirm({ message: '目录已存在，是否覆盖？', default: false })
    if (!isOverwrite) {
      return
    }
  }
  const templateName = await select({
    message: '选择模板',
    choices: [
      {
        name: 'Vite 模板',
        value: 'vite',
      },
      {
        name: 'Nuxt 模板',
        value: 'nuxt',
      },
      {
        name: 'uni-app 模板',
        value: 'uniapp',
      },
    ],
    default: 'vite',
  })
  await createProject(targetDir, templateName as TemplateName)
}

main().catch(
  (err) => {
    consola.error('✗ 创建失败:', err.message || err)
    consola.log('✗ 取消创建')
  },
)
