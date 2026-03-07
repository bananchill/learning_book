import { ref, shallowRef, onUnmounted } from 'vue'
import type { TestResult, ConsoleEntry } from '@book/shared'

// Управление Web Worker для выполнения кода
export function useCodeRunner() {
  const isRunning = ref(false)
  const error = ref<string | null>(null)
  const testResults = shallowRef<TestResult[]>([])
  const consoleLogs = shallowRef<ConsoleEntry[]>([])

  let worker: Worker | null = null

  function createWorker(): Worker {
    return new Worker(
      new URL('../lib/sandboxWorker.ts', import.meta.url),
      { type: 'module' },
    )
  }

  function run(code: string, testCode: string) {
    // Пересоздаём воркер каждый раз для чистого состояния
    if (worker) {
      worker.terminate()
    }
    worker = createWorker()

    isRunning.value = true
    error.value = null
    testResults.value = []
    consoleLogs.value = []

    worker.onmessage = (event) => {
      const data = event.data
      if (data.type === 'result') {
        testResults.value = data.testResults
        consoleLogs.value = data.consoleLogs
        error.value = data.error || null
        isRunning.value = false
      }
    }

    worker.onerror = (err) => {
      error.value = err.message || 'Неизвестная ошибка воркера'
      isRunning.value = false
    }

    worker.postMessage({ type: 'run', code, testCode })
  }

  function terminate() {
    if (worker) {
      worker.terminate()
      worker = null
      isRunning.value = false
    }
  }

  onUnmounted(terminate)

  return {
    isRunning,
    error,
    testResults,
    consoleLogs,
    run,
    terminate,
  }
}
