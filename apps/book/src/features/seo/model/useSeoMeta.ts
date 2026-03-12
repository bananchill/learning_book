import { useHead, useSeoMeta as useUnheadSeoMeta } from '@unhead/vue'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import {
  SITE_NAME,
  SITE_LOCALE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  buildPageTitle,
  buildCanonicalUrl,
} from '../lib/seoHelpers'

interface PageSeoOptions {
  title: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
  path: MaybeRefOrGetter<string>
  type?: 'website' | 'article'
  image?: string
}

/**
 * Устанавливает мета-теги для страницы: title, description, OG, Twitter Cards, canonical
 */
export function usePageSeo(options: PageSeoOptions) {
  const { title, description, path, type = 'website', image } = options

  const fullTitle = computed(() => {
    const t = toValue(title)
    return t === SITE_NAME ? t : buildPageTitle(t)
  })

  const desc = computed(() => toValue(description) ?? DEFAULT_DESCRIPTION)
  const canonicalUrl = computed(() => buildCanonicalUrl(toValue(path)))
  const ogImage = image ?? DEFAULT_OG_IMAGE

  useHead({
    title: fullTitle,
    link: [{ rel: 'canonical', href: canonicalUrl }],
  })

  useUnheadSeoMeta({
    description: desc,
    ogTitle: fullTitle,
    ogDescription: desc,
    ogUrl: canonicalUrl,
    ogType: type,
    ogImage,
    ogLocale: SITE_LOCALE,
    ogSiteName: SITE_NAME,
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: desc,
  })
}
