<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import type { CodeReviewIssue } from '@book/shared'
import { useCodeReview } from '../model/useCodeReview'

const props = defineProps<{
  code: string
  issues: CodeReviewIssue[]
}>()

const emit = defineEmits<{
  complete: [score: { found: number; total: number }]
}>()

const { t } = useI18n()

const {
  markedLines,
  isSubmitted,
  foundIssues,
  missedIssues,
  falsePositives,
  score,
  toggleLine,
  submit,
} = useCodeReview(props.issues)

const lines = props.code.split('\n')

function handleSubmit() {
  submit()
  emit('complete', score.value)
}

function lineClass(lineNum: number) {
  const base = 'flex items-start gap-3 px-4 py-1 font-mono text-sm transition-colors'

  if (!isSubmitted.value) {
    return markedLines.value.has(lineNum)
      ? `${base} bg-warning-light cursor-pointer`
      : `${base} hover:bg-surface-muted cursor-pointer`
  }

  // После отправки
  const isIssue = props.issues.some((i) => i.line === lineNum)
  const isMarked = markedLines.value.has(lineNum)

  if (isIssue && isMarked) return `${base} bg-success-light` // Найдено
  if (isIssue && !isMarked) return `${base} bg-danger-light` // Пропущено
  if (!isIssue && isMarked) return `${base} bg-warning-light opacity-60` // Ложное
  return base
}
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-elevated overflow-hidden">

    <!-- Заголовок -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
      <span class="text-sm font-medium text-text">{{ t('code_review.title') }}</span>
      <span v-if="!isSubmitted" class="text-xs text-text-muted">
        {{ t('code_review.mark_issue') }}
      </span>
      <span v-else class="text-xs font-medium" :class="score.found === score.total ? 'text-success' : 'text-warning'">
        {{ t('code_review.found', score) }}
      </span>
    </div>

    <!-- Код -->
    <div class="overflow-x-auto">
      <div
        v-for="(line, i) in lines"
        :key="i"
        :class="lineClass(i + 1)"
        @click="toggleLine(i + 1)"
      >
        <span class="text-text-muted w-8 text-right flex-shrink-0 select-none">{{ i + 1 }}</span>
        <pre class="text-text whitespace-pre">{{ line }}</pre>
      </div>
    </div>

    <!-- Результаты после отправки -->
    <div v-if="isSubmitted" class="border-t border-border p-4 space-y-3">
      <div v-for="issue in foundIssues" :key="issue.line" class="text-sm">
        <span class="text-success">✅ Строка {{ issue.line }}:</span>
        <span class="text-text-secondary ml-1">{{ issue.description }}</span>
      </div>
      <div v-for="issue in missedIssues" :key="issue.line" class="text-sm">
        <span class="text-danger">❌ Строка {{ issue.line }}:</span>
        <span class="text-text-secondary ml-1">{{ issue.description }}</span>
        <span class="text-text-muted ml-1">({{ issue.fix }})</span>
      </div>
      <div v-for="line in falsePositives" :key="line" class="text-sm text-warning">
        ⚠️ Строка {{ line }}: ложное срабатывание
      </div>
    </div>

    <!-- Кнопка -->
    <div v-if="!isSubmitted" class="border-t border-border px-4 py-3 flex justify-end">
      <BaseButton
        variant="primary"
        size="sm"
        :disabled="markedLines.size === 0"
        @click="handleSubmit"
      >
        {{ t('code_review.submit') }}
      </BaseButton>
    </div>
  </div>
</template>
