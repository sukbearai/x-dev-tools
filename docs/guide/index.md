---
outline: deep
---

# 使用 X Dev Tools UI 组件库

依赖安装:

```bash [pnpm]
pnpm i -D unocss @suwujs/ui @suwujs/preset
```

在 Vue 项目中使用 XUI 组件库:

```ts
// math.ts
import XUI from '@suwujs/ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import '@suwujs/ui/ui.css'

createApp(App).use(XUI).mount('#app')
```

使用预设配置 uno.config.ts

```ts twoslash {7-9}
// uno.config.ts
import { defineConfig } from 'unocss'
import { presetXui } from '@suwujs/preset'

export default defineConfig({
  presets: [
    presetXui({
      /* options */
    })
  ]
})
```

在 vite.config.ts 引入 unocss

```ts
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [
    // ...
    UnoCSS() // [!code ++]
  ]
})
```

现在你可以在 Vue 文件中使用 XUI 组件了

```vue
<template>
  <XButton>Button</XButton>
</template>
```

<XButton>Button</XButton>
