<script setup lang="ts">
import { ref, computed } from 'vue'

// Демонстрация трансформации типов через Mapped Types
interface TransformExample {
  name: string
  original: Record<string, string>
  transformed: Record<string, string>
  description: string
  modifier: string
}

const examples: TransformExample[] = [
  {
    name: 'Partial<T>',
    modifier: '[K in keyof T]?',
    description: 'Делает все поля опциональными',
    original: { id: 'number', name: 'string', email: 'string' },
    transformed: { 'id?': 'number', 'name?': 'string', 'email?': 'string' }
  },
  {
    name: 'Readonly<T>',
    modifier: 'readonly [K in keyof T]',
    description: 'Делает все поля только для чтения',
    original: { id: 'number', name: 'string', email: 'string' },
    transformed: { 'readonly id': 'number', 'readonly name': 'string', 'readonly email': 'string' }
  },
  {
    name: 'Nullable<T>',
    modifier: '[K in keyof T]: T[K] | null',
    description: 'Добавляет null ко всем значениям',
    original: { id: 'number', name: 'string', email: 'string' },
    transformed: { id: 'number | null', name: 'string | null', email: 'string | null' }
  }
]

const activeIndex = ref(0)
const active = computed(() => examples[activeIndex.value])
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-3xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Трансформация типов: Mapped Types</h3>

    <!-- Переключатель -->
    <div class="flex gap-2 mb-6 flex-wrap">
      <button
        v-for="(ex, i) in examples"
        :key="i"
        @click="activeIndex = i"
        class="px-3 py-1.5 rounded-md text-sm font-mono font-medium transition-colors"
        :class="activeIndex === i
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ ex.name }}
      </button>
    </div>

    <!-- Описание -->
    <div class="mb-4 p-3 bg-blue-50 rounded-lg">
      <code class="text-sm font-mono text-blue-700">{{ '{ ' + active.modifier + ': T[K] }' }}</code>
      <p class="text-sm text-blue-600 mt-1">{{ active.description }}</p>
    </div>

    <!-- Трансформация -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Оригинал -->
      <div>
        <div class="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Исходный тип</div>
        <div class="bg-gray-900 rounded-lg p-3 space-y-1">
          <div v-for="(type, key) in active.original" :key="key" class="flex justify-between text-sm font-mono">
            <span class="text-blue-300">{{ key }}</span>
            <span class="text-gray-400">: {{ type }}</span>
          </div>
        </div>
      </div>

      <!-- Стрелка -->
      <div class="flex items-center justify-center col-span-2 -my-2">
        <div class="flex flex-col items-center text-blue-500">
          <code class="text-xs bg-blue-50 px-2 py-1 rounded font-mono">{{ active.name }}</code>
          <svg class="w-6 h-6 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      <!-- Результат -->
      <div class="col-span-2">
        <div class="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Результирующий тип</div>
        <div class="bg-gray-900 rounded-lg p-3 space-y-1">
          <div v-for="(type, key) in active.transformed" :key="key" class="flex justify-between text-sm font-mono">
            <span class="text-green-300">{{ key }}</span>
            <span class="text-yellow-300">: {{ type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
