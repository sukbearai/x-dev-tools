import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import ElementPlus from 'unplugin-element-plus/vite'

const r = (path: string) => resolve(__dirname, path)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    ElementPlus({}),
  ],
  resolve: {
    alias: {
      '@': r('src'),
    },
  },
  build: {
    lib: {
      entry: r('src/index.ts'),
      name: '@suwujs/ui',
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
