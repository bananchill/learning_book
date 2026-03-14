<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm select-none">
    <h2 class="text-lg font-bold mb-4 text-yellow-400">Цепочка скоупов (Scope Chain)</h2>

    <!-- Контролы -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="example in examples"
        :key="example.id"
        @click="selectExample(example.id)"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeExample === example.id
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ example.label }}
      </button>
    </div>

    <!-- Визуализация скоупов -->
    <div class="space-y-2">
      <div
        v-for="(scope, idx) in currentScopes"
        :key="scope.name"
        :class="[
          'border rounded-lg p-3 transition-all',
          scope.active ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-700 bg-gray-900'
        ]"
        :style="{ marginLeft: idx * 20 + 'px' }"
      >
        <!-- Заголовок скоупа -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs px-2 py-0.5 rounded font-semibold" :class="scope.tagClass">
            {{ scope.type }}
          </span>
          <span class="font-bold" :class="scope.active ? 'text-yellow-300' : 'text-gray-300'">
            {{ scope.name }}
          </span>
          <span v-if="scope.active" class="ml-auto text-yellow-400 text-xs">← текущий</span>
        </div>

        <!-- Переменные -->
        <div class="grid grid-cols-2 gap-1">
          <div
            v-for="variable in scope.variables"
            :key="variable.name"
            :class="[
              'flex items-center gap-2 px-2 py-1 rounded text-xs',
              variable.found
                ? 'bg-green-900/50 border border-green-700'
                : 'bg-gray-800'
            ]"
          >
            <span :class="variable.found ? 'text-green-400' : 'text-blue-300'">
              {{ variable.name }}
            </span>
            <span class="text-gray-500">=</span>
            <span :class="variable.found ? 'text-green-300' : 'text-gray-400'">
              {{ variable.value }}
            </span>
            <span v-if="variable.found" class="ml-auto text-green-400">✓</span>
          </div>
        </div>

        <!-- Стрелка к внешнему окружению -->
        <div v-if="idx < currentScopes.length - 1" class="mt-2 text-gray-600 text-xs">
          [[OuterEnv]] →
        </div>
      </div>
    </div>

    <!-- Поиск переменной -->
    <div class="mt-6 p-4 bg-gray-900 rounded-lg">
      <div class="text-xs text-gray-400 mb-2">Поиск переменной:</div>
      <div class="text-yellow-300 font-bold mb-3">{{ currentSearch }}</div>
      <div class="space-y-1">
        <div
          v-for="(step, idx) in searchSteps"
          :key="idx"
          :class="[
            'text-xs px-3 py-1 rounded flex items-center gap-2',
            step.result === 'found' ? 'bg-green-900/40 text-green-300' :
            step.result === 'not-found' ? 'bg-gray-800 text-gray-500' :
            'bg-red-900/40 text-red-400'
          ]"
        >
          <span>{{ idx + 1 }}.</span>
          <span>{{ step.text }}</span>
          <span v-if="step.result === 'found'" class="ml-auto">✓ нашли!</span>
          <span v-else-if="step.result === 'error'" class="ml-auto">✗ ReferenceError</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Примеры для визуализации
const examples = [
  { id: 'found-global', label: 'Найти в глобальном' },
  { id: 'found-parent', label: 'Найти в родителе' },
  { id: 'not-found', label: 'Не найти (ошибка)' }
]

const activeExample = ref('found-parent')

interface Variable {
  name: string
  value: string
  found?: boolean
}

interface Scope {
  name: string
  type: string
  tagClass: string
  active: boolean
  variables: Variable[]
}

// Данные примеров
const exampleData: Record<string, { scopes: Scope[]; search: string; steps: Array<{ text: string; result: string }> }> = {
  'found-parent': {
    scopes: [
      {
        name: 'inner()',
        type: 'Function',
        tagClass: 'bg-purple-900 text-purple-300',
        active: true,
        variables: [
          { name: 'z', value: '30' }
        ]
      },
      {
        name: 'outer()',
        type: 'Function',
        tagClass: 'bg-blue-900 text-blue-300',
        active: false,
        variables: [
          { name: 'y', value: '20', found: true },
          { name: 'inner', value: 'function' }
        ]
      },
      {
        name: 'Global',
        type: 'Global',
        tagClass: 'bg-gray-700 text-gray-300',
        active: false,
        variables: [
          { name: 'x', value: '10' },
          { name: 'outer', value: 'function' }
        ]
      }
    ],
    search: 'console.log(y) // ищем y из inner()',
    steps: [
      { text: 'inner(): переменная y? → нет', result: 'not-found' },
      { text: 'outer() [[OuterEnv]]: переменная y? → есть! y = 20', result: 'found' }
    ]
  },
  'found-global': {
    scopes: [
      {
        name: 'myFunction()',
        type: 'Function',
        tagClass: 'bg-purple-900 text-purple-300',
        active: true,
        variables: [
          { name: 'local', value: '"привет"' }
        ]
      },
      {
        name: 'Global',
        type: 'Global',
        tagClass: 'bg-gray-700 text-gray-300',
        active: false,
        variables: [
          { name: 'globalVar', value: '"глобальная"', found: true },
          { name: 'myFunction', value: 'function' }
        ]
      }
    ],
    search: 'console.log(globalVar) // ищем из myFunction()',
    steps: [
      { text: 'myFunction(): переменная globalVar? → нет', result: 'not-found' },
      { text: 'Global [[OuterEnv]]: переменная globalVar? → есть!', result: 'found' }
    ]
  },
  'not-found': {
    scopes: [
      {
        name: 'deepFunc()',
        type: 'Function',
        tagClass: 'bg-purple-900 text-purple-300',
        active: true,
        variables: [
          { name: 'a', value: '1' }
        ]
      },
      {
        name: 'outer()',
        type: 'Function',
        tagClass: 'bg-blue-900 text-blue-300',
        active: false,
        variables: [
          { name: 'b', value: '2' }
        ]
      },
      {
        name: 'Global',
        type: 'Global',
        tagClass: 'bg-gray-700 text-gray-300',
        active: false,
        variables: [
          { name: 'c', value: '3' }
        ]
      }
    ],
    search: 'console.log(missing) // переменная не существует',
    steps: [
      { text: 'deepFunc(): переменная missing? → нет', result: 'not-found' },
      { text: 'outer(): переменная missing? → нет', result: 'not-found' },
      { text: 'Global: переменная missing? → нет', result: 'not-found' },
      { text: 'ReferenceError: missing is not defined', result: 'error' }
    ]
  }
}

// Вычисляемые данные для текущего примера
const currentScopes = computed(() => exampleData[activeExample.value]?.scopes ?? [])
const currentSearch = computed(() => exampleData[activeExample.value]?.search ?? '')
const searchSteps = computed(() => exampleData[activeExample.value]?.steps ?? [])

// Выбор примера
function selectExample(id: string) {
  activeExample.value = id
}
</script>
