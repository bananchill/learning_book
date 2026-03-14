<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: FizzBuzz</h3>
    <div class="flex gap-2 mb-4 items-center">
      <label class="text-sm">Диапазон: 1 до</label>
      <input v-model.number="maxN" type="number" min="5" max="30"
        class="border rounded px-2 py-1 w-20 text-sm" />
    </div>
    <div class="grid grid-cols-5 gap-2">
      <div
        v-for="n in maxN"
        :key="n"
        class="text-center py-2 rounded text-sm font-medium"
        :class="getClass(n)"
      >
        {{ getFizzBuzz(n) }}
      </div>
    </div>
    <div class="mt-3 flex gap-3 text-xs">
      <span class="px-2 py-1 rounded bg-purple-100 text-purple-700">FizzBuzz (÷15)</span>
      <span class="px-2 py-1 rounded bg-blue-100 text-blue-700">Fizz (÷3)</span>
      <span class="px-2 py-1 rounded bg-green-100 text-green-700">Buzz (÷5)</span>
      <span class="px-2 py-1 rounded bg-gray-100 text-gray-600">число</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const maxN = ref(20)

function getFizzBuzz(n) {
  if (n % 15 === 0) return 'FB'
  if (n % 3 === 0) return 'Fizz'
  if (n % 5 === 0) return 'Buzz'
  return String(n)
}

function getClass(n) {
  if (n % 15 === 0) return 'bg-purple-100 text-purple-700'
  if (n % 3 === 0) return 'bg-blue-100 text-blue-700'
  if (n % 5 === 0) return 'bg-green-100 text-green-700'
  return 'bg-gray-50 text-gray-600'
}
</script>
