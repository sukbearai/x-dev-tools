import type { NuxtPage } from 'nuxt/schema'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@x-dev-tools/nuxt-kit',
  ],
  xNuxtKit: {
    baseURL: process.env.NUXT_API_BASE,
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE,
  },
  hooks: {
    'pages:extend': function (pages) {
      function removePagesMatching(pattern: RegExp, pages: NuxtPage[] = []) {
        const pagesToRemove = []
        for (const page of pages) {
          if (pattern.test(page.file || ''))
            pagesToRemove.push(page)

          else
            removePagesMatching(pattern, page.children)
        }
        for (const page of pagesToRemove)
          pages.splice(pages.indexOf(page), 1)
      }
      removePagesMatching(/component/i, pages)
    },
  },
})
