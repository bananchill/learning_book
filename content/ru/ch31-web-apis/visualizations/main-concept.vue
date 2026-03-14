<script setup lang="ts">
import { ref, computed } from 'vue'

// Демонстрация жизненного цикла fetch запроса
type FetchPhase = 'idle' | 'sending' | 'waiting' | 'receiving' | 'parsing' | 'done' | 'error'

const phase = ref<FetchPhase>('idle')
const responseStatus = ref<number | null>(null)
const simulateError = ref(false)

const phases: { id: FetchPhase; label: string; duration: number }[] = [
  { id: 'sending', label: 'Отправка запроса', duration: 500 },
  { id: 'waiting', label: 'Ожидание ответа сервера', duration: 800 },
  { id: 'receiving', label: 'Получение Response', duration: 400 },
  { id: 'parsing', label: 'Парсинг JSON (response.json())', duration: 300 },
  { id: 'done', label: 'Данные готовы', duration: 0 },
]

const errorPhases: { id: FetchPhase; label: string; duration: number }[] = [
  { id: 'sending', label: 'Отправка запроса', duration: 500 },
  { id: 'waiting', label: 'Ожидание ответа сервера', duration: 800 },
  { id: 'receiving', label: 'Получение Response (status: 404)', duration: 400 },
  { id: 'error', label: 'Ошибка: response.ok = false!', duration: 0 },
]

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function simulate() {
  phase.value = 'idle'
  responseStatus.value = null
  const steps = simulateError.value ? errorPhases : phases

  for (const step of steps) {
    phase.value = step.id
    if (step.id === 'receiving') {
      responseStatus.value = simulateError.value ? 404 : 200
    }
    if (step.duration > 0) {
      await delay(step.duration)
    }
  }
}

function reset() {
  phase.value = 'idle'
  responseStatus.value = null
}

const phaseColors: Record<FetchPhase, string> = {
  idle: 'bg-gray-100 text-gray-500',
  sending: 'bg-yellow-100 text-yellow-800',
  waiting: 'bg-blue-100 text-blue-800',
  receiving: 'bg-purple-100 text-purple-800',
  parsing: 'bg-indigo-100 text-indigo-800',
  done: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800'
}
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Жизненный цикл fetch запроса</h3>

    <!-- Фазы -->
    <div class="space-y-2 mb-4">
      <div
        v-for="p in (simulateError ? errorPhases : phases)"
        :key="p.id"
        class="flex items-center gap-3 p-2 rounded-lg transition-all"
        :class="[
          phase === p.id ? phaseColors[p.id] + ' ring-2 ring-offset-1' : 'bg-gray-50',
          phases.findIndex(x => x.id === phase) > phases.findIndex(x => x.id === p.id) ||
          errorPhases.findIndex(x => x.id === phase) > errorPhases.findIndex(x => x.id === p.id)
            ? 'opacity-60' : ''
        ]"
      >
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          :class="phase === p.id ? 'bg-current' : 'bg-gray-300'"
        >
          <span v-if="p.id === 'done'" class="text-green-600">✓</span>
          <span v-else-if="p.id === 'error'" class="text-red-600">✗</span>
          <span v-else class="text-gray-600">{{ phases.indexOf(p) + 1 || errorPhases.indexOf(p) + 1 }}</span>
        </div>
        <span class="text-sm font-medium">{{ p.label }}</span>
        <span
          v-if="p.id === 'receiving' && responseStatus"
          class="ml-auto text-sm font-mono px-2 py-0.5 rounded"
          :class="responseStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
        >
          {{ responseStatus }}
        </span>
      </div>
    </div>

    <!-- Важное замечание -->
    <div
      v-if="phase === 'error'"
      class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-4"
    >
      fetch НЕ выбросил исключение! response.ok === false.
      Нужно самому проверить и выбросить ошибку.
    </div>

    <!-- Управление -->
    <div class="flex gap-3 items-center">
      <button
        @click="simulate"
        :disabled="phase !== 'idle' && phase !== 'done' && phase !== 'error'"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        Симулировать запрос
      </button>
      <button @click="reset" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
        Сброс
      </button>
      <label class="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" v-model="simulateError" class="rounded" />
        404 ошибка
      </label>
    </div>
  </div>
</template>
