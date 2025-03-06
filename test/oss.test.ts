import { describe, expect, it } from 'vitest'
import { OSSClient } from '../packages/x-dev-tools/src/oss'

describe('oSSClient', () => {
  const config = {
    region: process.env.OSS_REGION || 'test-region',
    accessKeyId: process.env.OSS_ACCESS_KEY_ID || 'test-key',
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || 'test-secret',
    bucket: process.env.OSS_BUCKET || 'test-bucket',
  }

  it('should create OSS client', () => {
    const client = new OSSClient(config)
    expect(client).toBeInstanceOf(OSSClient)
  })

  it('should upload file', async () => {
    const client = new OSSClient(config)
    const filePath = './test/fixtures/test.txt'
    const url = await client.uploadFile(filePath)
    expect(url).toMatch(/^https?:\/\//)
  })

  it('should upload directory', async () => {
    const client = new OSSClient(config)
    const dirPath = './test/fixtures'
    const urls = await client.uploadDirectory(dirPath)
    expect(urls).toBeInstanceOf(Array)
    expect(urls.length).toBeGreaterThan(0)
  })
})
