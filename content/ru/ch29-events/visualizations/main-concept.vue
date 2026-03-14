<script setup lang="ts">
import { ref } from 'vue'

// Визуализация bubbling/capturing
interface PhaseStep {
  id: number
  element: string
  phase: 'capturing' | 'target' | 'bubbling'
  active: boolean
}

const PHASES = {
  IDLE: 'idle',
  CAPTURING: 'capturing',
  TARGET: 'target',
  BUBBLING: 'bubbling',
  DONE: 'done'
}

const currentPhase = ref<string>(PHASES.IDLE)
const captureMode = ref(false)
const steps = ref<PhaseStep[]>([])
const log = ref<string[]>([])

const elements = ['document', 'body', 'div#app', 'ul#list', 'li (target)']

async function simulate() {
  currentPhase.value = PHASES.CAPTURING
  steps.value = []
  log.value = []

  // Capturing
  for (let i = 0; i < elements.length; i++) {
    await delay(400)
    steps.value.push({
      id: i,
      element: elements[i],
      phase: i === elements.length - 1 ? 'target' : 'capturing',
      active: true
    })
    if (captureMode.value && i < elements.length - 1) {
      log.value.push(`[capturing] обработчик на ${elements[i]}`)
    }
    if (i === elements.length - 1) {
      log.value.push(`[target] обработчики на ${elements[i]}`)
    }
  }

  currentPhase.value = PHASES.BUBBLING
  await delay(300)

  // Bubbling (без target)
  for (let i = elements.length - 2; i >= 0; i--) {
    await delay(400)
    log.value.push(`[bubbling] обработчик на ${elements[i]}`)
  }

  currentPhase.value = PHASES.DONE
}

function reset() {
  currentPhase.value = PHASES.IDLE
  steps.value = []
  log.value = []
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const phaseColor = (phase: string) => ({
  capturing: 'bg-yellow-100 border-yellow-400',
  target: 'bg-red-100 border-red-400',
  bubbling: 'bg-green-100 border-green-400'
})[phase] || 'bg-gray-100'
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Фазы событий: Capturing и Bubbling</h3>

    <div class="flex gap-4 mb-4">
      <button
        @click="simulate"
        :disabled="currentPhase !== 'idle' && currentPhase !== 'done'"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        Симулировать клик
      </button>
      <button
        @click="reset"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        Сброс
      </button>
      <label class="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" v-model="captureMode" class="rounded" />
        Capture обработчики
      </label>
    </div>

    <!-- DOM дерево -->
    <div class="mb-4 space-y-1">
      <div
        v-for="(el, i) in elements"
        :key="i"
        class="flex items-center gap-2 p-2 rounded border-2 transition-all"
        :class="steps.find(s => s.id === i) ? phaseColor(steps.find(s => s.id === i)?.phase || '') : 'bg-gray-50 border-transparent'"
        :style="{ marginLeft: i * 16 + 'px' }"
      >
        <span class="font-mono text-sm">{{ el }}</span>
        <span
          v-if="steps.find(s => s.id === i)"
          class="text-xs px-1 rounded"
          :class="steps.find(s => s.id === i)?.phase === 'target' ? 'bg-red-200 text-red-700' : steps.find(s => s.id === i)?.phase === 'capturing' ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-200'"
        >
          {{ steps.find(s => s.id === i)?.phase }}
        </span>
      </div>
    </div>

    <!-- Лог -->
    <div v-if="log.length" class="bg-gray-900 rounded-lg p-3 font-mono text-xs max-h-32 overflow-y-auto">
      <div
        v-for="(entry, i) in log"
        :key="i"
        class="py-0.5"
        :class="entry.includes('capturing') ? 'text-yellow-300' : entry.includes('target') ? 'text-red-300' : 'text-green-300'"
      >
        {{ entry }}
      </div>
    </div>

    <!-- Легенда -->
    <div class="mt-3 flex gap-4 text-xs text-gray-500 flex-wrap">
      <span><span class="inline-block w-3 h-3 bg-yellow-100 border border-yellow-400 rounded mr-1"></span>Capturing</span>
      <span><span class="inline-block w-3 h-3 bg-red-100 border border-red-400 rounded mr-1"></span>Target</span>
      <span><span class="inline-block w-3 h-3 bg-green-100 border border-green-400 rounded mr-1"></span>Bubbling</span>
    </div>
  </div>
</template>
