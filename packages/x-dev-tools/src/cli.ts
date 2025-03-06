import path from 'node:path'
import process from 'node:process'
import { confirm, input, select } from '@inquirer/prompts'
import consola from 'consola'
import fs from 'fs-extra'
import { config } from 'dotenv'
import { createProject } from './create'
import { OSSClient } from './oss'

config()

config({ path: path.resolve(process.cwd(), '.env') })

type TemplateName = 'vite' | 'nuxt' | 'uniapp'
const cwd = process.cwd()

async function createApp() {
  const targetDir = await input({ message: '创建应用的目录', default: 'my-app' })
  const dir = path.resolve(cwd, targetDir)
  const existed = await fs.exists(dir)
  if (existed) {
    const isOverwrite = await confirm({ message: '目录已存在，是否覆盖？', default: false })
    if (!isOverwrite) {
      consola.info('✗ 取消创建')
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

async function uploadToOSS() {
  try {
    const {
      OSS_REGION,
      OSS_ACCESS_KEY_ID,
      OSS_ACCESS_KEY_SECRET,
      OSS_BUCKET,
      OSS_UPLOAD_PATH,
      OSS_DEST_PATH,
    } = process.env

    const config = {
      region: OSS_REGION || await input({ message: '请输入 OSS Region' }),
      accessKeyId: OSS_ACCESS_KEY_ID || await input({ message: '请输入 AccessKey ID' }),
      accessKeySecret: OSS_ACCESS_KEY_SECRET || await input({ message: '请输入 AccessKey Secret' }),
      bucket: OSS_BUCKET || await input({ message: '请输入 Bucket 名称' }),
    }

    const ossClient = new OSSClient(config)
    const rawFilePath = OSS_UPLOAD_PATH || await input({ message: '请输入要上传的文件或目录路径' })
    const filePath = path.resolve(cwd, rawFilePath)
    if (!await fs.exists(filePath))
      throw new Error(`文件或目录不存在: ${filePath}`)

    let ossPath = OSS_DEST_PATH || await input({ message: '请输入 OSS 目标路径（可选）', default: '' })

    // 规范化路径分隔符
    ossPath = ossPath.replace(/^\/+/, '')
    ossPath = ossPath.replace(/\\/g, '/')

    const stat = await fs.stat(filePath)
    const startTime = Date.now()
    let uploadedUrls: string[] = []

    if (stat.isFile()) {
      consola.start(`开始上传文件: ${path.basename(filePath)}`)
      const url = await ossClient.uploadFile(filePath, ossPath, (progress) => {
        consola.info(`上传进度: ${(progress * 100).toFixed(2)}%`)
      })
      uploadedUrls = [url]
    }
    else if (stat.isDirectory()) {
      consola.start(`开始上传目录: ${path.basename(filePath)}`)
      uploadedUrls = await ossClient.uploadDirectory(filePath, ossPath, (fileName, progress) => {
        consola.info(`正在上传 ${fileName}: ${(progress * 100).toFixed(2)}%`)
      })
    }
    else {
      throw new Error('不支持的文件类型')
    }

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000).toFixed(2)

    consola.success(`✨ 上传完成！耗时: ${duration}s\n`)
    consola.info('📋 上传文件地址:')
    uploadedUrls.forEach((url) => {
      consola.info(url)
    })
  }
  catch (error) {
    consola.error('上传失败:', (error as Error).message)
    throw error // 向上传递错误，让主函数处理
  }
}

async function main() {
  const action = await select({
    message: '请选择操作',
    choices: [
      {
        name: '创建项目',
        value: 'create',
      },
      {
        name: '上传文件到 OSS',
        value: 'upload',
      },
    ],
  })

  try {
    if (action === 'upload')
      await uploadToOSS()
    else
      await createApp()
  }
  catch (err) {
    consola.error('✗ 操作失败:', (err as Error).message)
  }
}

main().catch((err) => {
  consola.error('✗ 程序执行失败:', err.message || err)
  process.exit(1)
})
