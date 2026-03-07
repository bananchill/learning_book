<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Difficulty } from '@book/shared'

defineProps<{
  level: Difficulty
}>()

const { t } = useI18n()

const badgeClasses: Record<Difficulty, string> = {
  easy: 'bg-success-light text-success-text',
  medium: 'bg-warning-light text-warning-text',
  hard: 'bg-danger-light text-danger-text',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      badgeClasses[level],
    ]"
  >
    {{ t(`difficulty.${level}`) }}
  </span>
</template>
