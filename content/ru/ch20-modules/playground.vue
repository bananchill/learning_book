<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-emerald-400">Песочница: Модули JavaScript</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="ex in examples" :key="ex.id" @click="select(ex)"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-emerald-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-emerald-400 text-xs font-semibold mb-2">Принцип:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'named-exports',
    label: 'Named exports',
    code: `// math.js
export const PI = 3.14159
export function add(a, b) { return a + b }
export function subtract(a, b) { return a - b }
// unused() не нужна — не экспортируем

// main.js — импортируем только нужное
import { PI, add } from './math.js'
import { PI as myPI } from './math.js'  // псевдоним
import * as math from './math.js'       // всё в объект

// Re-export из index.js
export { add, subtract } from './math.js'
export { PI as MathPI } from './math.js'`,
    explanation: 'Именованные экспорты позволяют tree shaking — бандлер включит в бандл только импортированные функции. Предпочитай их default export-у: они явны, IDE подсказывает имена, рефакторинг надёжнее.'
  },
  {
    id: 'dynamic-import',
    label: 'Динамический import()',
    code: `// Ленивая загрузка тяжёлой библиотеки
async function generatePDF(data) {
  // Загружается только когда нужно
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  doc.text(data.title, 10, 10)
  return doc.output('blob')
}

// Vue Router — code splitting страниц
const routes = [
  {
    path: '/dashboard',
    // Отдельный чанк для каждой страницы
    component: () => import('./pages/Dashboard.vue')
  }
]

// Условный импорт полифилла
if (!window.IntersectionObserver) {
  await import('intersection-observer')
}`,
    explanation: 'Динамический import() загружает модуль только при вызове, возвращает Promise. Бандлер автоматически делает из него отдельный чанк (code splitting). Результат: меньше начальный JS-бандл, быстрее загрузка страницы.'
  },
  {
    id: 'live-bindings',
    label: 'Живые привязки',
    code: `// counter.js
export let count = 0
export function increment() { count++ }

// main.js
import { count, increment } from './counter.js'

console.log(count)  // 0
increment()
console.log(count)  // 1 — живая привязка обновилась!

// В CommonJS это бы не работало:
// const { count } = require('./counter.js')
// count — это КОПИЯ значения 0
// После increment() count всё равно 0`,
    explanation: 'ESM export создаёт живую привязку — ссылку на переменную, а не копию. Когда экспортирующий модуль изменяет переменную, все импортёры видят новое значение. В CommonJS require() создаёт копию значения на момент загрузки.'
  }
]

const activeId = ref('named-exports')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
