import { ref, computed } from 'vue'
import type { Task, TestResult } from '@book/shared'

export function useTask(task: Task) {
  const isSolved = ref(false)
  const code = ref(task.description) // начальный код будет из starterCode
  const lastResults = ref<TestResult[]>([])

  const passedCount = computed(
    () => lastResults.value.filter((r) => r.status === 'pass').length,
  )
  const totalCount = computed(() => lastResults.value.length)
  const allPassed = computed(
    () => totalCount.value > 0 && passedCount.value === totalCount.value,
  )

  function onTestResults(results: TestResult[]) {
    lastResults.value = results
    if (allPassed.value) {
      isSolved.value = true
    }
  }

  function reset() {
    isSolved.value = false
    lastResults.value = []
  }

  return {
    isSolved,
    code,
    lastResults,
    passedCount,
    totalCount,
    allPassed,
    onTestResults,
    reset,
  }
}
