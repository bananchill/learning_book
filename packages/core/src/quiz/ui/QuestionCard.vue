<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { QuizQuestion } from '@book/shared'

const props = defineProps<{
  question: QuizQuestion
  selectedAnswer: number | number[] | boolean | null
  isAnswered: boolean
}>()

const emit = defineEmits<{
  select: [answer: number | boolean]
}>()

const { t } = useI18n()

const isCorrect = computed(() => {
  if (!props.isAnswered || props.selectedAnswer === null) return null
  return props.selectedAnswer === props.question.correctAnswer
})

function optionClass(index: number) {
  const base = 'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all'

  if (!props.isAnswered) {
    const selected = props.selectedAnswer === index
    return `${base} ${selected ? 'border-primary bg-primary-light text-text' : 'border-border bg-surface-elevated hover:border-primary/50 text-text cursor-pointer'}`
  }

  // После ответа
  const isCorrectOption = props.question.correctAnswer === index
  const isSelected = props.selectedAnswer === index

  if (isCorrectOption) return `${base} border-success bg-success-light text-success`
  if (isSelected && !isCorrectOption) return `${base} border-danger bg-danger-light text-danger`
  return `${base} border-border bg-surface-elevated text-text-muted opacity-60`
}

function tfClass(value: boolean) {
  const base = 'flex-1 px-4 py-3 rounded-lg border text-sm font-medium text-center transition-all'

  if (!props.isAnswered) {
    const selected = props.selectedAnswer === value
    return `${base} ${selected ? 'border-primary bg-primary-light text-primary' : 'border-border bg-surface-elevated hover:border-primary/50 text-text cursor-pointer'}`
  }

  const isCorrectVal = (props.question.correctAnswer as unknown) === value
  const isSelected = props.selectedAnswer === value

  if (isCorrectVal) return `${base} border-success bg-success-light text-success`
  if (isSelected && !isCorrectVal) return `${base} border-danger bg-danger-light text-danger`
  return `${base} border-border bg-surface-elevated text-text-muted opacity-60`
}
</script>

<template>
  <div class="space-y-4">
    <!-- Текст вопроса -->
    <p class="text-text font-medium leading-relaxed">{{ question.question }}</p>

    <!-- Код (для code-output) -->
    <pre
      v-if="question.type === 'code-output' && 'code' in question"
      class="rounded-lg bg-surface-inset border border-border p-4 text-sm font-mono overflow-x-auto text-text"
    ><code>{{ (question as any).code }}</code></pre>

    <!-- Варианты ответов: multiple-choice / code-output -->
    <div
      v-if="question.type === 'multiple-choice' || question.type === 'code-output'"
      class="space-y-2"
    >
      <button
        v-for="(option, i) in question.options"
        :key="i"
        :class="optionClass(i)"
        :disabled="isAnswered"
        @click="emit('select', i)"
      >
        <span class="font-mono text-xs text-text-muted mr-2">{{ String.fromCharCode(65 + i) }}.</span>
        {{ option }}
      </button>
    </div>

    <!-- True / False -->
    <div v-if="question.type === 'true-false'" class="flex gap-3">
      <button
        :class="tfClass(true)"
        :disabled="isAnswered"
        @click="emit('select', true)"
      >
        {{ t('quiz.true_label') }}
      </button>
      <button
        :class="tfClass(false)"
        :disabled="isAnswered"
        @click="emit('select', false)"
      >
        {{ t('quiz.false_label') }}
      </button>
    </div>

    <!-- Объяснение (после ответа) -->
    <div
      v-if="isAnswered"
      class="rounded-lg px-4 py-3 text-sm leading-relaxed"
      :class="isCorrect ? 'bg-success-light text-success' : 'bg-danger-light text-danger'"
    >
      <p class="font-medium mb-1">
        {{ isCorrect ? t('quiz.correct') : t('quiz.incorrect') }}
      </p>
      <p class="text-text-secondary">{{ question.explanation }}</p>
    </div>
  </div>
</template>
