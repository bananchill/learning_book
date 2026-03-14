<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Пайплайн: map → filter → reduce</h2>
    <p class="text-sm text-gray-600 mb-4">Интерактивная визуализация трансформации массива</p>

    <!-- Исходный массив -->
    <div class="mb-4">
      <div class="text-xs font-medium text-gray-500 mb-2">Исходный массив чисел:</div>
      <div class="flex gap-2 flex-wrap">
        <div
          v-for="(n, i) in source"
          :key="i"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 text-sm font-mono font-bold text-gray-700"
        >
          {{ n }}
        </div>
      </div>
    </div>

    <!-- Шаги -->
    <div class="space-y-3">
      <!-- map -->
      <div class="bg-white rounded-lg border border-blue-200 p-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-mono rounded">map(n => n * 2)</span>
          <span class="text-xs text-gray-500">— умножает каждый элемент на 2</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="(n, i) in afterMap"
            :key="i"
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 border-2 border-blue-300 text-sm font-mono font-bold text-blue-700"
          >
            {{ n }}
          </div>
        </div>
      </div>

      <!-- filter -->
      <div class="bg-white rounded-lg border border-green-200 p-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-mono rounded">filter(n => n > {{ filterThreshold }})</span>
          <input v-model.number="filterThreshold" type="range" min="0" max="20" class="w-24 accent-green-600 ml-2" />
          <span class="text-xs text-gray-500">порог: {{ filterThreshold }}</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="(n, i) in afterFilter"
            :key="i"
            class="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50 border-2 border-green-300 text-sm font-mono font-bold text-green-700"
          >
            {{ n }}
          </div>
          <div v-if="afterFilter.length === 0" class="text-sm text-gray-400 italic">пусто</div>
        </div>
      </div>

      <!-- reduce -->
      <div class="bg-white rounded-lg border border-purple-200 p-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-mono rounded">reduce((sum, n) => sum + n, 0)</span>
          <span class="text-xs text-gray-500">— сумма оставшихся</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex gap-2 items-center text-sm font-mono text-gray-600">
            <span v-for="(n, i) in afterFilter" :key="i">
              {{ i === 0 ? '' : ' + ' }}{{ n }}
            </span>
            <span v-if="afterFilter.length === 0">0</span>
          </div>
          <span class="text-gray-400">=</span>
          <div class="w-14 h-10 flex items-center justify-center rounded-lg bg-purple-100 border-2 border-purple-400 text-purple-800 font-mono font-bold text-lg">
            {{ total }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const source = ref([1, 3, 5, 7, 2, 4, 8, 6])
const filterThreshold = ref(8)

const afterMap = computed(() => source.value.map(n => n * 2))
const afterFilter = computed(() => afterMap.value.filter(n => n > filterThreshold.value))
const total = computed(() => afterFilter.value.reduce((sum, n) => sum + n, 0))
</script>
