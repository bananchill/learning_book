<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import { useProgressStore } from '../model/useProgressStore'

const { t } = useI18n()
const store = useProgressStore()

const stats = computed(() => {
  const chapters = Object.values(store.allChapters)
  return {
    chaptersStarted: chapters.length,
    tasksCompleted: chapters.reduce((sum, ch) => sum + ch.tasks.completed.length, 0),
    quizzesPassed: chapters.filter((ch) => ch.quiz.passed).length,
    streak: store.progress.streak.current,
  }
})
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="text-center p-4 rounded-lg bg-surface-elevated border border-border">
      <div class="text-2xl font-bold text-primary">{{ stats.chaptersStarted }}</div>
      <div class="text-xs text-text-muted mt-1">глав начато</div>
    </div>
    <div class="text-center p-4 rounded-lg bg-surface-elevated border border-border">
      <div class="text-2xl font-bold text-success">{{ stats.tasksCompleted }}</div>
      <div class="text-xs text-text-muted mt-1">задач решено</div>
    </div>
    <div class="text-center p-4 rounded-lg bg-surface-elevated border border-border">
      <div class="text-2xl font-bold text-accent">{{ stats.quizzesPassed }}</div>
      <div class="text-xs text-text-muted mt-1">квизов пройдено</div>
    </div>
    <div class="text-center p-4 rounded-lg bg-surface-elevated border border-border">
      <div class="text-2xl font-bold text-deep">{{ stats.streak }}</div>
      <div class="text-xs text-text-muted mt-1">дней подряд</div>
    </div>
  </div>
</template>
