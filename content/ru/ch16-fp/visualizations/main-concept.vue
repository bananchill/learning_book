<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm select-none">
    <h2 class="text-lg font-bold mb-4 text-purple-400">pipe: функциональный пайплайн</h2>

    <div class="flex gap-2 mb-6">
      <button v-for="ex in examples" :key="ex.id" @click="activeId = ex.id"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>

    <div v-if="current">
      <!-- Входное значение -->
      <div class="mb-4">
        <div class="text-xs text-gray-400 mb-1">Вход:</div>
        <div class="bg-gray-900 rounded px-3 py-2 text-blue-300 text-xs">{{ current.input }}</div>
      </div>

      <!-- Пайплайн -->
      <div class="space-y-2 mb-4">
        <div v-for="(step, idx) in current.steps" :key="idx" class="flex items-center gap-2">
          <!-- Стрелка между шагами -->
          <div v-if="idx > 0" class="text-gray-600 text-sm pl-2">↓</div>

          <div :class="[
            'flex-1 rounded-lg border px-4 py-2',
            step.highlighted
              ? 'border-purple-400 bg-purple-900/20'
              : 'border-gray-700 bg-gray-900'
          ]">
            <div class="flex items-center gap-3">
              <span class="text-purple-300 font-bold text-xs">{{ step.fn }}</span>
              <span class="text-gray-600 text-xs">→</span>
              <span class="text-green-300 text-xs">{{ step.result }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Результат -->
      <div class="bg-gray-900 rounded-lg px-3 py-2 border border-purple-700">
        <div class="text-xs text-gray-400 mb-1">Результат:</div>
        <div class="text-purple-300 text-xs font-bold">{{ current.output }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step { fn: string; result: string; highlighted?: boolean }
interface Example { id: string; label: string; input: string; steps: Step[]; output: string }

const examples: Example[] = [
  {
    id: 'string',
    label: 'Строки',
    input: '"  hello world  "',
    steps: [
      { fn: 'trim', result: '"hello world"', highlighted: true },
      { fn: 'toUpperCase', result: '"HELLO WORLD"' },
      { fn: 's => s + "!"', result: '"HELLO WORLD!"' }
    ],
    output: '"HELLO WORLD!"'
  },
  {
    id: 'number',
    label: 'Числа',
    input: '3',
    steps: [
      { fn: 'double (x => x * 2)', result: '6', highlighted: true },
      { fn: 'addOne (x => x + 1)', result: '7' },
      { fn: 'square (x => x**2)', result: '49' }
    ],
    output: '49'
  },
  {
    id: 'object',
    label: 'Объекты',
    input: '{ email: "Alice@Ex.COM", name: "  Боб  " }',
    steps: [
      { fn: 'normalize email', result: '{ email: "alice@ex.com", ... }', highlighted: true },
      { fn: 'trim name', result: '{ ..., name: "Боб" }' },
      { fn: 'addRole', result: '{ ..., role: "user" }' }
    ],
    output: '{ email: "alice@ex.com", name: "Боб", role: "user" }'
  }
]

const activeId = ref('string')
const current = computed(() => examples.find(e => e.id === activeId.value))
</script>
