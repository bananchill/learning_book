<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { Interview, SelfAssessment } from '@book/shared'
import { useInterview } from '../model/useInterview'
import InterviewCard from './InterviewCard.vue'

const props = defineProps<{
  data: Interview
}>()

const { t } = useI18n()

const {
  questions,
  reviewedCount,
  totalCount,
  reveal,
  isRevealed,
  assess,
  getAssessment,
} = useInterview(props.data)
</script>

<template>
  <div class="space-y-5">
    <!-- Заголовок -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-text">{{ t('interview.title') }}</h3>
      <span class="text-xs text-text-muted">
        {{ reviewedCount }} / {{ totalCount }}
      </span>
    </div>

    <!-- Вопросы -->
    <template v-if="questions.length > 0">
      <InterviewCard
        v-for="q in questions"
        :key="q.id"
        :question="q"
        :is-revealed="isRevealed(q.id)"
        :assessment="getAssessment(q.id)"
        @reveal="reveal(q.id)"
        @assess="assess(q.id, $event)"
      />
    </template>
    <div v-else class="text-center text-text-muted text-sm py-8">
      {{ t('interview.no_questions') }}
    </div>
  </div>
</template>
