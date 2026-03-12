import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { generateRoutes } from './ssg-routes'

const SITE_URL = 'https://interactive-code.ru'

function getPriority(path: string): string {
  if (path === '/') return '1.0'
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 3) return '0.8' // chapter
  return '0.6' // subchapter, tasks, playground
}

/**
 * Генерирует sitemap.xml в dist/ директорию.
 * Вызывается из ssgOptions.onFinished() в vite.config.ts
 */
export function generateSitemap(outDir: string) {
  const routes = generateRoutes()
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

  writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8')
}
