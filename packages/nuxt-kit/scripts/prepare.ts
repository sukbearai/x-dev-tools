import { dirname, resolve } from 'node:path'
import { readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'
import { useLogger } from '@suwujs/logger'

// 获取 __dirname 的 ESM 替代方案
const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  await execa('nuxt-module-build', ['build', '--stub'], { stdio: 'inherit' })
  await execa('nuxt-module-build', ['prepare'], { stdio: 'inherit' })

  const appsDir = resolve(__dirname, '../../../apps')
  const apps = readdirSync(appsDir)

  for (const app of apps) {
    const appPath = resolve(appsDir, app)
    const nuxtConfigPath = resolve(appPath, 'nuxt.config.ts')

    if (statSync(appPath).isDirectory()) {
      try {
        if (statSync(nuxtConfigPath).isFile()) {
          useLogger('nuxt-kit').log(`Preparing Nuxt app: ${app}`)
          await execa('nuxi', ['prepare'], {
            stdio: 'inherit',
            cwd: appPath,
          })
        }
      }
      catch {
        continue
      }
    }
  }
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
