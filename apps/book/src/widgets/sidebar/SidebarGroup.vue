<script setup lang="ts">
import { ref } from 'vue'
import type { ChapterGroupMeta } from '@book/shared'
import SidebarChapter from './SidebarChapter.vue'
import { useSidebarContext } from './useSidebarContext'

const props = defineProps<{
  group: ChapterGroupMeta
}>()

const { activeChapterId } = useSidebarContext()

const hasActiveChapter = activeChapterId.value
  ? props.group.chapters.some(c => c.id === activeChapterId.value)
  : false

const isExpanded = ref(hasActiveChapter)
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium uppercase tracking-wide transition-colors"
      :class="hasActiveChapter
        ? 'text-text-secondary'
        : 'text-text-muted hover:text-text-secondary'"
      @click="isExpanded = !isExpanded"
    >
      <svg
        class="w-2.5 h-2.5 transition-transform"
        :class="isExpanded && 'rotate-90'"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
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
        :is-active="chapter.id === activeChapterId"
      />
    </div>
  </div>
</template>
