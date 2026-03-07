<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'

defineProps<{
  currentStep: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
  isPlaying: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
  togglePlay: []
  reset: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 border-t border-border bg-surface">
    <span class="text-xs text-text-muted">
      {{ t('walkthrough.step_of', { current: currentStep + 1, total: totalSteps }) }}
    </span>

    <div class="flex items-center gap-2">
      <BaseButton size="sm" variant="ghost" :disabled="isFirst" @click="emit('reset')">
        ⟲
      </BaseButton>
      <BaseButton size="sm" variant="ghost" :disabled="isFirst" @click="emit('prev')">
        ◀
      </BaseButton>
      <BaseButton size="sm" variant="ghost" @click="emit('togglePlay')">
        {{ isPlaying ? '⏸' : '▶' }}
      </BaseButton>
      <BaseButton size="sm" variant="ghost" :disabled="isLast" @click="emit('next')">
        ▶
      </BaseButton>
    </div>
  </div>
</template>
