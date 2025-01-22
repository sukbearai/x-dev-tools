import { useLogger } from '@suwujs/logger'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  useLogger('nuxt-kit').log('Plugin injected by @x-dev-tool/nuxt-kit!')
})
