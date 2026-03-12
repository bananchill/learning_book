import bookConfig from './book.config.json'

/**
 * Генерирует все конкретные пути для SSG из book.config.json.
 * Используется в vite.config.ts → ssgOptions.includedRoutes
 */
export function generateRoutes(): string[] {
  const routes: string[] = ['/']

  for (const section of bookConfig.sections) {
    for (const subsection of section.subsections) {
      for (const group of subsection.groups) {
        for (const chapter of group.chapters) {
          const base = `/${section.id}/${subsection.id}/${chapter.id}`
          routes.push(base)
          routes.push(`${base}/tasks`)
          routes.push(`${base}/playground`)

          for (const sub of chapter.subchapters) {
            routes.push(`${base}/${sub.id}`)
          }
        }
      }
    }
  }

  return routes
}
