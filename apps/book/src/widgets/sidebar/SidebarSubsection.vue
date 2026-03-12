<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { SubsectionMeta } from '@book/shared'
import SidebarGroup from './SidebarGroup.vue'
import { useSidebarContext, provideSidebarContext } from './useSidebarContext'

const props = defineProps<{
  subsection: SubsectionMeta
}>()

const { activeChapterId, sectionId } = useSidebarContext()

const hasActive = activeChapterId.value
  ? props.subsection.groups.some(g => g.chapters.some(c => c.id === activeChapterId.value))
  : false

const isExpanded = ref(hasActive)

// Переопределяем subsectionId для дочерних компонентов
provideSidebarContext({
  sectionId,
  subsectionId: toRef(() => props.subsection.id),
  activeChapterId,
})
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
      :class="hasActive
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
        aria-hidden="true"
      >
        <path d="M6 4l8 6-8 6V4z" />
      </svg>
    </button>

    <div v-show="isExpanded" class="ml-3 mt-1 space-y-2">
      <SidebarGroup
        v-for="group in subsection.groups"
        :key="group.id"
        :group="group"
      />
    </div>
  </div>
</template>
