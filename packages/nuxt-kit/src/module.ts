import { addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ModuleOptions {
  baseURL?: string
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    xNuxtKit?: Partial<ModuleOptions>
  }

  interface PublicRuntimeConfig {
    http: {
      baseURL: string
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@suwujs/nuxt-kit',
    configKey: 'xNuxtKit',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    baseURL: process.env.NUXT_API_BASE,
  },
  setup(_options, _nuxt) {
    _nuxt.options.runtimeConfig.public.http = {
      baseURL: process.env.NUXT_API_BASE || _options.baseURL!,
    }

    const resolver = createResolver(import.meta.url)

    addImports({
      name: 'useHttp',
      as: 'useHttp',
      from: resolver.resolve('./runtime/composables/useHttp'),
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
