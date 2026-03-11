<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const route = useRoute()

const navItems = [
  { to: '/', name: 'dashboard', labelKey: 'admin.nav.dashboard' },
  { to: '/chapters', name: 'chapters', labelKey: 'admin.nav.chapters' },
  { to: '/pipelines', name: 'pipelines', labelKey: 'admin.nav.pipelines' },
  { to: '/settings', name: 'settings', labelKey: 'admin.nav.settings' },
]

function isActive(item: { to: string; name: string }) {
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}
</script>

<template>
  <aside class="w-60 shrink-0 bg-surface border-r border-border min-h-screen">
    <div class="p-4">
      <router-link to="/" class="block font-semibold text-lg text-text mb-6">
        {{ t('admin.title') }}
      </router-link>
      <nav class="space-y-1">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item)
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:bg-surface-muted hover:text-text',
          ]"
        >
          {{ t(item.labelKey) }}
        </router-link>
      </nav>
    </div>
  </aside>
</template>
