import { defineConfig, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetXui } from '@suwujs/preset'

export default defineConfig({
  envMode: 'dev',
  presets: [
    presetXui({
      color: '#608e57',
      preflights: false,
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
