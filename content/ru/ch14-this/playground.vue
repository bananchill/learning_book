<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-orange-400">Песочница: this и контекст</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="ex in examples"
        :key="ex.id"
        @click="select(ex)"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id
            ? 'bg-orange-400 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-orange-400 text-xs font-semibold mb-2">Ключевой момент:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'arrow-vs-regular',
    label: 'Стрелка vs обычная',
    code: `class Counter {
  count = 0

  // Обычный метод — this динамический
  increment() {
    this.count++
  }

  // Стрелка — this лексический (из конструктора)
  decrement = () => {
    this.count--
  }
}

const c = new Counter()

// Оба работают как методы:
c.increment()  // ✓
c.decrement()  // ✓

// Разница проявляется при передаче как колбэк:
const { increment, decrement } = c
// increment() // TypeError: this.count undefined ✗
// decrement()  // работает ✓ — this жёстко захвачен`,
    explanation: 'Обычный метод теряет this при деструктуризации. Стрелочный class field (decrement = () => {}) создаётся в конструкторе и захватывает this лексически — работает как bound метод, но занимает память в каждом экземпляре.'
  },
  {
    id: 'call-apply-bind',
    label: 'call / apply / bind',
    code: `function describe(role, level) {
  return \`\${this.name} — \${role} (\${level})\`
}

const user = { name: 'Алиса' }

// call: аргументы через запятую
describe.call(user, 'разработчик', 'senior')
// "Алиса — разработчик (senior)"

// apply: аргументы массивом
describe.apply(user, ['архитектор', 'lead'])
// "Алиса — архитектор (lead)"

// bind: создаёт новую функцию
const describeUser = describe.bind(user, 'инженер')
describeUser('junior')  // "Алиса — инженер (junior)"
describeUser('senior')  // "Алиса — инженер (senior)"`,
    explanation: 'call и apply вызывают функцию немедленно. bind создаёт новую функцию с жёстко привязанным this и опционально зафиксированными аргументами (частичное применение).'
  },
  {
    id: 'context-loss',
    label: 'Потеря контекста',
    code: `const api = {
  baseUrl: '/api',
  fetch(path) {
    return this.baseUrl + path
  }
}

// Правильно: вызов через объект
api.fetch('/users')  // '/api/users' ✓

// Потеря: деструктуризация
const { fetch } = api
// fetch('/users')  // TypeError ✗

// Решения:
// 1. Стрелочная обёртка
const safeFetch1 = (path) => api.fetch(path)

// 2. bind
const safeFetch2 = api.fetch.bind(api)

// 3. Не деструктурировать методы
safeFetch1('/users')  // '/api/users' ✓
safeFetch2('/users')  // '/api/users' ✓`,
    explanation: 'При деструктуризации метод отрывается от объекта — this теряется. Три решения: 1) стрелочная обёртка, 2) bind, 3) не деструктурировать методы. В React-компонентах для обработчиков чаще используют стрелочные class fields.'
  }
]

const activeId = ref('arrow-vs-regular')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
