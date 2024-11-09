---
outline: deep
---

# ElButtonGroups

创建基于Element UI plus的物料组件。

## <i i-logos-unocss /> With Element UI Plus

### <i i-carbon:use-case-usage /> Usage

```ts
import XUI from '@suwjs/ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import '@suwjs/ui/ui.css'
// 添加 Element UI Plus 样式,如果你的项目已经全量安装了element-ui-plus可以不用添加这行代码
import '@suwjs/ui/element-ui-plus.css' // [!code ++]

createApp(App).use(XUI).mount('#app')
```

### <i i-logos-vue /> With Vue

```vue
<template>
  <x-el-button-groups />
</template>
```

<x-el-button-groups />
