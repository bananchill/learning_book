<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Анимация цикла for</h2>
    <p class="text-sm text-gray-600 mb-4">Пошаговая визуализация выполнения цикла</p>

    <!-- Настройки -->
    <div class="flex gap-4 mb-4 items-center">
      <div>
        <label class="text-xs text-gray-500">Массив:</label>
        <span class="ml-2 text-sm font-mono text-gray-700">{{ arr.join(', ') }}</span>
      </div>
      <div class="flex gap-2">
        <button @click="reset" class="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">Сброс</button>
        <button @click="stepForward" :disabled="isDone" class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          Следующий шаг →
        </button>
        <button @click="autoPlay" :disabled="isPlaying || isDone" class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
          Авто ▶
        </button>
      </div>
    </div>

    <!-- Визуализация массива -->
    <div class="flex gap-2 mb-4">
      <div v-for="(item, idx) in arr" :key="idx"
        class="w-12 h-12 flex items-center justify-center rounded-lg border-2 text-sm font-bold transition-all"
        :class="[
          idx === currentIndex ? 'bg-blue-500 text-white border-blue-600 scale-110' :
          processedIndices.includes(idx) ? 'bg-green-100 text-green-700 border-green-400' :
          'bg-white text-gray-700 border-gray-300'
        ]"
      >
        {{ item }}
      </div>
    </div>

    <!-- Переменные -->
    <div class="grid grid-cols-3 gap-3 mb-4 text-sm">
      <div class="bg-white rounded-lg border p-3">
        <div class="text-xs text-gray-500 mb-1">i (индекс)</div>
        <div class="font-mono font-bold text-blue-600">{{ currentIndex !== null ? currentIndex : '—' }}</div>
      </div>
      <div class="bg-white rounded-lg border p-3">
        <div class="text-xs text-gray-500 mb-1">arr[i]</div>
        <div class="font-mono font-bold text-purple-600">
          {{ currentIndex !== null && currentIndex < arr.length ? arr[currentIndex] : '—' }}
        </div>
      </div>
      <div class="bg-white rounded-lg border p-3">
        <div class="text-xs text-gray-500 mb-1">sum</div>
        <div class="font-mono font-bold text-green-600">{{ sum }}</div>
      </div>
    </div>

    <!-- Код -->
    <div class="bg-gray-900 rounded-lg p-3 text-sm font-mono">
      <div v-for="(line, idx) in codeLines" :key="idx"
        class="py-0.5 px-2 rounded transition-all"
        :class="idx === activeLine ? 'bg-yellow-500/20 text-yellow-300' : 'text-gray-300'"
      >
        {{ line }}
      </div>
    </div>

    <!-- Журнал -->
    <div v-if="log.length" class="mt-3 bg-white rounded border p-3 text-xs font-mono text-gray-600 max-h-24 overflow-auto">
      <div v-for="(entry, i) in log" :key="i">{{ entry }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const arr = ref([3, 7, 2, 8, 1])
const currentIndex = ref(null)
const processedIndices = ref([])
const sum = ref(0)
const activeLine = ref(0)
const log = ref([])
const isDone = ref(false)
const isPlaying = ref(false)

const codeLines = [
  'let sum = 0;',
  `for (let i = 0; i < ${arr.value.length}; i++) {`,
  '  sum += arr[i];',
  '  // итерация завершена',
  '}',
  '// цикл завершён',
]

function reset() {
  currentIndex.value = null
  processedIndices.value = []
  sum.value = 0
  activeLine.value = 0
  log.value = []
  isDone.value = false
  isPlaying.value = false
}

function stepForward() {
  if (isDone.value) return

  if (currentIndex.value === null) {
    // Инициализация
    currentIndex.value = 0
    activeLine.value = 1
    log.value.push(`Инициализация: i = 0, sum = 0`)
    return
  }

  if (currentIndex.value < arr.value.length) {
    // Тело цикла
    const val = arr.value[currentIndex.value]
    sum.value += val
    activeLine.value = 2
    log.value.push(`i=${currentIndex.value}: arr[${currentIndex.value}]=${val}, sum=${sum.value}`)
    processedIndices.value.push(currentIndex.value)
    currentIndex.value++
    activeLine.value = 1
  } else {
    // Цикл завершён
    activeLine.value = 5
    log.value.push(`Цикл завершён. Итого: sum = ${sum.value}`)
    isDone.value = true
    currentIndex.value = null
  }
}

async function autoPlay() {
  isPlaying.value = true
  while (!isDone.value) {
    stepForward()
    await new Promise(r => setTimeout(r, 600))
  }
  isPlaying.value = false
}
</script>
