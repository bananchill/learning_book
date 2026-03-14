<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Стек вызовов: рекурсия factorial</h2>
    <p class="text-sm text-gray-600 mb-4">Визуализация call stack при выполнении factorial(n)</p>

    <!-- Ввод -->
    <div class="flex items-center gap-3 mb-6">
      <label class="text-sm font-medium">factorial(</label>
      <input
        v-model.number="n"
        type="range" min="1" max="8"
        class="w-32 accent-blue-600"
      />
      <span class="text-blue-700 font-bold font-mono">{{ n }}</span>
      <label class="text-sm font-medium">) =</label>
      <span class="text-green-700 font-bold font-mono text-lg">{{ result }}</span>
    </div>

    <!-- Стек вызовов -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Стек -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-2">Call Stack (строится снизу вверх)</h3>
        <div class="bg-white rounded-lg border border-gray-200 p-3 min-h-[200px] flex flex-col-reverse gap-1">
          <div
            v-for="(frame, idx) in stackFrames"
            :key="idx"
            class="py-2 px-3 rounded text-sm font-mono text-center transition-all border-2"
            :class="[
              idx === stackFrames.length - 1
                ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            ]"
          >
            {{ frame }}
          </div>
        </div>
      </div>

      <!-- Вычисление -->
      <div>
        <h3 class="text-sm font-medium text-gray-600 mb-2">Вычисление</h3>
        <div class="bg-white rounded-lg border border-gray-200 p-3 space-y-1">
          <div
            v-for="(step, idx) in computationSteps"
            :key="idx"
            class="text-sm font-mono"
            :class="idx === computationSteps.length - 1 ? 'text-green-700 font-bold' : 'text-gray-600'"
          >
            {{ step }}
          </div>
        </div>
      </div>
    </div>

    <!-- Код -->
    <div class="mt-4 bg-gray-900 rounded-lg p-3 text-sm font-mono text-gray-300">
      <div class="text-yellow-300">function factorial(n) {'{'}</div>
      <div class="text-gray-300">&nbsp;&nbsp;if (n &lt;= 1) return <span class="text-green-400">1</span>; <span class="text-gray-500">// базовый случай</span></div>
      <div class="text-gray-300">&nbsp;&nbsp;return <span class="text-blue-400">n</span> * factorial(<span class="text-blue-400">n</span> - 1); <span class="text-gray-500">// рекурсия</span></div>
      <div class="text-yellow-300">{'}'}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const n = ref(4)

// Вычисление результата
const result = computed(() => {
  let r = 1
  for (let i = 2; i <= n.value; i++) r *= i
  return r
})

// Кадры стека
const stackFrames = computed(() => {
  return Array.from({ length: n.value }, (_, i) => `factorial(${n.value - i})`)
})

// Шаги вычисления
const computationSteps = computed(() => {
  const steps = []
  for (let i = n.value; i >= 1; i--) {
    if (i === 1) {
      steps.push(`factorial(1) = 1`)
    } else {
      let partial = 1
      for (let j = i; j >= 1; j--) partial *= j
      steps.push(`factorial(${i}) = ${i} × factorial(${i - 1})`)
    }
  }
  // Финал
  steps.push(`= ${result.value}`)
  return steps
})
</script>
