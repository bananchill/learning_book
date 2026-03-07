<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton } from '@book/ui'
import { TaskList, TaskView, useProgressStore } from '@book/core'
import { useChapterData, ContentPlaceholder } from '@/features/content-loader'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
}>()

const { t } = useI18n()
const progress = useProgressStore()

const { tasks, isLoading } = useChapterData(() => props.chapter.contentPath)

const selectedTaskId = ref<string | null>(null)
const selectedTask = computed(() =>
  tasks.value.find(task => task.id === selectedTaskId.value),
)

function handleSelect(taskId: string) {
  selectedTaskId.value = taskId
}

function handleSolved(taskId: string) {
  progress.markTaskCompleted(props.chapter.id, taskId)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-[var(--color-text)] mb-6">
      {{ t('chapter.tasks_for', { chapter: chapter.title }) }}
    </h1>

    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-20 bg-[var(--color-surface-muted)] rounded-xl" />
      <div class="h-20 bg-[var(--color-surface-muted)] rounded-xl" />
    </div>

    <template v-else-if="tasks.length > 0">
      <TaskView
        v-if="selectedTask"
        :task="selectedTask"
        starter-code=""
        test-code=""
        @solved="handleSolved(selectedTask!.id)"
      />

      <TaskList
        v-else
        :tasks="tasks"
        @select="handleSelect"
      />

      <BaseButton
        v-if="selectedTask"
        variant="ghost"
        size="sm"
        class="mt-4"
        @click="selectedTaskId = null"
      >
        &larr; {{ t('chapter.back_to_tasks') }}
      </BaseButton>
    </template>

    <ContentPlaceholder v-else />
  </div>
</template>
