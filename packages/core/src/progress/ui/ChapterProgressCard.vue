<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { useProgressStore } from '../model/useProgressStore'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{
  chapterId: string
  title: string
}>()

const { t } = useI18n()
const store = useProgressStore()

const percent = store.getChapterPercent(props.chapterId)
const status = store.getChapterStatus(props.chapterId)

const statusLabel: Record<string, string> = {
  not_started: 'progress.not_started',
  in_progress: 'progress.in_progress',
  completed: 'progress.completed',
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm text-text truncate">{{ title }}</span>
        <span class="text-xs text-text-muted ml-2 flex-shrink-0">{{ percent }}%</span>
      </div>
      <ProgressBar :value="percent" size="sm" />
    </div>
  </div>
</template>
