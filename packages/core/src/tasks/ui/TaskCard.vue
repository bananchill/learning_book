<script setup lang="ts">
import type { Task } from '@book/shared'
import { DifficultyBadge } from '@book/ui'
import { useI18n } from '@book/i18n'

defineProps<{
  task: Task
  solved?: boolean
}>()

const emit = defineEmits<{
  select: [taskId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div
    class="rounded-xl border bg-surface-elevated p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
    :class="solved ? 'border-success/30' : 'border-border'"
    @click="emit('select', task.id)"
  >
    <div class="flex items-start justify-between gap-3 mb-2">
      <h4 class="font-medium text-text text-sm">{{ task.title }}</h4>
      <DifficultyBadge :level="task.difficulty" />
    </div>

    <p class="text-xs text-text-secondary mb-3 line-clamp-2">{{ task.description }}</p>

    <div class="flex items-center justify-between">
      <span class="text-xs text-text-muted">{{ t('task.estimated_minutes', { n: task.estimatedMinutes }) }}</span>
      <span v-if="solved" class="text-xs text-success font-medium">✅</span>
    </div>
  </div>
</template>
