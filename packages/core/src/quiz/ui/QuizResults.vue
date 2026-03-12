<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import type { QuizScore } from '@book/shared'

defineProps<{
  score: QuizScore
}>()

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="text-center space-y-6 py-8">
    <!-- Иконка -->
    <div class="text-5xl">
      {{ score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '📚' }}
    </div>

    <!-- Заголовок -->
    <h3 class="text-xl font-bold text-text">
      {{ t('quiz.results_title') }}
    </h3>

    <!-- Счёт -->
    <div class="text-3xl font-bold" :class="score.percentage >= 60 ? 'text-success' : 'text-danger'">
      {{ score.correct }} / {{ score.total }}
    </div>

    <p class="text-text-secondary">
      {{ t('quiz.score', { score: score.correct, total: score.total }) }}
    </p>

    <!-- Прогресс-бар -->
    <div class="max-w-xs mx-auto h-2 bg-surface-muted rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-slow"
        :class="score.percentage >= 60 ? 'bg-success' : 'bg-danger'"
        :style="{ width: score.percentage + '%' }"
      />
    </div>

    <!-- Retry -->
    <BaseButton variant="primary" @click="emit('retry')">
      {{ t('quiz.retry') }}
    </BaseButton>
  </div>
</template>
