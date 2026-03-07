<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { Task } from '@book/shared'
import TaskCard from './TaskCard.vue'

defineProps<{
  tasks: Task[]
  solvedIds?: string[]
}>()

const emit = defineEmits<{
  select: [taskId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-text mb-4">
      {{ t('task.tasks_title') }}
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :solved="solvedIds?.includes(task.id)"
        @select="emit('select', $event)"
      />
    </div>
  </div>
</template>
