import path from 'node:path'
import OSS from 'ali-oss'
import fs from 'fs-extra'
import consola from 'consola'

interface OSSConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

type ProgressCallback = (progress: number) => void
type FileProgressCallback = (fileName: string, progress: number) => void

export class OSSClient {
  private client: OSS

  constructor(config: OSSConfig) {
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    })
  }

  async uploadFile(localPath: string, ossPath?: string, onProgress?: ProgressCallback): Promise<string> {
    try {
      if (!await fs.exists(localPath))
        throw new Error(`文件不存在: ${localPath}`)

      const fileName = path.basename(localPath)
      const objectName = ossPath || fileName
      const _fileSize = (await fs.stat(localPath)).size

      const result = await this.client.put(
        objectName,
        localPath,
        {
          // @ts-expect-error ali-oss 类型定义未包含 progress 属性
          progress: (p: number) => {
            onProgress?.(p / 100)
          },
        },
      )

      return result.url
    }
    catch (error) {
      consola.error('文件上传失败:', (error as Error).message)
      throw error
    }
  }

  async uploadDirectory(localDir: string, ossPrefix: string = '', onProgress?: FileProgressCallback): Promise<string[]> {
    try {
      if (!await fs.exists(localDir))
        throw new Error(`目录不存在: ${localDir}`)

      const files = await fs.readdir(localDir)
      const urls: string[] = []

      for (const file of files) {
        const localPath = path.join(localDir, file)
        const stat = await fs.stat(localPath)

        if (stat.isFile()) {
          const ossPath = path.join(ossPrefix, file).replace(/\\/g, '/')
          const url = await this.uploadFile(
            localPath,
            ossPath,
            progress => onProgress?.(file, progress),
          )
          urls.push(url)
        }
      }

      return urls
    }
    catch (error) {
      consola.error('目录上传失败:', (error as Error).message)
      throw error
    }
  }
}
