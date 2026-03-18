import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

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
        if (!url.startsWith('/@fs/') || !/\.mdx?/.test(url)) {
          return next()
        }
        console.log('[md-plugin] intercepting .md/.mdx file:', url)

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
    vue({ include: [/\.vue$/, /\.mdx?$/] }),
    Markdown({
      include: [/\.mdx?$/],
      markdownItSetup(md) {
        /**
         * Эскейпим inline HTML с uppercase именами тегов (TypeScript generics).
         * Примеры: <T>, <K, V>, <T[]>, <T | null> в заголовках и тексте.
         * Это предотвращает ошибку "Element is missing end tag" в Vue-компиляторе.
         * Блочный HTML (<Callout>, <DeepDive>) не затрагивается — это другой тип токена.
         */
        const origHtmlInline = md.renderer.rules.html_inline
        md.renderer.rules.html_inline = (tokens, idx, opts, env, self) => {
          const content = tokens[idx].content
          if (/^<\/?[A-Z]/.test(content)) {
            return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
          }
          if (origHtmlInline) return origHtmlInline(tokens, idx, opts, env, self)
          return self.renderToken(tokens, idx, opts)
        }
      },
      transforms: {
        /**
         * Предобработка markdown перед markdown-it:
         * 1. MDX-style import statements → <script setup> (после frontmatter)
         * 2. Содержимое <Callout>/<DeepDive>:
         *    - Сначала эскейпим нежелательные HTML-теги (кроме безопасных)
         *    - Потом конвертируем `backtick` → <code>escaped</code>
         *    (markdown-it с html:true пропускает HTML-блоки без обработки)
         */
        before(code: string): string {
          // Безопасные HTML-теги, которые можно оставлять в слотах как есть
          const SAFE_TAGS = new Set([
            'p', 'div', 'span', 'strong', 'em', 'a', 'ul', 'ol', 'li',
            'br', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'code',
          ])

          // 1. Фиксируем импорты: ищем MDX-style строки @book/* и переносим в <script setup>
          //    Только пакеты @book/* — чтобы не захватить import-примеры внутри code-блоков
          //    Вставляем <script setup> ПОСЛЕ frontmatter (---...---), не до него
          const importLines: string[] = []
          let processed = code.replace(
            /^import\s+\{[^}]+\}\s+from\s+'@book\/[^']+'\s*$/gm,
            (line) => { importLines.push(line); return '' }
          )
          if (importLines.length > 0) {
            // Найдём конец frontmatter (---\n...\n---\n)
            let insertAt = 0
            if (processed.trimStart().startsWith('---')) {
              const fm2 = processed.indexOf('\n---', 3)
              if (fm2 !== -1) insertAt = fm2 + 4 // после '\n---'
            }
            const scriptBlock = `\n<script setup>\n${importLines.join('\n')}\n</script>\n`
            processed = processed.slice(0, insertAt) + scriptBlock + processed.slice(insertAt)
          }

          // 2. Обрабатываем слоты <Callout> и <DeepDive>
          processed = processed.replace(
            /<(Callout|DeepDive)((?:\s+[^>]*)?|)>([\s\S]*?)<\/\1>/g,
            (_full: string, tag: string, attrs: string, inner: string) => {
              const safe = inner
                // Шаг A: эскейпим close-теги небезопасных HTML-элементов
                .replace(/<\/([a-z][a-z0-9-]*)\s*>/g, (_: string, t: string) =>
                  SAFE_TAGS.has(t) ? `</${t}>` : `&lt;/${t}&gt;`
                )
                // Шаг B: эскейпим open-теги небезопасных HTML-элементов
                .replace(/<([a-z][a-z0-9-]*)(\s[^>]*)?\s*>/g, (_: string, t: string, a: string) =>
                  SAFE_TAGS.has(t)
                    ? `<${t}${a || ''}>`
                    : `&lt;${t}${(a || '').replace(/[<>]/g, c => c === '<' ? '&lt;' : '&gt;')}&gt;`
                )
                // Шаг C: backtick inline-code → <code> с HTML-entities
                //        ПОСЛЕДНИМ — чтобы добавленные <code> не затронули шаги A/B
                .replace(/`([^`\n]+)`/g, (_: string, c: string) =>
                  `<code>${c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`
                )
              return `<${tag}${attrs}>${safe}</${tag}>`
            }
          )

          return processed
        },
      },
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
})
