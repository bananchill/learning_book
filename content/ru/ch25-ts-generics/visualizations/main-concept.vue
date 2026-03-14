<script setup lang="ts">
import { ref, computed } from 'vue'

// Демонстрация того, как дженерики сохраняют типовую информацию
interface TypeExample {
  input: string
  inputType: string
  outputType: string
  color: string
}

const examples: TypeExample[] = [
  { input: '42', inputType: 'number', outputType: 'number', color: 'blue' },
  { input: '"hello"', inputType: 'string', outputType: 'string', color: 'green' },
  { input: 'true', inputType: 'boolean', outputType: 'boolean', color: 'purple' },
  { input: '[1,2,3]', inputType: 'number[]', outputType: 'number[]', color: 'orange' },
]

const activeIndex = ref(0)
const active = computed(() => examples[activeIndex.value])

const colorMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  green: 'bg-green-100 text-green-800 border-green-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
}

const arrowColor: Record<string, string> = {
  blue: 'text-blue-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange-500',
}
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">
      Как дженерики сохраняют типы
    </h3>

    <!-- Выбор примера -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="(ex, i) in examples"
        :key="i"
        @click="activeIndex = i"
        class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
        :class="activeIndex === i
          ? colorMap[ex.color]
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
      >
        {{ ex.inputType }}
      </button>
    </div>

    <!-- Визуализация потока -->
    <div class="flex items-center gap-4 mb-6">
      <!-- Вход -->
      <div class="flex-1 p-3 rounded-lg border-2 text-center" :class="colorMap[active.color]">
        <div class="text-xs font-medium mb-1 opacity-70">Вход</div>
        <code class="text-base font-mono font-bold">{{ active.input }}</code>
        <div class="text-xs mt-1 font-medium">: {{ active.inputType }}</div>
      </div>

      <!-- Стрелка с функцией -->
      <div class="flex flex-col items-center" :class="arrowColor[active.color]">
        <code class="text-xs font-mono mb-1 text-gray-600">identity&lt;{{ active.inputType }}&gt;</code>
        <svg class="w-16 h-6" viewBox="0 0 64 24" fill="none">
          <path d="M0 12 H54" stroke="currentColor" stroke-width="2"/>
          <path d="M48 6 L60 12 L48 18" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
        <span class="text-xs mt-1 text-gray-500">T = {{ active.inputType }}</span>
      </div>

      <!-- Выход -->
      <div class="flex-1 p-3 rounded-lg border-2 text-center" :class="colorMap[active.color]">
        <div class="text-xs font-medium mb-1 opacity-70">Выход</div>
        <code class="text-base font-mono font-bold">{{ active.input }}</code>
        <div class="text-xs mt-1 font-medium">: {{ active.outputType }}</div>
      </div>
    </div>

    <!-- Код -->
    <div class="bg-gray-900 rounded-lg p-4">
      <pre class="text-sm text-gray-300 font-mono"><span class="text-blue-400">function</span> <span class="text-yellow-300">identity</span><span class="text-pink-400">&lt;T&gt;</span>(<span class="text-gray-300">value</span><span class="text-pink-400">: T</span>)<span class="text-pink-400">: T</span> <span class="text-gray-300">{</span>
  <span class="text-blue-400">return</span> value
<span class="text-gray-300">}</span>

<span class="text-green-400">// Вызов с {{ active.inputType }}</span>
<span class="text-blue-400">const</span> result = <span class="text-yellow-300">identity</span>(<span class="text-orange-300">{{ active.input }}</span>)
<span class="text-green-400">// result: {{ active.outputType }} — тип сохранён!</span></pre>
    </div>

    <p class="mt-3 text-sm text-gray-500 text-center">
      TypeScript автоматически выводит T = <span class="font-semibold" :class="arrowColor[active.color]">{{ active.inputType }}</span>
    </p>
  </div>
</template>
