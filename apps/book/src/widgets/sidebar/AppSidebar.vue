<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@book/i18n'
import { useBookConfig, useSidebarStore } from '@/features/navigation'
import SidebarSection from './SidebarSection.vue'

const { t } = useI18n()
const route = useRoute()
const { sections } = useBookConfig()
const sidebar = useSidebarStore()

const currentSection = computed(() => route.params.section as string)
const currentChapter = computed(() => route.params.chapter as string)

const githubUrl = import.meta.env.VITE_GITHUB_URL ?? 'https://github.com/bananchill/learning_book'
</script>

<template>
  <!-- Затемнение для мобильной версии -->
  <div
    v-if="sidebar.isMobile && sidebar.isOpen"
    class="fixed inset-0 bg-black/30 z-40"
    @click="sidebar.close()"
  />

  <aside
    class="fixed top-14 left-0 bottom-0 w-72 bg-surface border-r border-border flex flex-col transition-transform duration-300 z-40"
    :class="sidebar.isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
      <SidebarSection
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :is-active="section.id === currentSection"
        :active-chapter-id="currentChapter"
      />
    </nav>

    <div class="shrink-0 border-t border-border p-4">
      <a
        :href="githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        {{ t('nav.github') }}
      </a>
    </div>
  </aside>
</template>
