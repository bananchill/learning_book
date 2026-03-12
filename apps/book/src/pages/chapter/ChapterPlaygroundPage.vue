<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { CodeSandbox } from '@book/core'
import { usePageSeo } from '@/features/seo'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const { t } = useI18n()

usePageSeo({
  title: computed(() => t('chapter.playground_for', { chapter: props.chapter.title })),
  description: computed(() => props.chapter.description),
  path: computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}/playground`),
})

const starterCode = `// ${props.chapter.title}
// Экспериментируй с кодом здесь

`
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">
      {{ t('chapter.playground_for', { chapter: chapter.title }) }}
    </h1>

    <CodeSandbox
      :starter-code="starterCode"
      test-code=""
      language="javascript"
      :auto-run="false"
      height="400px"
      :persistence-key="`playground:${chapter.id}`"
    />
  </div>
</template>
