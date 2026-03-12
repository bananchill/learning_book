<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from '@book/i18n'
import { BaseCard } from '@book/ui'
import { useStatsStore, useChaptersStore } from '@/features/admin-api'
import { StatsOverview } from '@/widgets/stats-overview'

const { t } = useI18n()
const statsStore = useStatsStore()
const chaptersStore = useChaptersStore()

onMounted(() => {
  statsStore.fetchStats()
  chaptersStore.fetchChapters()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Ошибки -->
    <div v-if="statsStore.error || chaptersStore.error" class="rounded-lg bg-danger-light text-danger px-4 py-3 text-sm">
      {{ statsStore.error || chaptersStore.error }}
    </div>

    <!-- Статистика -->
    <StatsOverview v-if="statsStore.stats" :stats="statsStore.stats" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Покрытие контентом -->
      <BaseCard v-if="statsStore.stats">
        <h3 class="font-semibold mb-4">{{ t('admin.dashboard.content_coverage') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.dashboard.chapters_with_content') }}</span>
            <span class="font-medium text-success">{{ statsStore.stats.chaptersWithContent }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.dashboard.chapters_empty') }}</span>
            <span class="font-medium text-warning">{{ statsStore.stats.chaptersEmpty }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.chapters.tasks') }}</span>
            <span class="font-medium">{{ statsStore.stats.contentCoverage.tasks }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.chapters.quiz') }}</span>
            <span class="font-medium">{{ statsStore.stats.contentCoverage.quiz }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.chapters.interview') }}</span>
            <span class="font-medium">{{ statsStore.stats.contentCoverage.interview }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-secondary">{{ t('admin.chapters.walkthrough') }}</span>
            <span class="font-medium">{{ statsStore.stats.contentCoverage.walkthrough }}</span>
          </div>
        </div>
      </BaseCard>

      <!-- Последние главы -->
      <BaseCard>
        <h3 class="font-semibold mb-4">{{ t('admin.dashboard.recent_chapters') }}</h3>
        <div v-if="chaptersStore.chapters.length" class="space-y-2">
          <router-link
            v-for="ch in chaptersStore.chapters.slice(0, 5)"
            :key="ch.id"
            :to="{ name: 'chapter-detail', params: { chapterId: ch.id } }"
            class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-muted transition-colors"
          >
            <div>
              <p class="font-medium text-sm">{{ ch.title }}</p>
              <p class="text-xs text-text-secondary">{{ ch.sectionTitle }}</p>
            </div>
            <span class="text-xs text-text-secondary">
              {{ ch.taskCount }} {{ t('admin.chapters.tasks').toLowerCase() }}
            </span>
          </router-link>
        </div>
        <p v-else class="text-sm text-text-secondary">
          {{ t('admin.chapters.no_chapters') }}
        </p>
      </BaseCard>
    </div>
  </div>
</template>
