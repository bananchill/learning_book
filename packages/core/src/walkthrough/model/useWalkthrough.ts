import { ref, computed } from 'vue'
import type { Walkthrough, WalkthroughStep } from '@book/shared'

export function useWalkthrough(data: Walkthrough) {
  const currentStepIndex = ref(0)

  const totalSteps = computed(() => data.steps.length)
  const currentStep = computed<WalkthroughStep | null>(
    () => data.steps[currentStepIndex.value] ?? null,
  )
  const isFirst = computed(() => currentStepIndex.value === 0)
  const isLast = computed(() => currentStepIndex.value === totalSteps.value - 1)

  function next() {
    if (!isLast.value) currentStepIndex.value++
  }

  function prev() {
    if (!isFirst.value) currentStepIndex.value--
  }

  function goTo(index: number) {
    if (index >= 0 && index < totalSteps.value) {
      currentStepIndex.value = index
    }
  }

  function reset() {
    currentStepIndex.value = 0
  }

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    isFirst,
    isLast,
    code: data.code,
    title: data.title,
    next,
    prev,
    goTo,
    reset,
  }
}
