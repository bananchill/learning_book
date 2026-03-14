<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: методы массива</h3>
    <div class="flex gap-2 mb-3 items-center text-sm flex-wrap">
      <span>Массив:</span>
      <input v-model="arrInput" class="border rounded px-2 py-1 text-sm font-mono w-48"
        placeholder="1, 2, 3, 4, 5, 6" />
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs font-mono">
      <div class="bg-gray-900 text-green-400 rounded p-3">
        <div class="text-gray-400 mb-1">// filter(n => n % 2 === 0)</div>
        <div>{{ evens }}</div>
      </div>
      <div class="bg-gray-900 text-blue-400 rounded p-3">
        <div class="text-gray-400 mb-1">// map(n => n * n)</div>
        <div>{{ squares }}</div>
      </div>
      <div class="bg-gray-900 text-yellow-400 rounded p-3">
        <div class="text-gray-400 mb-1">// reduce((s, n) => s + n, 0)</div>
        <div>{{ sum }}</div>
      </div>
      <div class="bg-gray-900 text-purple-400 rounded p-3">
        <div class="text-gray-400 mb-1">// [...new Set(arr)]</div>
        <div>{{ unique }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const arrInput = ref('1, 2, 3, 2, 4, 3, 5')

const arr = computed(() =>
  arrInput.value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
)

const evens = computed(() => JSON.stringify(arr.value.filter(n => n % 2 === 0)))
const squares = computed(() => JSON.stringify(arr.value.map(n => n * n)))
const sum = computed(() => arr.value.reduce((s, n) => s + n, 0))
const unique = computed(() => JSON.stringify([...new Set(arr.value)]))
</script>
