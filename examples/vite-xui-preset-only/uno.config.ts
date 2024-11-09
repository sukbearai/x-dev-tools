import { presetXui } from '@suwujs/preset'
import { defineConfig, transformerVariantGroup } from 'unocss'

export default defineConfig({
  envMode: 'dev',
  presets: [
    presetXui({
      color: '#608e57',
    }),
  ],
  shortcuts: {
    wrapper: 'flex flex-col justify-center items-center',
  },
  transformers: [
    transformerVariantGroup(),
  ],
  configDeps: ['../../packages/preset/dist/index.js'],
})
