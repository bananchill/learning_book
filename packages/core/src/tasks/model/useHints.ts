import { ref, computed } from 'vue'

// Управление 3-уровневыми подсказками
export function useHints(hints: string[]) {
  const revealedLevel = ref(0) // 0 = нет подсказок, 1-3 = уровень
  const pendingConfirm = ref(false)

  const currentHints = computed(() => hints.slice(0, revealedLevel.value))
  const hasMore = computed(() => revealedLevel.value < hints.length)
  const nextLevel = computed(() => revealedLevel.value + 1)

  function requestHint() {
    if (!hasMore.value) return

    // Уровень 1 — бесплатно
    if (revealedLevel.value === 0) {
      revealedLevel.value = 1
      return
    }

    // Уровни 2-3 — требуют подтверждения
    pendingConfirm.value = true
  }

  function confirmHint() {
    if (pendingConfirm.value && hasMore.value) {
      revealedLevel.value++
      pendingConfirm.value = false
    }
  }

  function cancelHint() {
    pendingConfirm.value = false
  }

  function reset() {
    revealedLevel.value = 0
    pendingConfirm.value = false
  }

  return {
    revealedLevel,
    currentHints,
    hasMore,
    nextLevel,
    pendingConfirm,
    requestHint,
    confirmHint,
    cancelHint,
    reset,
  }
}
