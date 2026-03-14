<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: process.argv</h3>
    <p class="text-sm text-gray-600 mb-3">Симуляция parseArgs — введите аргументы командной строки:</p>
    <input
      v-model="argsInput"
      placeholder="--host=localhost --port=3000 --verbose"
      class="w-full border rounded px-3 py-2 text-sm font-mono mb-3"
    />
    <div class="bg-gray-900 rounded p-3 text-green-400 text-sm font-mono">
      <div class="text-gray-400 mb-1">// Результат parseArgs:</div>
      <pre>{{ parsedResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const argsInput = ref('--host=localhost --port=3000 --verbose')

// Простой парсер аргументов для демонстрации
const parsedResult = computed(() => {
  const args = argsInput.value.trim().split(/\s+/).filter(Boolean)
  const result = { _: [] }

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const withoutDashes = arg.slice(2)
      const eqIdx = withoutDashes.indexOf('=')
      if (eqIdx !== -1) {
        const key = withoutDashes.slice(0, eqIdx)
        const value = withoutDashes.slice(eqIdx + 1)
        result[key] = value
      } else {
        result[withoutDashes] = true
      }
    } else {
      result._.push(arg)
    }
  }

  return JSON.stringify(result, null, 2)
})
</script>
