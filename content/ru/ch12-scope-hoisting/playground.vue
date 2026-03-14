<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-yellow-400">Песочница: Scope, Hoisting, TDZ</h2>

    <!-- Примеры кода -->
    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="ex in codeExamples"
        :key="ex.id"
        @click="selectCode(ex)"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id
            ? 'bg-yellow-400 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ ex.label }}
      </button>
    </div>

    <!-- Код -->
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>

    <!-- Объяснение -->
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-yellow-400 text-xs font-semibold mb-2">Что происходит:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CodeExample {
  id: string
  label: string
  code: string
  explanation: string
}

const codeExamples: CodeExample[] = [
  {
    id: 'var-hoisting',
    label: 'var hoisting',
    code: `// var поднимается с undefined
console.log(x) // undefined (не ошибка!)
var x = 42
console.log(x) // 42

// Что видит JS:
// var x        ← поднято
// console.log(x) // undefined
// x = 42
// console.log(x) // 42`,
    explanation: 'var объявление поднимается в начало функции (или глобального скоупа). До строки присваивания значение равно undefined. Это не ошибка, но часто источник багов.'
  },
  {
    id: 'fn-hoisting',
    label: 'function hoisting',
    code: `// Функции поднимаются полностью!
hello() // "Привет!" — работает до объявления

function hello() {
  console.log('Привет!')
}

// НО: функциональное выражение не поднимается
// greet() // TypeError: greet is not a function
var greet = function() {
  console.log('Привет от выражения')
}`,
    explanation: 'Объявления функций поднимаются полностью — и имя, и тело. Можно вызвать до строки объявления. Функциональные выражения (var fn = function(){}) ведут себя как var — поднимается только имя со значением undefined.'
  },
  {
    id: 'tdz',
    label: 'TDZ',
    code: `// TDZ — Temporal Dead Zone
{
  // let/const в TDZ от начала блока...
  // console.log(y) // ReferenceError!

  let y = 10  // ...до этой строки
  console.log(y) // 10 ✓
}

// typeof тоже бросает ошибку в TDZ!
// console.log(typeof z) // ReferenceError если z — let ниже
let z = 20`,
    explanation: 'let и const находятся в TDZ от начала блока до строки объявления. Обращение к ним в TDZ — ReferenceError. Даже typeof не спасает! Это намеренный дизайн: делает ошибки доступа до инициализации явными.'
  },
  {
    id: 'iife',
    label: 'IIFE',
    code: `// IIFE создаёт изолированный скоуп
const counter = (function() {
  let count = 0  // приватная переменная

  return {
    increment() { return ++count },
    get()       { return count }
  }
})() // ← немедленный вызов

counter.increment() // 1
counter.increment() // 2
counter.get()       // 2
// count недоступен снаружи!`,
    explanation: 'IIFE (Immediately Invoked Function Expression) создаёт новый скоуп и немедленно его выполняет. Переменные внутри полностью приватны. До ES6 это был основной способ создания модулей. Сегодня чаще используют ES6 модули и let/const, но IIFE ещё актуален для async top-level кода.'
  }
]

const activeId = ref('var-hoisting')
const activeCode = ref(codeExamples[0].code)
const activeExplanation = ref(codeExamples[0].explanation)

function selectCode(ex: CodeExample) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
