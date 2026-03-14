<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Short-circuit evaluation</h2>
    <p class="text-sm text-gray-600 mb-4">Введите значения и выберите оператор — увидите пошаговое вычисление</p>

    <!-- Ввод -->
    <div class="grid grid-cols-3 gap-3 mb-4 items-center">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Значение A</label>
        <input v-model="inputA" placeholder="null, 0, 'hello', true..."
          class="w-full border rounded px-2 py-1.5 text-sm font-mono" />
      </div>
      <div class="text-center">
        <label class="block text-xs text-gray-500 mb-1">Оператор</label>
        <div class="flex gap-1 justify-center">
          <button v-for="op in operators" :key="op"
            @click="selectedOp = op"
            class="px-3 py-1.5 rounded text-sm font-mono font-bold transition-colors"
            :class="selectedOp === op ? 'bg-blue-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'">
            {{ op }}
          </button>
        </div>
      </div>
      <div>
        <label class="block text-xs text-gray-500 mb-1">Значение B</label>
        <input v-model="inputB" placeholder="null, 0, 'default', true..."
          class="w-full border rounded px-2 py-1.5 text-sm font-mono" />
      </div>
    </div>

    <!-- Пошаговое объяснение -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div class="text-sm font-mono mb-3 text-gray-700">
        {{ safeA }} {{ selectedOp }} {{ safeB }}
      </div>

      <div v-for="(step, idx) in steps" :key="idx"
        class="flex items-start gap-2 mb-2 text-sm">
        <span class="w-5 h-5 flex-shrink-0 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">
          {{ idx + 1 }}
        </span>
        <span :class="step.highlight ? 'text-orange-700 font-medium' : 'text-gray-600'">
          {{ step.text }}
        </span>
      </div>
    </div>

    <!-- Результат -->
    <div class="bg-gray-900 rounded-lg p-4">
      <span class="text-gray-400 text-sm font-mono">Результат: </span>
      <span class="text-green-400 text-sm font-mono font-bold">{{ resultDisplay }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const inputA = ref('null')
const inputB = ref("'default'")
const selectedOp = ref('??')
const operators = ['&&', '||', '??']

// Безопасное вычисление
function safeEval(expr) {
  try {
    // eslint-disable-next-line no-eval
    return eval(expr)
  } catch {
    return undefined
  }
}

const valA = computed(() => safeEval(inputA.value))
const valB = computed(() => safeEval(inputB.value))
const safeA = computed(() => inputA.value || 'undefined')
const safeB = computed(() => inputB.value || 'undefined')

// Описание типа значения
function describe(val) {
  if (val === null) return 'null (falsy)'
  if (val === undefined) return 'undefined (falsy)'
  if (val === '') return '"" (falsy)'
  if (val === 0) return '0 (falsy)'
  if (val === false) return 'false (falsy)'
  if (Number.isNaN(val)) return 'NaN (falsy)'
  return `${JSON.stringify(val)} (truthy)`
}

// Пошаговое объяснение
const steps = computed(() => {
  const a = valA.value
  const b = valB.value
  const op = selectedOp.value

  if (op === '&&') {
    const isFalsy = !a
    return [
      { text: `Смотрим на A: ${describe(a)}`, highlight: false },
      isFalsy
        ? { text: 'A является falsy → возвращаем A, B не вычисляется (short-circuit!)', highlight: true }
        : { text: 'A является truthy → переходим к B', highlight: false },
      ...(isFalsy ? [] : [{ text: `Смотрим на B: ${describe(b)}`, highlight: false },
        { text: 'Возвращаем B (последний оценённый операнд)', highlight: true }])
    ]
  }

  if (op === '||') {
    const isTruthy = !!a
    return [
      { text: `Смотрим на A: ${describe(a)}`, highlight: false },
      isTruthy
        ? { text: 'A является truthy → возвращаем A, B не вычисляется (short-circuit!)', highlight: true }
        : { text: 'A является falsy → переходим к B', highlight: false },
      ...(isTruthy ? [] : [{ text: `Смотрим на B: ${describe(b)}`, highlight: false },
        { text: 'Возвращаем B (последний оценённый операнд)', highlight: true }])
    ]
  }

  // ??
  const isNullish = a === null || a === undefined
  return [
    { text: `Смотрим на A: ${a === null ? 'null' : a === undefined ? 'undefined' : JSON.stringify(a)}`, highlight: false },
    isNullish
      ? { text: 'A является null/undefined → переходим к B', highlight: false }
      : { text: 'A НЕ является null/undefined → возвращаем A (short-circuit!)', highlight: true },
    ...(isNullish ? [{ text: `Смотрим на B: ${describe(b)}`, highlight: false },
      { text: 'Возвращаем B', highlight: true }] : [])
  ]
})

// Вычисление результата
const resultDisplay = computed(() => {
  const a = valA.value
  const b = valB.value
  const op = selectedOp.value

  let result
  if (op === '&&') result = a && b
  else if (op === '||') result = a || b
  else result = a ?? b

  if (result === null) return 'null'
  if (result === undefined) return 'undefined'
  return JSON.stringify(result)
})
</script>
