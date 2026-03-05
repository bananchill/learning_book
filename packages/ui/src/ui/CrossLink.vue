<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  to: string
  title?: string
}>()

const href = computed(() => `/${props.to}`)
const displayTitle = computed(() => props.title ?? props.to.replace(/^ch\d+-/, '').replace(/-/g, ' '))
</script>

<template>
  <a
    :href="href"
    class="inline-flex items-center gap-1 text-primary underline decoration-primary-muted underline-offset-2 transition-colors duration-normal hover:text-primary-hover hover:decoration-primary-hover"
  >
    <span>{{ displayTitle }}</span>
    <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
    </svg>
  </a>
</template>
