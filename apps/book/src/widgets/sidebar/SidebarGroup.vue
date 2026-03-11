<script setup lang="ts">
import { ref } from 'vue'
import type { ChapterGroupMeta } from '@book/shared'
import SidebarChapter from './SidebarChapter.vue'

const props = defineProps<{
  group: ChapterGroupMeta
  sectionId: string
  subsectionId: string
  activeChapterId?: string
}>()

const hasActiveChapter = props.activeChapterId
  ? props.group.chapters.some(c => c.id === props.activeChapterId)
  : false

const isExpanded = ref(hasActiveChapter)
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium uppercase tracking-wide transition-colors"
      :class="hasActiveChapter
        ? 'text-[var(--color-text-secondary)]'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'"
      @click="isExpanded = !isExpanded"
    >
      <svg
        class="w-2.5 h-2.5 transition-transform"
        :class="isExpanded && 'rotate-90'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M6 4l8 6-8 6V4z" />
      </svg>
      <span>{{ group.title }}</span>
    </button>
    <div v-show="isExpanded" class="ml-3 space-y-0.5">
      <SidebarChapter
        v-for="chapter in group.chapters"
        :key="chapter.id"
        :chapter="chapter"
        :section-id="sectionId"
        :subsection-id="subsectionId"
        :is-active="chapter.id === activeChapterId"
      />
    </div>
  </div>
</template>
