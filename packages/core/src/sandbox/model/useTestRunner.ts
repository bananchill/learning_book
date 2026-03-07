import { ref, watch, toRef, type MaybeRefOrGetter } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useCodeRunner } from './useCodeRunner'

interface UseTestRunnerOptions {
  autoRun?: boolean
  debounceMs?: number
}

// Обёртка над useCodeRunner с авто-запуском и дебаунсом
export function useTestRunner(
  starterCode: MaybeRefOrGetter<string>,
  testCode: MaybeRefOrGetter<string>,
  options: UseTestRunnerOptions = {},
) {
  const { autoRun = true, debounceMs = 800 } = options

  const code = ref(typeof starterCode === 'function' ? starterCode() : typeof starterCode === 'string' ? starterCode : starterCode)
  const tests = toRef(testCode)
  const runner = useCodeRunner()

  function run() {
    runner.run(code.value, tests.value)
  }

  function reset() {
    const initial = typeof starterCode === 'function'
      ? (starterCode as () => string)()
      : typeof starterCode === 'string'
        ? starterCode
        : (starterCode as { value: string }).value
    code.value = initial
    runner.testResults.value = []
    runner.consoleLogs.value = []
    runner.error.value = null
  }

  function updateCode(newCode: string) {
    code.value = newCode
  }

  // Дебаунсированный авто-запуск
  const debouncedRun = useDebounceFn(run, debounceMs)

  if (autoRun) {
    watch(code, () => {
      debouncedRun()
    })
  }

  return {
    code,
    isRunning: runner.isRunning,
    error: runner.error,
    testResults: runner.testResults,
    consoleLogs: runner.consoleLogs,
    run,
    reset,
    updateCode,
  }
}
