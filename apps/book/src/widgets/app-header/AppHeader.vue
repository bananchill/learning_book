<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import { useRoute } from 'vue-router'
import { useTheme } from '@book/shared'
import { useSidebarStore, useBreadcrumbs } from '@/features/navigation'

const { t } = useI18n()
const route = useRoute()
const sidebar = useSidebarStore()
const { breadcrumbs } = useBreadcrumbs()
const { isDark, toggle: toggleTheme } = useTheme()

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

      <!-- Переключатель темы -->
      <button
        class="p-2 rounded-lg hover:bg-surface-muted transition-colors"
        :aria-label="t('theme.toggle')"
        :title="isDark ? t('theme.light') : t('theme.dark')"
        @click="toggleTheme()"
      >
        <!-- Солнце (показывается в dark-режиме) -->
        <svg v-if="isDark" class="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Луна (показывается в light-режиме) -->
        <svg v-else class="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </header>
</template>
