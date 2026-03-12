/// <reference types="vite-ssg" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { generateRoutes } from './ssg-routes'
import { generateSitemap } from './ssg-sitemap'

/**
 * Vite не прогоняет плагины для файлов за пределами project root (/@fs/ пути).
 * Этот плагин перехватывает /@fs/*.md запросы ДО встроенного static-сервера
 * и вручную прогоняет .md файлы через pluginContainer.transform().
 */
function contentMdPlugin() {
  return {
    name: 'content-md-transform',
    configureServer(server: import('vite').ViteDevServer) {
      // Middleware добавленный напрямую (не через return) запускается ДО Vite
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? ''
        console.log('[md-plugin] request:', url.substring(0, 80))
        if (!url.startsWith('/@fs/') || !url.includes('.md')) {
          return next()
        }
        console.log('[md-plugin] intercepting .md file:', url)

        // Извлекаем реальный путь к файлу
        const fsPath = decodeURIComponent(url)
          .replace('/@fs/', '')
          .replace(/\?.+$/, '')

        let raw: string
        try {
          raw = readFileSync(fsPath, 'utf-8')
        } catch {
          return next()
        }

        try {
          // Прогоняем через цепочку плагинов (Markdown → Vue)
          const result = await server.pluginContainer.transform(raw, fsPath)
          if (result?.code) {
            res.setHeader('Content-Type', 'application/javascript')
            res.setHeader('Cache-Control', 'no-cache')
            res.end(result.code)
            return
          }
        } catch {
          // Если трансформация не удалась, пробуем следующий обработчик
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [
    contentMdPlugin(),
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      include: [/\.md$/],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content': resolve(__dirname, '../../content'),
    },
  },
  server: {
    fs: {
      allow: ['../..'],
    },
    proxy: {
      '/api/chat': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => '/v1/messages',
      },
    },
  },
  ssgOptions: {
    entry: 'src/app/main.ts',
    script: 'async',
    formatting: 'minify',
    beastiesOptions: {
      preload: 'swap',
    },
    includedRoutes(_paths, _routes) {
      return generateRoutes()
    },
    onFinished() {
      generateSitemap(resolve(__dirname, 'dist'))
    },
  },
})
