<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { CodeSandbox } from '@book/core'
import { ContentPlaceholder } from '@/features/content-loader'

defineProps<{
  chapter: ChapterMeta
  sectionId: string
}>()

const { t } = useI18n()

// TODO: загрузить playground.vue из контента, когда будет доступен
const hasPlayground = false
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-[var(--color-text)] mb-6">
      {{ t('chapter.playground_for', { chapter: chapter.title }) }}
    </h1>

    <CodeSandbox
      v-if="hasPlayground"
      starter-code=""
      test-code=""
    />

    <ContentPlaceholder v-else />
  </div>
</template>
