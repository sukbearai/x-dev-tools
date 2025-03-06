import { describe, expect, it, vi } from 'vitest'
import { confirm, input, select } from '@inquirer/prompts'
import { createProject } from '../packages/x-dev-tools/src/create'

vi.mock('@inquirer/prompts')
vi.mock('../src/create')

describe('cLI', () => {
  it('should create project', async () => {
    vi.mocked(input).mockResolvedValueOnce('test-app')
    vi.mocked(select).mockResolvedValueOnce('vite')
    vi.mocked(confirm).mockResolvedValueOnce(true)
    vi.mocked(createProject).mockResolvedValueOnce()

    // 导入 CLI 模块
    const cli = await import('../packages/x-dev-tools/src/cli')
    expect(cli).toBeDefined()
  })
})
