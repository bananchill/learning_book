<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: for vs for...of vs filter</h3>
    <div class="mb-3">
      <label class="text-sm">Массив чисел (через запятую):</label>
      <input v-model="numsInput" class="ml-2 border rounded px-2 py-1 text-sm font-mono w-48" />
    </div>
    <div class="grid grid-cols-3 gap-3 text-xs font-mono">
      <div>
        <div class="text-gray-600 mb-1">for loop:</div>
        <div class="bg-gray-900 text-green-400 rounded p-2 min-h-[60px]">{{ forResult }}</div>
      </div>
      <div>
        <div class="text-gray-600 mb-1">for...of:</div>
        <div class="bg-gray-900 text-blue-400 rounded p-2 min-h-[60px]">{{ forOfResult }}</div>
      </div>
      <div>
        <div class="text-gray-600 mb-1">filter():</div>
        <div class="bg-gray-900 text-yellow-400 rounded p-2 min-h-[60px]">{{ filterResult }}</div>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2">Показаны чётные числа из массива</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const numsInput = ref('1, 2, 3, 4, 5, 6, 7, 8')

const nums = computed(() =>
  numsInput.value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
)

// for loop
const forResult = computed(() => {
  const evens = []
  for (let i = 0; i < nums.value.length; i++) {
    if (nums.value[i] % 2 === 0) evens.push(nums.value[i])
  }
  return `[${evens.join(', ')}]`
})

// for...of
const forOfResult = computed(() => {
  const evens = []
  for (const n of nums.value) {
    if (n % 2 === 0) evens.push(n)
  }
  return `[${evens.join(', ')}]`
})

// filter
const filterResult = computed(() => {
  return JSON.stringify(nums.value.filter(n => n % 2 === 0))
})
</script>
