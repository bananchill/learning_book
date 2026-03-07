<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton, DeepDive } from '@book/ui'
import type { InterviewQuestion } from '@book/shared'
import type { SelfAssessment } from '../model/useInterview'

const props = defineProps<{
  question: InterviewQuestion
  isRevealed: boolean
  assessment: SelfAssessment | null
}>()

const emit = defineEmits<{
  reveal: []
  assess: [value: SelfAssessment]
}>()

const { t } = useI18n()

const levelColors: Record<string, string> = {
  junior: 'bg-success-light text-success',
  middle: 'bg-warning-light text-warning',
  senior: 'bg-danger-light text-danger',
}

const assessOptions: { value: SelfAssessment; label: string; color: string }[] = [
  { value: 'good', label: 'interview.good', color: 'bg-success-light text-success border-success/30' },
  { value: 'ok', label: 'interview.ok', color: 'bg-warning-light text-warning border-warning/30' },
  { value: 'bad', label: 'interview.bad', color: 'bg-danger-light text-danger border-danger/30' },
]
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-elevated p-5 space-y-4">
    <!-- Заголовок -->
    <div class="flex items-start justify-between gap-3">
      <p class="font-medium text-text leading-relaxed">{{ question.question }}</p>
      <span class="flex-shrink-0 text-xs font-medium px-2 py-1 rounded-full" :class="levelColors[question.level]">
        {{ t(`interview.level.${question.level}`) }}
      </span>
    </div>

    <!-- Кнопка раскрытия -->
    <BaseButton v-if="!isRevealed" variant="secondary" size="sm" @click="emit('reveal')">
      {{ t('interview.show_answer') }}
    </BaseButton>

    <!-- Раскрытый ответ -->
    <template v-if="isRevealed">
      <!-- Хороший ответ -->
      <div class="rounded-lg bg-success-light/50 border border-success/20 px-4 py-3">
        <h4 class="text-xs font-semibold text-success mb-1">{{ t('interview.good_answer') }}</h4>
        <p class="text-sm text-text leading-relaxed">{{ question.goodAnswer }}</p>
      </div>

      <!-- Что хочет интервьюер -->
      <div class="rounded-lg bg-primary-light/50 border border-primary/20 px-4 py-3">
        <h4 class="text-xs font-semibold text-primary mb-1">{{ t('interview.interviewer_wants') }}</h4>
        <p class="text-sm text-text leading-relaxed">{{ question.whatInterviewerWants }}</p>
      </div>

      <!-- Частые ошибки -->
      <div v-if="question.commonMistakes.length > 0" class="rounded-lg bg-danger-light/50 border border-danger/20 px-4 py-3">
        <h4 class="text-xs font-semibold text-danger mb-1">{{ t('interview.common_mistakes') }}</h4>
        <ul class="text-sm text-text space-y-1">
          <li v-for="(mistake, i) in question.commonMistakes" :key="i">❌ {{ mistake }}</li>
        </ul>
      </div>

      <!-- Дополнительные вопросы -->
      <div v-if="question.followUps.length > 0">
        <h4 class="text-xs font-semibold text-text-secondary mb-2">{{ t('interview.follow_ups') }}</h4>
        <ul class="text-sm text-text-secondary space-y-1">
          <li v-for="(q, i) in question.followUps" :key="i">→ {{ q }}</li>
        </ul>
      </div>

      <!-- Самооценка -->
      <div class="pt-2 border-t border-border">
        <p class="text-xs text-text-muted mb-2">{{ t('interview.self_assess') }}</p>
        <div class="flex gap-2">
          <button
            v-for="opt in assessOptions"
            :key="opt.value"
            class="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all"
            :class="assessment === opt.value ? opt.color + ' border-current' : 'border-border text-text-muted hover:border-border-strong'"
            @click="emit('assess', opt.value)"
          >
            {{ t(opt.label) }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
