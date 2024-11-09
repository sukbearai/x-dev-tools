---
outline: deep
---

## 规范

1. 创建`feature/组件名`分支添加你的组件，组件名必须大写 X 开头
2. 在`packages/ui`下创建`components/组件名`文件夹,样板代码参考`packages/ui/components/template`或者`packages/ui/components/button`
3. 开发完组件后合并代码到`main`分支统一发包

> 如果你开发的组件是基于 Element Plus 那么它的组件是需要手动导入的,便于使用 ES Module 的 Tree Shaking 功能

## 开始

1. 克隆代码仓库 `git clone https://github.com/sukbearai/x-dev-tools`
2. 根目录下执行 `pnpm i `,在 `packages/ui` 下执行`pnpm run dev`开启调试模式
3. 在 `examples/vite-xui-vue` 下执行 `pnpm run dev` 会自动导入你的组件进行调试

## 添加一个组件的完整流程

编写组件props

```ts
import type { ExtractPropTypes } from 'vue'
import { disabled, loadable, readonly, sizeable } from '@/composables/useProps'

export const templateProps = {
  size: sizeable,
  disabled,
  readonly,
  loading: loadable,
}

export type XTemplateProps = ExtractPropTypes<typeof templateProps>
```

编写Vue SFC

```vue
<script lang='ts' setup>
import { templateProps } from './props'

defineOptions({
  name: 'XTemplate',
})

defineProps(templateProps)
</script>

<template>
  <div>
    <h1>Template</h1>
  </div>
</template>
```

导出组件

packages/ui/components/template/index.ts

```ts
import { withInstall } from '@x-dev-tools/utils'
import Template from './index.vue'

export const XTemplate = withInstall(Template)

export * from './props'
```

packages/ui/components/index.ts

```ts
import type { Plugin } from 'vue'
import { XButton } from './button'
import { XTemplate } from './template'

export default [
  XButton,
  XTemplate,
  // 其他组件
] as unknown as Plugin[]
```

## 添加组件文档

在 `docs/components` 下创建`组件名.md`文件，文件内容参考`docs/components/button.md`文件

## 发布组件

切换到`main`分支,根目录执行`pnpm run release`发布组件，根据命令行提示变更版本号，填写y确认发包

## 在项目中更新依赖

更新依赖命令

```bash [pnpm]
pnpm update @x-dev-tools/ui@latest
```
