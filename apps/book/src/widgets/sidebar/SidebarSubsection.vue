<script setup lang="ts">
import { ref } from 'vue'
import type { SubsectionMeta } from '@book/shared'
import SidebarGroup from './SidebarGroup.vue'

const props = defineProps<{
  subsection: SubsectionMeta
  sectionId: string
  isActive: boolean
  activeChapterId?: string
}>()

const isExpanded = ref(props.isActive)
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
      :class="isActive
        ? 'text-text'
        : 'text-text-secondary hover:text-text hover:bg-surface-muted/50'"
      @click="isExpanded = !isExpanded"
    >
      <span class="flex-1 text-left">{{ subsection.title }}</span>
      <svg
        class="w-3 h-3 transition-transform"
        :class="isExpanded && 'rotate-90'"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M6 4l8 6-8 6V4z" />
      </svg>
    </button>

    <div v-show="isExpanded" class="ml-3 mt-1 space-y-2">
      <SidebarGroup
        v-for="group in subsection.groups"
        :key="group.id"
        :group="group"
        :section-id="sectionId"
        :subsection-id="subsection.id"
        :active-chapter-id="activeChapterId"
      />
    </div>
  </div>
</template>
