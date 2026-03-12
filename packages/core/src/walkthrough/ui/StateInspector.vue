<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { WalkthroughStep } from '@book/shared'

defineProps<{
  step: WalkthroughStep
}>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4 text-sm">
    <!-- Переменные -->
    <div>
      <h4 class="font-medium text-text-secondary mb-2">{{ t('walkthrough.variables') }}</h4>
      <div class="space-y-1">
        <div
          v-for="(value, name) in step.variables"
          :key="name"
          class="flex justify-between px-3 py-1.5 rounded bg-surface-muted"
        >
          <span class="font-mono text-primary">{{ name }}</span>
          <span class="font-mono text-text">{{ value }}</span>
        </div>
        <div v-if="Object.keys(step.variables).length === 0" class="text-text-muted text-xs px-3">
          —
        </div>
      </div>
    </div>

    <!-- Call Stack -->
    <div>
      <h4 class="font-medium text-text-secondary mb-2">{{ t('walkthrough.call_stack') }}</h4>
      <div class="space-y-0.5">
        <div
          v-for="(frame, i) in step.callStack"
          :key="i"
          class="px-3 py-1.5 rounded font-mono text-xs"
          :class="i === 0 ? 'bg-primary-light text-primary font-medium' : 'bg-surface-muted text-text-secondary'"
        >
          {{ frame }}
        </div>
      </div>
    </div>

    <!-- Вывод -->
    <div v-if="step.output?.length">
      <h4 class="font-medium text-text-secondary mb-2">{{ t('walkthrough.output') }}</h4>
      <div class="bg-surface-inset rounded px-3 py-2 font-mono text-xs text-text space-y-0.5">
        <div v-for="(line, i) in step.output" :key="i">{{ line }}</div>
      </div>
    </div>
  </div>
</template>
