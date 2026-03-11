import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@book/i18n': new URL('../i18n/src', import.meta.url).pathname,
      '@book/shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
})
