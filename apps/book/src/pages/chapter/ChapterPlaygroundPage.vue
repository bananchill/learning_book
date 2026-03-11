<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { CodeSandbox } from '@book/core'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const { t } = useI18n()

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
