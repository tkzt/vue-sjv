/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetUno, presetIcons } from 'unocss'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import libCss from 'vite-plugin-libcss';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [presetIcons(), presetUno()]
    }),
    dts({ include: './packages' }),
    libCss(),
  ],
  test: {
    environment: 'happy-dom',
  },
  build: {
    lib: {
      entry: resolve(__dirname, './packages/index.ts'),
      name: 'VueSjv',
      fileName: 'vue-sjv'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    cssCodeSplit: true
  },
})
