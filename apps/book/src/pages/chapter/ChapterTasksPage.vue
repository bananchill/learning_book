<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton } from '@book/ui'
import { TaskList, TaskView, useProgressStore } from '@book/core'
import { useChapterData, useTaskCode, ContentPlaceholder } from '@/features/content-loader'
import { usePageSeo } from '@/features/seo'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const { t } = useI18n()

usePageSeo({
  title: computed(() => t('chapter.tasks_for', { chapter: props.chapter.title })),
  description: computed(() => props.chapter.description),
  path: computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}/tasks`),
})
const progress = useProgressStore()

const { tasks, isLoading } = useChapterData(() => props.chapter.contentPath)

const selectedTaskId = ref<string | null>(null)
const selectedTask = computed(() =>
  tasks.value.find(task => task.id === selectedTaskId.value),
)

// Загрузка starter-кода и тестов выбранной задачи
const { starterCode, testCode, isLoading: isCodeLoading } = useTaskCode(
  () => props.chapter.contentPath,
  () => selectedTask.value?.file,
  () => selectedTask.value?.testFile,
)

const nextTask = computed(() => {
  if (!selectedTaskId.value) return null
  const idx = tasks.value.findIndex(t => t.id === selectedTaskId.value)
  return idx >= 0 && idx < tasks.value.length - 1 ? tasks.value[idx + 1] : null
})

function handleSelect(taskId: string) {
  selectedTaskId.value = taskId
}

function goToNext() {
  if (nextTask.value) {
    selectedTaskId.value = nextTask.value.id
  }
}

function handleSolved(taskId: string) {
  progress.markTaskCompleted(props.chapter.id, taskId)
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">
      {{ t('chapter.tasks_for', { chapter: chapter.title }) }}
    </h1>

    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-20 bg-surface-muted rounded-xl" />
      <div class="h-20 bg-surface-muted rounded-xl" />
    </div>

    <template v-else-if="tasks.length > 0">
      <div v-if="isCodeLoading && selectedTask" class="animate-pulse space-y-4">
        <div class="h-64 bg-surface-muted rounded-xl" />
      </div>

      <TaskView
        v-else-if="selectedTask"
        :task="selectedTask"
        :starter-code="starterCode"
        :test-code="testCode"
        :persistence-key="selectedTask.id"
        @solved="handleSolved(selectedTask!.id)"
      />

      <TaskList
        v-else
        :tasks="tasks"
        @select="handleSelect"
      />

      <div v-if="selectedTask" class="mt-4 flex items-center justify-between">
        <BaseButton
          variant="ghost"
          size="sm"
          @click="selectedTaskId = null"
        >
          &larr; {{ t('chapter.back_to_tasks') }}
        </BaseButton>
        <BaseButton
          v-if="nextTask"
          variant="ghost"
          size="sm"
          @click="goToNext"
        >
          {{ t('chapter.next_task') }} &rarr;
        </BaseButton>
      </div>
    </template>

    <ContentPlaceholder v-else />
  </div>
</template>
