export const SITE_URL = 'https://interactive-code.ru'
export const SITE_NAME = 'Learning Book'
export const SITE_LOCALE = 'ru_RU'
export const DEFAULT_DESCRIPTION =
  'Интерактивная книга по JS/TS, Архитектуре, Базам данных и DevOps. С песочницей, AI-ментором и реальными задачами.'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export function buildPageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`
}

export function buildCanonicalUrl(path: string): string {
  const normalized = path.endsWith('/') && path !== '/'
    ? path.slice(0, -1)
    : path
  return `${SITE_URL}${normalized}`
}
