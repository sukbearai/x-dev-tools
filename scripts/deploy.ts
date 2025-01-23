import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function updateDependencies(pkgPath: string) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  let modified = false

  const dependencyTypes = ['dependencies', 'devDependencies'] as const
  dependencyTypes.forEach((depType) => {
    if (pkg[depType]) {
      Object.keys(pkg[depType]).forEach((dep) => {
        if (pkg[depType][dep] === 'workspace:*') {
          pkg[depType][dep] = 'latest'
          modified = true
        }
      })
    }
  })

  if (modified) {
    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
    console.log(`Updated dependencies in ${pkgPath}`)
  }
}

// 递归查找所有 package.json 文件
function findPackageJsonFiles(dir: string) {
  const results: string[] = []
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('node_modules')) {
      results.push(...findPackageJsonFiles(fullPath))
    }
    else if (file === 'package.json') {
      results.push(fullPath)
    }
  })

  return results
}

// 更新所有找到的 package.json
const packageJsonFiles = findPackageJsonFiles(rootDir)
packageJsonFiles.forEach(updateDependencies)
