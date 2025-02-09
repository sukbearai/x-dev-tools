import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import fs from 'fs-extra'
import consola from 'consola'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function createProject(targetDir: string, template: string) {
  const cwd = process.cwd()
  const projectPath = path.resolve(cwd, targetDir)

  const VALID_TEMPLATES = ['vite', 'nuxt']

  // 支持的模板类型
  if (!VALID_TEMPLATES.includes(template)) {
    consola.warn(`暂不支持 ${template} 模板，将使用默认的 vite 模板`)
    template = 'vite'
  }

  try {
    // 获取模板路径
    const templatePath = path.resolve(__dirname, `../templates/${template}`)

    // 复制模板到目标目录
    await fs.copy(templatePath, projectPath)

    // 更新 package.json
    const pkgPath = path.join(projectPath, 'package.json')
    const pkg = await fs.readJson(pkgPath)
    pkg.name = path.basename(targetDir)
    pkg.version = '0.0.0'
    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    consola.success(`✨ 项目创建成功！\n`)
    consola.info('👉 接下来你可以：\n')
    consola.info(`  cd ${targetDir}`)
    consola.info('  pnpm install')
    consola.info('  pnpm dev\n')
  }
  catch (error) {
    consola.error('创建失败:', (error as Error).message)
    process.exit(1)
  }
}
