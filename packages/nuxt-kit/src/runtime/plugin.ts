import { logger } from '../utils/log'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  logger.log('Plugin injected by @x-dev-tool/nuxt-kit!')
})
