<script setup lang="ts">
defineProps<{
  icon?: string
}>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 text-sm text-text-secondary">
    <span v-if="icon" class="text-base" aria-hidden="true" v-html="icon" />
    <slot />
  </span>
</template>
