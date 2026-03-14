<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Исследователь типов JavaScript</h2>
    <p class="text-sm text-gray-600 mb-4">Введите любое выражение JavaScript и узнайте всё о его типе</p>

    <!-- Ввод значения -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="inputValue"
        @input="analyzeValue"
        placeholder="Введите значение: null, 42, 'hello', [], {}, NaN..."
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Таблица результатов -->
    <div v-if="result" class="grid grid-cols-2 gap-3 mb-4">
      <div
        v-for="row in tableRows"
        :key="row.label"
        class="bg-white rounded-lg p-3 border border-gray-200"
      >
        <div class="text-xs text-gray-500 mb-1">{{ row.label }}</div>
        <div class="font-mono text-sm font-medium" :class="row.color">{{ row.value }}</div>
      </div>
    </div>

    <!-- Быстрые примеры -->
    <div class="mt-4">
      <p class="text-xs text-gray-500 mb-2">Примеры для исследования:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="example in examples"
          :key="example"
          @click="setExample(example)"
          class="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-400 transition-colors"
        >
          {{ example }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputValue = ref('null')
const result = ref(null)

const examples = [
  'null', 'undefined', '0', 'NaN', '""', '"hello"',
  'true', 'false', '42', '[]', '{}', '-0'
]

// Анализирует введённое значение
function analyzeValue() {
  try {
    // eslint-disable-next-line no-eval
    const val = eval(inputValue.value)
    result.value = {
      raw: val,
      typeofResult: typeof val,
      isTruthy: !!val,
      eqNull: val == null,
      strictNull: val === null,
      strictUndefined: val === undefined,
      isNaN: typeof val === 'number' && Number.isNaN(val),
      isNegZero: Object.is(val, -0)
    }
  } catch {
    result.value = null
  }
}

// Строки для таблицы
const tableRows = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    {
      label: 'typeof',
      value: `"${r.typeofResult}"`,
      color: 'text-purple-600'
    },
    {
      label: 'Truthy / Falsy',
      value: r.isTruthy ? '✓ truthy' : '✗ falsy',
      color: r.isTruthy ? 'text-green-600' : 'text-red-600'
    },
    {
      label: 'value == null',
      value: String(r.eqNull),
      color: r.eqNull ? 'text-orange-600' : 'text-gray-600'
    },
    {
      label: 'value === null',
      value: String(r.strictNull),
      color: r.strictNull ? 'text-orange-600' : 'text-gray-600'
    },
    {
      label: 'value === undefined',
      value: String(r.strictUndefined),
      color: r.strictUndefined ? 'text-orange-600' : 'text-gray-600'
    },
    {
      label: 'Number.isNaN(value)',
      value: String(r.isNaN),
      color: r.isNaN ? 'text-red-600' : 'text-gray-600'
    },
    {
      label: 'Object.is(value, -0)',
      value: String(r.isNegZero),
      color: r.isNegZero ? 'text-blue-600' : 'text-gray-600'
    },
    {
      label: 'Boolean(value)',
      value: String(!!result.value.isTruthy),
      color: 'text-gray-700'
    }
  ]
})

function setExample(example) {
  inputValue.value = example
  analyzeValue()
}

// Инициальный анализ
analyzeValue()
</script>
