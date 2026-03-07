<script setup lang="ts">
withDefaults(defineProps<{
  value: number
  max?: number
  size?: 'sm' | 'md'
}>(), {
  max: 100,
  size: 'md',
})
</script>

<template>
  <div
    class="bg-surface-muted rounded-full overflow-hidden"
    :class="size === 'sm' ? 'h-1.5' : 'h-2'"
  >
    <div
      class="h-full rounded-full transition-all duration-slow"
      :class="value >= max ? 'bg-success' : 'bg-primary'"
      :style="{ width: Math.min((value / max) * 100, 100) + '%' }"
    />
  </div>
</template>
