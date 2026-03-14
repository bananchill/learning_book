<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-6 text-emerald-400">ESM vs CommonJS</h2>

    <!-- Переключатель -->
    <div class="flex gap-2 mb-6">
      <button @click="activeTab = 'esm'"
        :class="['px-4 py-2 rounded text-xs font-semibold transition-colors',
          activeTab === 'esm' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        ESM
      </button>
      <button @click="activeTab = 'cjs'"
        :class="['px-4 py-2 rounded text-xs font-semibold transition-colors',
          activeTab === 'cjs' ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        CommonJS
      </button>
    </div>

    <!-- ESM -->
    <div v-if="activeTab === 'esm'" class="space-y-3">
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-emerald-400 text-xs font-semibold mb-2">Экспорт (math.js)</div>
        <pre class="text-xs text-gray-300">export const PI = 3.14
export function add(a, b) { return a + b }
export function unused() { ... } // tree shaking уберёт!</pre>
      </div>
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-emerald-400 text-xs font-semibold mb-2">Импорт (main.js)</div>
        <pre class="text-xs text-gray-300">import { PI, add } from './math.js'
// unused() не попадёт в бандл ✓</pre>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="feature in esmFeatures" :key="feature.name"
          class="bg-gray-900 rounded p-2">
          <div class="text-emerald-400 text-xs font-semibold">{{ feature.name }}</div>
          <div class="text-gray-400 text-xs">{{ feature.value }}</div>
        </div>
      </div>
    </div>

    <!-- CommonJS -->
    <div v-else class="space-y-3">
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-orange-400 text-xs font-semibold mb-2">Экспорт (math.js)</div>
        <pre class="text-xs text-gray-300">const PI = 3.14
function add(a, b) { return a + b }
module.exports = { PI, add }</pre>
      </div>
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-orange-400 text-xs font-semibold mb-2">Импорт (main.js)</div>
        <pre class="text-xs text-gray-300">const { PI, add } = require('./math')
// Весь объект загружается, tree shaking невозможен</pre>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="feature in cjsFeatures" :key="feature.name"
          class="bg-gray-900 rounded p-2">
          <div class="text-orange-400 text-xs font-semibold">{{ feature.name }}</div>
          <div class="text-gray-400 text-xs">{{ feature.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'esm' | 'cjs'>('esm')

const esmFeatures = [
  { name: 'Анализ', value: 'Статический (parse-time)' },
  { name: 'Экспорты', value: 'Живые привязки' },
  { name: 'Tree shaking', value: 'Да' },
  { name: 'Браузер', value: 'Нативно' },
  { name: 'Загрузка', value: 'Асинхронная' },
  { name: '__dirname', value: 'import.meta.url' }
]

const cjsFeatures = [
  { name: 'Анализ', value: 'Динамический (runtime)' },
  { name: 'Экспорты', value: 'Копии значений' },
  { name: 'Tree shaking', value: 'Нет' },
  { name: 'Браузер', value: 'Нужен бандлер' },
  { name: 'Загрузка', value: 'Синхронная' },
  { name: '__dirname', value: 'Доступен' }
]
</script>
