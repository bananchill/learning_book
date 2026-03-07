<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@book/i18n'
import type { SectionMeta } from '@book/shared'
import SidebarChapter from './SidebarChapter.vue'

const props = defineProps<{
  section: SectionMeta
  isActive: boolean
  activeChapterId?: string
}>()

const { t } = useI18n()
const isExpanded = ref(props.isActive || props.section.chapters.length > 0)
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      :class="isActive
        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'"
      @click="isExpanded = !isExpanded"
    >
      <span class="flex-1 text-left">{{ section.title }}</span>
      <svg
        class="w-3 h-3 transition-transform"
        :class="isExpanded && 'rotate-90'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M6 4l8 6-8 6V4z" />
      </svg>
    </button>

    <div v-show="isExpanded" class="ml-3 mt-1 space-y-0.5">
      <SidebarChapter
        v-for="chapter in section.chapters"
        :key="chapter.id"
        :chapter="chapter"
        :section-id="section.id"
        :is-active="chapter.id === activeChapterId"
      />

      <div
        v-if="section.chapters.length === 0"
        class="px-3 py-2 text-xs text-[var(--color-text-muted)] italic"
      >
        {{ t('nav.no_chapters') }}
      </div>
    </div>
  </div>
</template>
