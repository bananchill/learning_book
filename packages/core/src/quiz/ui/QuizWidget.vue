<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import type { Quiz } from '@book/shared'
import { useQuiz } from '../model/useQuiz'
import QuestionCard from './QuestionCard.vue'
import QuizResults from './QuizResults.vue'

const props = defineProps<{
  data: Quiz
}>()

const emit = defineEmits<{
  complete: [score: { correct: number; total: number; percentage: number }]
}>()

const { t } = useI18n()

const {
  currentIndex,
  currentQuestion,
  totalQuestions,
  score,
  isFinished,
  isLastQuestion,
  selectedAnswer,
  isAnswered,
  submitAnswer,
  next,
  retry,
} = useQuiz(props.data)

function handleSelect(answer: number | boolean) {
  selectedAnswer.value = answer
}

function handleSubmit() {
  submitAnswer()
}

function handleNext() {
  if (isLastQuestion.value && isAnswered.value) {
    emit('complete', score.value)
  }
  next()
}
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden">

    <!-- Результаты -->
    <QuizResults
      v-if="isFinished"
      :score="score"
      @retry="retry"
    />

    <!-- Вопрос -->
    <template v-else-if="currentQuestion">
      <!-- Прогресс-бар -->
      <div class="h-1 bg-surface-muted">
        <div
          class="h-full bg-primary transition-all duration-normal"
          :style="{ width: ((currentIndex + 1) / totalQuestions) * 100 + '%' }"
        />
      </div>

      <div class="p-6 space-y-5">
        <!-- Заголовок -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-text-muted font-medium">
            {{ t('quiz.question_of', { current: currentIndex + 1, total: totalQuestions }) }}
          </span>
        </div>

        <!-- Карточка вопроса -->
        <QuestionCard
          :question="currentQuestion"
          :selected-answer="selectedAnswer"
          :is-answered="isAnswered"
          @select="handleSelect"
        />

        <!-- Кнопки -->
        <div class="flex justify-end gap-3">
          <BaseButton
            v-if="!isAnswered"
            variant="primary"
            :disabled="selectedAnswer === null"
            @click="handleSubmit"
          >
            {{ t('quiz.submit') }}
          </BaseButton>
          <BaseButton
            v-else
            variant="primary"
            @click="handleNext"
          >
            {{ isLastQuestion ? t('quiz.results_title') : t('quiz.next') }}
          </BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>
