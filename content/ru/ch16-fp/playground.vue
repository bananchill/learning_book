<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-purple-400">Песочница: Функциональное программирование</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="ex in examples" :key="ex.id" @click="select(ex)"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-purple-400 text-xs font-semibold mb-2">Принцип:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'pure-vs-impure',
    label: 'Чистые функции',
    code: `// НЕЧИСТАЯ: зависит от внешнего состояния
let tax = 0.2
function getPrice(price) {
  return price * (1 + tax) // ← нечистая!
}

// ЧИСТАЯ: все данные через аргументы
function getPriceClean(price, taxRate) {
  return price * (1 + taxRate) // ← всегда предсказуема
}

// Нечистая с мутацией аргумента
function sortArr(arr) {
  return arr.sort() // ← мутирует оригинал!
}

// Чистая с иммутабельностью
function sortArrClean(arr) {
  return [...arr].sort() // ← новый массив
}`,
    explanation: 'Чистая функция: 1) одинаковые аргументы → одинаковый результат (детерминизм); 2) нет побочных эффектов (нет мутаций, нет I/O). Нечистые функции труднее тестировать и отлаживать.'
  },
  {
    id: 'pipe-demo',
    label: 'pipe',
    code: `const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// Маленькие, простые, тестируемые функции
const trim = s => s.trim()
const lower = s => s.toLowerCase()
const capitalize = s => s[0].toUpperCase() + s.slice(1)
const addExcl = s => s + '!'

// Собираем пайплайн из маленьких функций
const formatName = pipe(trim, lower, capitalize)
const greet = pipe(formatName, name => 'Привет, ' + name, addExcl)

greet('  АЛИСА  ')  // "Привет, Алиса!"
greet('  БОБ  ')    // "Привет, Боб!"`,
    explanation: 'pipe применяет функции слева направо. Каждая маленькая функция делает одну вещь и легко тестируется отдельно. Комбинируя их через pipe, строим сложное поведение.'
  },
  {
    id: 'maybe-demo',
    label: 'Maybe',
    code: `class Maybe {
  static of(v) { return new Maybe(v) }
  constructor(v) { this._v = v }
  map(fn) {
    return this._v == null ? this : Maybe.of(fn(this._v))
  }
  getOrElse(def) { return this._v ?? def }
}

const users = [
  { id: 1, profile: { city: 'Москва' } },
  { id: 2, profile: null },
  { id: 3 }  // нет profile
]

// Безопасное извлечение города
function getCity(user) {
  return Maybe.of(user)
    .map(u => u.profile)
    .map(p => p.city)
    .getOrElse('Неизвестно')
}

users.map(getCity)
// ['Москва', 'Неизвестно', 'Неизвестно']`,
    explanation: 'Maybe "оборачивает" значение и применяет функции только если значение не null/undefined. Это функциональная альтернатива цепочкам optional chaining (user?.profile?.city). Полезно для сложных пайплайнов трансформаций.'
  }
]

const activeId = ref('pure-vs-impure')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
