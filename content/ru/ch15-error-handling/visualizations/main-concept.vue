<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm select-none">
    <h2 class="text-lg font-bold mb-4 text-red-400">Поток обработки ошибок</h2>

    <div class="flex gap-2 mb-6">
      <button
        v-for="s in scenarios"
        :key="s.id"
        @click="activeId = s.id"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === s.id ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >{{ s.label }}</button>
    </div>

    <div v-if="current" class="space-y-1">
      <div
        v-for="(step, idx) in current.steps"
        :key="idx"
        :class="[
          'flex items-center gap-3 px-4 py-2 rounded-lg border',
          step.active ? 'border-red-400 bg-red-900/20 text-white' :
          step.skipped ? 'border-gray-800 bg-gray-900/30 text-gray-600 opacity-50' :
          'border-gray-700 bg-gray-900 text-gray-300'
        ]"
      >
        <span :class="[
          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
          step.block === 'try' ? 'bg-blue-900 text-blue-300' :
          step.block === 'catch' ? 'bg-yellow-900 text-yellow-300' :
          step.block === 'finally' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-400'
        ]">{{ idx + 1 }}</span>
        <span v-if="step.block" :class="[
          'text-xs px-1.5 py-0.5 rounded mr-1 font-semibold',
          step.block === 'try' ? 'bg-blue-900/50 text-blue-300' :
          step.block === 'catch' ? 'bg-yellow-900/50 text-yellow-300' :
          'bg-green-900/50 text-green-300'
        ]">{{ step.block }}</span>
        <span class="text-xs">{{ step.text }}</span>
        <span v-if="step.output" class="ml-auto text-xs text-gray-400">→ {{ step.output }}</span>
        <span v-if="step.skipped" class="ml-auto text-xs text-gray-600">пропущено</span>
      </div>
    </div>

    <div v-if="current" class="mt-4 bg-gray-900 rounded-lg p-3">
      <div class="text-xs text-gray-400 mb-1">Итог:</div>
      <p class="text-gray-300 text-xs">{{ current.summary }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  block?: 'try' | 'catch' | 'finally'
  text: string
  output?: string
  active?: boolean
  skipped?: boolean
}
interface Scenario { id: string; label: string; steps: Step[]; summary: string }

const scenarios: Scenario[] = [
  {
    id: 'no-error',
    label: 'Без ошибки',
    summary: 'try и finally выполняются, catch — пропускается.',
    steps: [
      { block: 'try', text: 'Начало try', active: true },
      { block: 'try', text: 'successOperation()', output: '"данные"', active: true },
      { block: 'try', text: 'Конец try', active: true },
      { block: 'catch', text: 'catch (error)', skipped: true },
      { block: 'finally', text: 'finally — выполняется всегда', output: 'cleanup()', active: true },
      { text: 'Код после try/catch продолжается', active: true }
    ]
  },
  {
    id: 'with-error',
    label: 'С ошибкой',
    summary: 'При ошибке в try — прыжок в catch, затем finally. Код после ошибки в try пропускается.',
    steps: [
      { block: 'try', text: 'Начало try', active: true },
      { block: 'try', text: 'throw new Error("Ошибка!")', output: 'исключение!', active: true },
      { block: 'try', text: 'код после throw', skipped: true },
      { block: 'catch', text: 'catch(error) — перехватываем', output: 'error.message = "Ошибка!"', active: true },
      { block: 'finally', text: 'finally — выполняется всегда', active: true },
      { text: 'Код после try/catch продолжается', active: true }
    ]
  },
  {
    id: 'rethrow',
    label: 'Проброс ошибки',
    summary: 'Перехватили, но пробросили неизвестную ошибку выше — она дойдёт до внешнего catch.',
    steps: [
      { block: 'try', text: 'riskyOp() — бросает NetworkError', active: true },
      { block: 'catch', text: 'catch(error)', active: true },
      { block: 'catch', text: 'if (error instanceof NetworkError) — НЕТ', active: true },
      { block: 'catch', text: 'throw error — пробрасываем неизвестное!', output: 'выброс!', active: true },
      { block: 'finally', text: 'finally — всё равно выполняется', active: true },
      { text: 'код после try/catch НЕ выполняется (ошибка пробросилась)', skipped: true }
    ]
  }
]

const activeId = ref('no-error')
const current = computed(() => scenarios.find(s => s.id === activeId.value))
</script>
