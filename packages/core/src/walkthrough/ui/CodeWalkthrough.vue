<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { Walkthrough } from '@book/shared'
import { useWalkthrough } from '../model/useWalkthrough'
import { useAutoPlay } from '../model/useAutoPlay'
import CodeDisplay from './CodeDisplay.vue'
import StateInspector from './StateInspector.vue'
import StepControls from './StepControls.vue'

const props = defineProps<{
  data: Walkthrough
}>()

const { t } = useI18n()

const walkthrough = useWalkthrough(props.data)
const autoPlay = useAutoPlay(() => {
  if (walkthrough.isLast.value) {
    autoPlay.pause()
  } else {
    walkthrough.next()
  }
})
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden">

    <!-- Заголовок -->
    <div class="px-4 py-3 border-b border-border bg-surface">
      <h3 class="text-sm font-semibold text-text">{{ t('walkthrough.title') }}</h3>
      <p v-if="walkthrough.title" class="text-xs text-text-secondary mt-0.5">{{ walkthrough.title }}</p>
    </div>

    <!-- Контент: код + состояние -->
    <div class="flex flex-col divide-y lg:divide-y-0 lg:divide-x divide-border">

      <!-- Код -->
      <div class="flex-1 w-full py-3">
        <CodeDisplay
          :code="walkthrough.code"
          :active-line="walkthrough.currentStep.value?.line"
        />
      </div>

      <!-- Состояние -->
      <div class="w-full lg:w-72 p-4">
        <StateInspector
          v-if="walkthrough.currentStep.value"
          :step="walkthrough.currentStep.value"
        />
      </div>
    </div>

    <!-- Объяснение шага -->
    <div v-if="walkthrough.currentStep.value" class="px-4 py-3 border-t border-border bg-surface-muted">
      <p class="text-sm text-text leading-relaxed">
        {{ walkthrough.currentStep.value.description }}
      </p>
    </div>

    <!-- Контролы -->
    <StepControls
      :current-step="walkthrough.currentStepIndex.value"
      :total-steps="walkthrough.totalSteps.value"
      :is-first="walkthrough.isFirst.value"
      :is-last="walkthrough.isLast.value"
      :is-playing="autoPlay.isPlaying.value"
      @prev="walkthrough.prev"
      @next="walkthrough.next"
      @toggle-play="autoPlay.toggle"
      @reset="walkthrough.reset"
    />
  </div>
</template>
