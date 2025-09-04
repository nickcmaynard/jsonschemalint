import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), Icons({scale: 1, defaultStyle: 'margin-top: -5%'})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
    },
  },
  build: {
    // sourcemap: 'inline',
  },
  css: {
     preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
            'mixed-decls',
            'color-functions',
            'global-builtin',
          ],
        },
     },
  },
  server: {
    proxy: {
      '^/umami/(script|stats).js$': {
        target: 'https://eu.umami.is',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/umami/, '')
      },
      '^/umami/api/send$': {
        target: 'https://eu.umami.is',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/umami/, '')
      }
    },
  }
})
