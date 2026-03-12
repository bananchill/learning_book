<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useI18n } from '@book/i18n'
import type { SectionMeta } from '@book/shared'
import SidebarSubsection from './SidebarSubsection.vue'
import { provideSidebarContext } from './useSidebarContext'

const props = defineProps<{
  section: SectionMeta
  isActive: boolean
  activeChapterId?: string
}>()

const { t } = useI18n()
const isExpanded = ref(props.isActive || props.section.subsections.length > 0)

provideSidebarContext({
  sectionId: toRef(() => props.section.id),
  subsectionId: ref(''),
  activeChapterId: toRef(() => props.activeChapterId),
})
</script>

<template>
  <div>
    <button
      class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
      :class="isActive
        ? 'bg-primary-light text-primary'
        : 'text-text-secondary hover:bg-surface-muted'"
      @click="isExpanded = !isExpanded"
    >
      <span class="flex-1 text-left">{{ section.title }}</span>
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

    <div v-show="isExpanded" class="ml-3 mt-1 space-y-0.5">
      <SidebarSubsection
        v-for="sub in section.subsections"
        :key="sub.id"
        :subsection="sub"
      />

      <div
        v-if="section.subsections.length === 0"
        class="px-3 py-2 text-xs text-text-muted italic"
      >
        {{ t('nav.no_chapters') }}
      </div>
    </div>
  </div>
</template>
