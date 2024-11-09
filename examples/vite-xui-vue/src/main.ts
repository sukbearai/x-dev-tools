import XUI from '@suwujs/ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'uno.css'
import '@suwujs/ui/ui.css'
import '@suwujs/ui/element-ui-plus.css'

createApp(App).use(XUI).mount('#app')
