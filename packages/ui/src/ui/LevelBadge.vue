<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  level: 'junior' | 'middle' | 'senior'
}>()

const { t } = useI18n()

const badgeClasses: Record<string, string> = {
  junior: 'bg-success-light text-success-text',
  middle: 'bg-warning-light text-warning-text',
  senior: 'bg-danger-light text-danger-text',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
      badgeClasses[level],
    ]"
  >
    {{ t(`interview.level.${level}`) }}
  </span>
</template>
