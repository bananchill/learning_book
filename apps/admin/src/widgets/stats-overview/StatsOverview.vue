<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseCard } from '@book/ui'
import type { AdminStats } from '@/shared'

defineProps<{
  stats: AdminStats
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <BaseCard>
      <p class="text-3xl font-bold text-primary">{{ stats.totalChapters }}</p>
      <p class="text-sm text-text-secondary mt-1">{{ t('admin.dashboard.total_chapters') }}</p>
    </BaseCard>
    <BaseCard>
      <p class="text-3xl font-bold text-accent">{{ stats.totalTasks }}</p>
      <p class="text-sm text-text-secondary mt-1">{{ t('admin.dashboard.total_tasks') }}</p>
    </BaseCard>
    <BaseCard>
      <p class="text-3xl font-bold text-success">{{ stats.totalQuizQuestions }}</p>
      <p class="text-sm text-text-secondary mt-1">{{ t('admin.dashboard.total_quiz') }}</p>
    </BaseCard>
    <BaseCard>
      <p class="text-3xl font-bold text-info">{{ stats.totalInterviewQuestions }}</p>
      <p class="text-sm text-text-secondary mt-1">{{ t('admin.dashboard.total_interview') }}</p>
    </BaseCard>
  </div>
</template>
