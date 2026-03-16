<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCollapsible } from '../lib/useCollapsible'

defineProps<{
  title: string
}>()

const { t } = useI18n()
const { isOpen, toggle } = useCollapsible()
</script>

<template>
  <div class="my-4 rounded-lg border border-dashed border-deep-border bg-deep-light">
    <button
      class="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left font-medium text-deep-text transition-colors duration-normal hover:bg-deep-light"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <svg
        class="h-4 w-4 shrink-0 transition-transform duration-normal"
        :class="isOpen && 'rotate-90'"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm uppercase tracking-wide">{{ isOpen ? t('deep_dive.collapse') : t('deep_dive.expand') }}</span>
      <span class="text-sm">{{ title }}</span>
    </button>
    <div
      class="grid"
      :style="{
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 300ms ease-out',
      }"
    >
      <div class="overflow-hidden">
        <div class="px-4 pb-4 pt-1 text-text-secondary">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
