<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'dashboard': return t('admin.dashboard.title')
    case 'chapters': return t('admin.chapters.title')
    case 'chapter-detail': return t('admin.chapter_detail.title', { name: route.params.chapterId as string })
    case 'pipelines': return t('admin.pipelines.title')
    case 'settings': return t('admin.settings.title')
    default: return ''
  }
})
</script>

<template>
  <header class="sticky top-0 z-[var(--z-sticky)] bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
    <div class="flex items-center h-14 px-6">
      <h1 class="text-lg font-semibold text-[var(--color-text)]">{{ pageTitle }}</h1>
    </div>
  </header>
</template>
