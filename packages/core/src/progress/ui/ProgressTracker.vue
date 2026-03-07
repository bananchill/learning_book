<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { useProgressStore } from '../model/useProgressStore'
import ProgressStats from './ProgressStats.vue'
import ChapterProgressCard from './ChapterProgressCard.vue'

const { t } = useI18n()
const store = useProgressStore()

const chapters = Object.values(store.allChapters)
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-lg font-semibold text-text">{{ t('progress.overall') }}</h3>

    <!-- Статистика -->
    <ProgressStats />

    <!-- Прогресс по главам -->
    <div v-if="chapters.length > 0" class="space-y-3">
      <ChapterProgressCard
        v-for="ch in chapters"
        :key="ch.chapterId"
        :chapter-id="ch.chapterId"
        :title="ch.chapterId"
      />
    </div>

    <div v-else class="text-center text-text-muted text-sm py-8">
      {{ t('progress.not_started') }}
    </div>
  </div>
</template>
