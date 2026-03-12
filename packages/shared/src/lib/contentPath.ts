/** Убирает префикс `content/<locale>/` из пути контента */
export function normalizeContentPath(path: string, locale = 'ru'): string {
  return path.replace(new RegExp(`^content/${locale}/`), '')
}
