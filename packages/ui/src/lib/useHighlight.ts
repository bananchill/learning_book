import { ref, watchEffect, type Ref } from 'vue'
import type { BundledLanguage, HighlighterGeneric } from 'shiki'

// Ленивая загрузка shiki для производительности
let highlighterPromise: Promise<HighlighterGeneric<any, any>> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((mod) =>
      mod.createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['javascript', 'typescript', 'vue', 'html', 'css', 'json', 'bash'],
      }),
    )
  }
  return highlighterPromise
}

export function useHighlight(code: Ref<string>, language: Ref<string>) {
  const html = ref('')
  const loading = ref(true)

  watchEffect(async () => {
    loading.value = true
    const highlighter = await getHighlighter()
    html.value = highlighter.codeToHtml(code.value, {
      lang: language.value as BundledLanguage,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
    loading.value = false
  })

  return { html, loading }
}
