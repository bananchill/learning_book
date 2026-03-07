<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookConfig, useSidebarStore } from '@/features/navigation'
import SidebarSection from './SidebarSection.vue'

const route = useRoute()
const { sections } = useBookConfig()
const sidebar = useSidebarStore()

const currentSection = computed(() => route.params.section as string)
const currentChapter = computed(() => route.params.chapter as string)
</script>

<template>
  <!-- Затемнение для мобильной версии -->
  <div
    v-if="sidebar.isMobile && sidebar.isOpen"
    class="fixed inset-0 bg-black/30 z-40"
    @click="sidebar.close()"
  />

  <aside
    class="fixed top-14 left-0 bottom-0 w-72 bg-[var(--color-surface)] border-r border-[var(--color-border)] overflow-y-auto transition-transform duration-300 z-40"
    :class="sidebar.isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="p-4 space-y-1">
      <SidebarSection
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :is-active="section.id === currentSection"
        :active-chapter-id="currentChapter"
      />
    </nav>
  </aside>
</template>
