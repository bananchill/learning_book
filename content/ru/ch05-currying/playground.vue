<script setup lang="ts">
import { ref } from 'vue'

// Песочница для экспериментов с каррированием

const activeTab = ref(0)

const tabs = [
  {
    title: 'Базовый curry',
    code: `// Каррирование — трансформация f(a,b) → f(a)(b)
const add = (x) => (y) => x + y

console.log(add(2)(3))       // 5

// Создаём специализированные функции
const add10 = add(10)
console.log(add10(5))        // 15
console.log(add10(20))       // 30

// Удобно для .map()
console.log([1, 2, 3].map(add(10)))  // [11, 12, 13]`
  },
  {
    title: 'Универсальный curry',
    code: `// Универсальная функция curry
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args)
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2))
    }
  }
}

function sum(a, b, c) { return a + b + c }

const curriedSum = curry(sum)

// Все варианты работают:
console.log(curriedSum(1)(2)(3))   // 6
console.log(curriedSum(1, 2)(3))   // 6
console.log(curriedSum(1)(2, 3))   // 6
console.log(curriedSum(1, 2, 3))   // 6`
  },
  {
    title: 'Pipe и compose',
    code: `// pipe — слева направо
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

// compose — справа налево
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)

// Каррированные утилиты
const multiply = (x) => (y) => x * y
const add = (x) => (y) => x + y
const toString = (x) => String(x)

// Конвейер: x → *2 → +10 → строка
const transform = pipe(
  multiply(2),
  add(10),
  toString
)

console.log(transform(5))   // "20"
console.log(transform(15))  // "40"

// То же через compose (порядок функций обратный)
const transform2 = compose(toString, add(10), multiply(2))
console.log(transform2(5))  // "20"`
  },
  {
    title: 'Ловушки',
    code: `// ⚠️ Ловушка 1: rest-параметры
function sumAll(...args) {
  return args.reduce((a, b) => a + b, 0)
}
console.log(sumAll.length)  // 0! curry не сработает

// ⚠️ Ловушка 2: параметры по умолчанию
function greet(name, greeting = 'Привет') {
  return greeting + ', ' + name
}
console.log(greet.length)   // 1! Только до первого default

// ⚠️ Ловушка 3: потеря this
const obj = {
  multiplier: 2,
  multiply(a, b) { return this.multiplier * a * b }
}

// Ошибка: this === undefined
// const curried = curry(obj.multiply)
// console.log(curried(3)(4))  // NaN

// Решение: привязать контекст
const bound = obj.multiply.bind(obj)
const curriedBound = curry(bound)
console.log(curriedBound(3)(4))  // 24`
  }
]
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
      Песочница: Каррирование
    </h2>

    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="[
          'px-3 py-2 text-sm font-medium rounded-t-lg transition-colors',
          activeTab === index
            ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        ]"
        @click="activeTab = index"
      >
        {{ tab.title }}
      </button>
    </div>

    <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
      <code>{{ tabs[activeTab].code }}</code>
    </pre>

    <p class="text-sm text-gray-500 dark:text-gray-400">
      Попробуй изменить код и посмотреть, как меняется результат.
      Создай свои каррированные функции!
    </p>
  </div>
</template>
