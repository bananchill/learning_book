<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-yellow-400">Песочница: Генераторы и итераторы</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="ex in examples" :key="ex.id" @click="select(ex)"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-yellow-400 text-xs font-semibold mb-2">Принцип:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'iterator-protocol',
    label: 'Протокол итерации',
    code: `// Кастомный итерируемый диапазон
const range = {
  from: 1, to: 4,
  [Symbol.iterator]() {
    let cur = this.from
    const end = this.to
    return {
      next() {
        return cur <= end
          ? { value: cur++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

[...range]          // [1, 2, 3, 4]
const [a, b] = range // a=1, b=2
for (const n of range) console.log(n)`,
    explanation: 'Любой объект с методом [Symbol.iterator](), возвращающим итератор с .next(), работает с for...of, spread и деструктуризацией. Встроенные итерируемые: массивы, строки, Map, Set.'
  },
  {
    id: 'generator-basics',
    label: 'function*',
    code: `function* gen() {
  console.log('шаг 1')
  yield 'A'           // пауза, возвращает 'A'
  console.log('шаг 2')
  yield 'B'           // пауза, возвращает 'B'
}

const g = gen()       // тело НЕ выполняется!
g.next()  // лог "шаг 1" → { value: 'A', done: false }
g.next()  // лог "шаг 2" → { value: 'B', done: false }
g.next()  // → { value: undefined, done: true }

// Генератор — итерируемый:
[...gen()] // ['A', 'B']`,
    explanation: 'Вызов функции-генератора не выполняет тело — только создаёт объект-генератор. Первый .next() запускает выполнение до первого yield. Каждый yield «замораживает» функцию и возвращает значение.'
  },
  {
    id: 'yield-bidirectional',
    label: 'yield ↔ двунаправленный',
    code: `function* calculator() {
  const a = yield 'введи a'  // ← получаем значение здесь
  const b = yield 'введи b'
  return a + b
}

const calc = calculator()
calc.next()      // → { value: 'введи a', done: false }
calc.next(10)    // a = 10 → { value: 'введи b', done: false }
calc.next(20)    // b = 20 → { value: 30, done: true }

// Первый .next() всегда без аргумента!
// Переданное значение стало бы результатом yield,
// но перед первым yield нет ни одного yield.`,
    explanation: 'yield работает в двух направлениях: выбрасывает значение наружу (справа от yield) и получает значение обратно (аргумент следующего .next()). Первый .next() запускает генератор — аргумент игнорируется.'
  }
]

const activeId = ref('iterator-protocol')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
