import { ref, watch, toRef, toValue, computed, type MaybeRefOrGetter } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useCodeRunner } from './useCodeRunner'
import { useCodeHistory } from './useCodeHistory'
import { formatCode } from '../lib/codeFormatter'

export interface UseTestRunnerOptions {
  autoRun?: boolean
  debounceMs?: number
  /** Ключ для localStorage-персистенции. Если не передан — код не сохраняется */
  persistenceKey?: string
}

// Обёртка над useCodeRunner с авто-запуском, дебаунсом, персистенцией и форматированием
export function useTestRunner(
  starterCode: MaybeRefOrGetter<string>,
  testCode: MaybeRefOrGetter<string>,
  options: UseTestRunnerOptions = {},
) {
  const { autoRun = true, debounceMs = 800, persistenceKey } = options

  const getInitialCode = () => toValue(starterCode)

  const tests = toRef(testCode)
  const runner = useCodeRunner()

  // Код с опциональной персистенцией
  const history = persistenceKey
    ? useCodeHistory(persistenceKey, getInitialCode())
    : null

  const code = history ? history.code : ref(getInitialCode())

  const canUndo = history ? history.canUndo : computed(() => false)
  const canRedo = history ? history.canRedo : computed(() => false)

  function run() {
    runner.run(code.value, tests.value)
  }

  function reset() {
    const initial = getInitialCode()
    if (history) {
      history.reset(initial)
    } else {
      code.value = initial
    }
    runner.testResults.value = []
    runner.consoleLogs.value = []
    runner.error.value = null
  }

  function updateCode(newCode: string) {
    code.value = newCode
    history?.push(newCode)
  }

  function undo() {
    const restored = history?.undo()
    if (restored !== undefined) {
      code.value = restored
    }
  }

  function redo() {
    const restored = history?.redo()
    if (restored !== undefined) {
      code.value = restored
    }
  }

  function format() {
    const formatted = formatCode(code.value)
    if (formatted !== code.value) {
      updateCode(formatted)
    }
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
    canUndo,
    canRedo,
    run,
    reset,
    updateCode,
    undo,
    redo,
    format,
  }
}
