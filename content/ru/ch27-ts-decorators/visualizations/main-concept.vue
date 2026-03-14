<script setup lang="ts">
import { ref, computed } from 'vue'

// Анимация порядка применения декораторов
interface DecoratorStep {
  id: number
  decorator: string
  phase: 'evaluate' | 'apply'
  description: string
  color: string
}

const steps: DecoratorStep[] = [
  { id: 1, decorator: '@A', phase: 'evaluate', description: 'Фабрика @A вычисляется первой', color: 'blue' },
  { id: 2, decorator: '@B', phase: 'evaluate', description: 'Фабрика @B вычисляется второй', color: 'purple' },
  { id: 3, decorator: '@B', phase: 'apply', description: 'Декоратор @B применяется первым (ближе к методу)', color: 'purple' },
  { id: 4, decorator: '@A', phase: 'apply', description: 'Декоратор @A применяется вторым (внешний)', color: 'blue' },
]

const currentStep = ref(0)
const isPlaying = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

function play() {
  if (currentStep.value >= steps.length - 1) {
    currentStep.value = 0
  }
  isPlaying.value = true
  advance()
}

function advance() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    timer = setTimeout(advance, 1000)
  } else {
    isPlaying.value = false
  }
}

function reset() {
  if (timer) clearTimeout(timer)
  isPlaying.value = false
  currentStep.value = 0
}

const activeSteps = computed(() => steps.slice(0, currentStep.value + 1))

const phaseLabel = (phase: string) => phase === 'evaluate' ? 'Вычисление' : 'Применение'
const phaseColor = (phase: string) => phase === 'evaluate'
  ? 'bg-yellow-100 text-yellow-800'
  : 'bg-green-100 text-green-800'
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Порядок применения декораторов</h3>

    <!-- Код -->
    <div class="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm">
      <div class="text-blue-300">@A <span class="text-gray-500">← применяется вторым</span></div>
      <div class="text-purple-300">@B <span class="text-gray-500">← применяется первым</span></div>
      <div class="text-yellow-300">method() <span class="text-gray-500">{ ... }</span></div>
    </div>

    <!-- Шаги -->
    <div class="space-y-2 mb-4">
      <div
        v-for="step in steps"
        :key="step.id"
        class="flex items-center gap-3 p-2 rounded-lg transition-all"
        :class="activeSteps.find(s => s.id === step.id)
          ? 'bg-gray-50 opacity-100'
          : 'opacity-30'"
      >
        <span class="text-xs font-bold w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
          {{ step.id }}
        </span>
        <span
          class="px-2 py-0.5 rounded text-xs font-mono font-bold"
          :class="step.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'"
        >
          {{ step.decorator }}
        </span>
        <span
          class="px-2 py-0.5 rounded text-xs"
          :class="phaseColor(step.phase)"
        >
          {{ phaseLabel(step.phase) }}
        </span>
        <span class="text-sm text-gray-600">{{ step.description }}</span>
      </div>
    </div>

    <!-- Управление -->
    <div class="flex gap-2">
      <button
        @click="play"
        :disabled="isPlaying"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        {{ currentStep === 0 ? 'Запустить' : 'Ещё раз' }}
      </button>
      <button
        @click="reset"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        Сбросить
      </button>
    </div>
  </div>
</template>
