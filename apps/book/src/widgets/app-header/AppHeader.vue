<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import { useRoute } from 'vue-router'
import { useSidebarStore, useBreadcrumbs } from '@/features/navigation'

const { t } = useI18n()
const route = useRoute()
const sidebar = useSidebarStore()
const { breadcrumbs } = useBreadcrumbs()

const isChapterPage = computed(() => !!route.params.chapter)
</script>

<template>
  <header class="sticky top-0 z-40 bg-bg/80 backdrop-blur-md border-b border-border">
    <div class="flex items-center h-14 px-4 gap-3">
      <!-- Переключатель боковой панели -->
      <button
        v-if="isChapterPage"
        class="p-2 rounded-lg hover:bg-surface-muted transition-colors"
        :aria-label="t('nav.toggle_sidebar')"
        @click="sidebar.toggle()"
      >
        <svg class="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Логотип -->
      <router-link
        to="/"
        class="font-semibold text-text hover:text-primary transition-colors"
      >
        {{ t('nav.title') }}
      </router-link>

      <!-- Хлебные крошки -->
      <nav
        v-if="breadcrumbs.length > 0"
        class="hidden sm:flex items-center gap-1 text-sm text-text-muted"
      >
        <template v-for="(crumb, i) in breadcrumbs" :key="i">
          <span class="mx-1">/</span>
          <router-link
            v-if="crumb.to"
            :to="crumb.to"
            class="hover:text-primary transition-colors truncate max-w-48"
          >
            {{ crumb.label }}
          </router-link>
          <span v-else class="text-text-secondary truncate max-w-48">
            {{ crumb.label }}
          </span>
        </template>
      </nav>

      <div class="flex-1" />
    </div>
  </header>
</template>
