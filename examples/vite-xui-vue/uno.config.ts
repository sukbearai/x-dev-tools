import { presetXui } from '@suwujs/preset'
import { defineConfig } from 'unocss'

export default defineConfig({
  envMode: 'dev',
  presets: [
    presetXui({
      preflights: false,
    }),
  ],
  shortcuts: {
    wrapper: 'flex flex-col justify-center items-center',
  },
})
