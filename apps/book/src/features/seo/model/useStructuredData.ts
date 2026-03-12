import { useHead } from '@unhead/vue'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { SITE_URL, SITE_NAME } from '../lib/seoHelpers'

/**
 * JSON-LD: Course schema для главной страницы
 */
export function useCourseSchema() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: SITE_NAME,
    description:
      'Интерактивная книга по JS/TS, Архитектуре, Базам данных и DevOps',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: 'ru',
    isAccessibleForFree: true,
    url: SITE_URL,
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  })
}

interface ArticleSchemaOptions {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  path: MaybeRefOrGetter<string>
}

/**
 * JSON-LD: TechArticle schema для глав/подглав
 */
export function useArticleSchema(options: ArticleSchemaOptions) {
  const script = computed(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: toValue(options.title),
      description: toValue(options.description),
      url: `${SITE_URL}${toValue(options.path)}`,
      inLanguage: 'ru',
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    }
    return JSON.stringify(jsonLd)
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: script,
      },
    ],
  })
}

interface BreadcrumbItem {
  name: MaybeRefOrGetter<string>
  path: MaybeRefOrGetter<string>
}

/**
 * JSON-LD: BreadcrumbList schema
 */
export function useBreadcrumbSchema(items: BreadcrumbItem[]) {
  const script = computed(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: toValue(item.name),
        item: `${SITE_URL}${toValue(item.path)}`,
      })),
    }
    return JSON.stringify(jsonLd)
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: script,
      },
    ],
  })
}
