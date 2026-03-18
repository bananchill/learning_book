import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

interface Chapter {
  id: string
  subchapters: { id: string }[]
}

interface Group {
  chapters: Chapter[]
}

interface Subsection {
  id: string
  groups: Group[]
}

interface Section {
  id: string
  subsections: Subsection[]
}

interface BookConfig {
  sections: Section[]
}

const SITE_URL = 'https://interactive-code.ru'

function generateRoutes(config: BookConfig): string[] {
  const routes: string[] = ['/']

  for (const section of config.sections) {
    for (const subsection of section.subsections) {
      for (const group of subsection.groups) {
        for (const chapter of group.chapters) {
          const base = `/${section.id}/${subsection.id}/${chapter.id}`
          routes.push(base)
          routes.push(`${base}/tasks`)
          routes.push(`${base}/playground`)
          routes.push(`${base}/code-review`)

          for (const sub of chapter.subchapters) {
            routes.push(`${base}/${sub.id}`)
          }
        }
      }
    }
  }

  return routes
}

function getPriority(path: string): string {
  if (path === '/') return '1.0'
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 3) return '0.8'
  return '0.6'
}

const configPath = resolve(__dirname, '..', 'book.config.json')
const bookConfig: BookConfig = JSON.parse(readFileSync(configPath, 'utf-8'))
const routes = generateRoutes(bookConfig)
const today = new Date().toISOString().split('T')[0]

const urls = routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <priority>${getPriority(route)}</priority>
  </url>`,
  )
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const outDir = resolve(__dirname, '..', 'dist')
writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8')
console.log(`sitemap.xml: ${routes.length} URLs → dist/sitemap.xml`)
