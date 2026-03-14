<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-6 text-yellow-400">Протокол итерации</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Левая колонка: итерируемый объект -->
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-yellow-400 text-xs font-semibold mb-3">Итерируемый объект</div>
        <div class="space-y-2 text-xs">
          <div class="bg-gray-800 rounded p-2">
            <span class="text-blue-400">[Symbol.iterator]</span>
            <span class="text-gray-400">() &#123;</span>
          </div>
          <div class="bg-gray-800 rounded p-2 ml-4">
            <span class="text-gray-400">return </span>
            <span class="text-green-400">итератор</span>
          </div>
          <div class="bg-gray-800 rounded p-2">
            <span class="text-gray-400">&#125;</span>
          </div>
        </div>
        <div class="mt-3 text-xs text-gray-400">Встроенные итерируемые:</div>
        <div class="flex flex-wrap gap-1 mt-1">
          <span v-for="item in iterables" :key="item"
            class="px-2 py-0.5 bg-blue-900 text-blue-300 rounded text-xs">
            {{ item }}
          </span>
        </div>
      </div>

      <!-- Правая колонка: итератор -->
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-green-400 text-xs font-semibold mb-3">Итератор</div>
        <div class="space-y-2 text-xs">
          <div class="bg-gray-800 rounded p-2">
            <span class="text-green-400">next</span>
            <span class="text-gray-400">() → &#123;</span>
          </div>
          <div class="bg-gray-800 rounded p-2 ml-4">
            <span class="text-purple-400">value</span>
            <span class="text-gray-400">: any,</span>
          </div>
          <div class="bg-gray-800 rounded p-2 ml-4">
            <span class="text-purple-400">done</span>
            <span class="text-gray-400">: boolean</span>
          </div>
          <div class="bg-gray-800 rounded p-2">
            <span class="text-gray-400">&#125;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Демо: шаги генератора -->
    <div class="mt-6">
      <div class="text-yellow-400 text-xs font-semibold mb-3">Генератор в действии</div>
      <div class="bg-gray-900 rounded-lg p-4">
        <pre class="text-xs text-gray-300 mb-4">function* gen() &#123;
  yield 'A'
  yield 'B'
&#125;</pre>
        <div class="flex gap-2 mb-3 flex-wrap">
          <button @click="step" :disabled="isDone"
            :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
              isDone ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-white']">
            .next()
          </button>
          <button @click="reset" class="px-3 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-gray-300">
            Сбросить
          </button>
        </div>
        <div class="space-y-1">
          <div v-for="(result, i) in results" :key="i"
            class="flex items-center gap-2 text-xs">
            <span class="text-gray-500">{{ i + 1 }}.</span>
            <span class="text-green-400">gen.next()</span>
            <span class="text-gray-400">→</span>
            <span class="bg-gray-800 px-2 py-0.5 rounded text-purple-300">
              &#123; value: {{ result.value === undefined ? 'undefined' : `'${result.value}'` }}, done: {{ result.done }} &#125;
            </span>
          </div>
          <div v-if="isDone" class="text-xs text-gray-500 italic mt-2">
            Генератор исчерпан — все последующие вызовы вернут &#123; value: undefined, done: true &#125;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iterables = ['Array', 'String', 'Map', 'Set', 'NodeList']

// Имитируем шаги генератора
const steps = [
  { value: 'A', done: false },
  { value: 'B', done: false },
  { value: undefined, done: true }
]
const results = ref<Array<{ value: string | undefined; done: boolean }>>([])
const stepIndex = ref(0)
const isDone = ref(false)

function step() {
  if (stepIndex.value < steps.length) {
    results.value.push(steps[stepIndex.value])
    if (steps[stepIndex.value].done) isDone.value = true
    stepIndex.value++
  }
}

function reset() {
  results.value = []
  stepIndex.value = 0
  isDone.value = false
}
</script>
