---
title: "Блочный скоуп, IIFE и var-проблемы"
---

import { Callout, DeepDive, CrossLink } from '@book/ui'

## var и функциональный скоуп

До ES6 JavaScript имел только **функциональный скоуп**: `var` «видна» во всей функции, в которой объявлена. Блоки `{}` скоупа для `var` не создают.

```js
function example() {
  if (true) {
    var x = 10  // x видна во всей функции!
  }
  console.log(x) // 10 — не ошибка

  for (var i = 0; i < 3; i++) {
    // тело цикла
  }
  console.log(i) // 3 — i видна за пределами цикла!
}
```

Это приводило к классической проблеме замыканий в цикле:

```js
// Проблема: все коллбэки видят одну и ту же i
var fns = []
for (var i = 0; i < 3; i++) {
  fns.push(function() { return i })
}
console.log(fns[0]()) // 3, а не 0!
console.log(fns[1]()) // 3
console.log(fns[2]()) // 3
```

<CrossLink chapter="ch01-closures" title="Замыкания">
Подробнее о проблемах замыканий в цикле — в главе про замыкания.
</CrossLink>

## let и const — блочный скоуп

`let` и `const` создают переменные с **блочным скоупом**: переменная видна только внутри блока `{}`, где объявлена.

```js
function example() {
  if (true) {
    let x = 10  // видна только внутри if
    const y = 20
  }
  // console.log(x) // ReferenceError
  // console.log(y) // ReferenceError

  for (let i = 0; i < 3; i++) {
    // каждая итерация — свой i
  }
  // console.log(i) // ReferenceError
}
```

Решение проблемы с циклом — просто заменить `var` на `let`:

```js
// let: каждая итерация создаёт новую переменную i
const fns = []
for (let i = 0; i < 3; i++) {
  fns.push(() => i)
}
console.log(fns[0]()) // 0 ✓
console.log(fns[1]()) // 1 ✓
console.log(fns[2]()) // 2 ✓
```

## IIFE — паттерн до ES6

**IIFE** (Immediately Invoked Function Expression, немедленно вызываемое функциональное выражение) — паттерн создания изолированного скоупа через немедленный вызов функции.

```js
// Синтаксис IIFE
(function() {
  // код здесь изолирован от внешнего скоупа
  var privateVar = 'я приватный'
})()

// Вариант со стрелочной функцией (ES6+)
(() => {
  // тоже IIFE
})()
```

До появления `let`/`const` и модулей ES6, IIFE использовался для:

### 1. Создания приватного состояния

```js
// Модуль через IIFE (паттерн до ES6 модулей)
const counter = (function() {
  let count = 0  // приватная переменная

  return {
    increment() { return ++count },
    decrement() { return --count },
    getCount() { return count }
  }
})()

counter.increment() // 1
counter.increment() // 2
// count недоступен снаружи!
```

### 2. Изоляции библиотек

```js
// jQuery-стиль: изоляция от глобального скоупа
(function($, window) {
  // здесь $ — это jQuery, изолированно
})(jQuery, window)
```

### 3. Решения проблемы var в цикле (до let)

```js
// До ES6: IIFE создавал новый скоуп для каждой итерации
var fns = []
for (var i = 0; i < 3; i++) {
  (function(j) {
    fns.push(function() { return j })
  })(i)  // i передаётся как j — новая переменная каждый раз
}
console.log(fns[0]()) // 0 ✓
```

## Когда сегодня нужен IIFE

В современном JavaScript (ES6+) IIFE нужен редко — модули и `let`/`const` решают большинство задач. Но он ещё встречается:

```js
// Асинхронный IIFE для top-level await (до ES2022)
(async () => {
  const data = await fetchData()
  console.log(data)
})()

// Сложная инициализация с промежуточными переменными
const result = (() => {
  const a = heavyComputation()
  const b = anotherComputation(a)
  return combine(a, b)
})()
```

<DeepDive>
**Почему `(function() {})()` работает?**

Обычно `function foo() {}` — это **объявление функции** (statement). Чтобы вызвать функцию немедленно, нужно превратить её в **выражение** (expression). Скобки вокруг функции делают именно это: говорят парсеру «это выражение, не объявление». После этого `()` вызывают полученное выражение.

Есть и другие способы сделать функцию выражением: `!function() {}()`, `+function() {}()`, `void function() {}()` — все они тоже создают IIFE, но `()` — самый читаемый.
</DeepDive>

## Практическое руководство

| Ситуация | Решение |
|----------|---------|
| Нужна переменная только в блоке | `let`/`const` |
| Проблема var в цикле | Заменить на `let` |
| Нужен приватный модульный скоуп | ES6 модули или `let`/`const` |
| Legacy-код с var | Понимай hoisting, мигрируй на `let`/`const` |
| Top-level async | `async IIFE` или Top-level await (ES2022) |
