<script setup lang="ts">
defineProps<{
  padding?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-border bg-surface-elevated shadow-sm',
      (padding ?? true) && 'p-6',
    ]"
  >
    <slot />
  </div>
</template>
