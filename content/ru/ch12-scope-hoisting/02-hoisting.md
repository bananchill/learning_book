---
title: "Hoisting: поднятие функций и переменных"
---

import { Callout, DeepDive } from '@book/ui'

## Что такое hoisting

**Hoisting** («поднятие») — поведение JavaScript, при котором объявления переменных и функций обрабатываются **до выполнения** кода в этом скоупе.

Это не физическое перемещение строк — это следствие того, что JavaScript парсит весь код скоупа перед выполнением и заранее регистрирует объявления в Environment Record.

## Поднятие функций — полное

Объявления функций поднимаются **полностью**: имя и тело функции доступны до строки объявления.

```js
// Вызов ДО объявления — работает!
sayHello() // "Привет!"

function sayHello() {
  console.log('Привет!')
}

// Что происходит под капотом:
// 1. JavaScript парсит весь файл
// 2. Находит function sayHello — сразу добавляет в Environment Record
// 3. Начинает выполнение — sayHello уже существует
```

Это позволяет организовывать код в удобном порядке: сначала высокоуровневый код, потом детали реализации.

```js
// Читаемая организация: главное — сверху
function main() {
  const data = fetchData()
  const result = processData(data)
  renderResult(result)
}

// Детали — снизу, хотя вызываются из main выше
function fetchData() { /* ... */ }
function processData(data) { /* ... */ }
function renderResult(result) { /* ... */ }
```

<Callout type="warning">
Hoisting работает только для **объявлений функций** (`function name() {}`). Функциональные выражения (`const fn = function() {}`, `const fn = () => {}`) не поднимаются — они следуют правилам `var`/`let`/`const`.
</Callout>

## Поднятие var — частичное

`var` поднимается **частично**: имя переменной регистрируется в Environment Record, но значение — нет. До строки присваивания переменная равна `undefined`.

```js
console.log(x) // undefined (не ReferenceError!)
var x = 5
console.log(x) // 5

// Как это видит JavaScript:
// var x;          ← поднято (объявление)
// console.log(x)  // undefined
// x = 5;          ← остаётся на месте (присваивание)
// console.log(x)  // 5
```

Это поведение создаёт неочевидные баги:

```js
function processUser(user) {
  console.log(role) // undefined — не ошибка! Запутывает.

  if (user.isAdmin) {
    var role = 'admin'
  }

  console.log(role) // 'admin' или undefined
}
// var поднимается в функцию, блок if не создаёт скоуп для var
```

## var в функциональном скоупе

`var` поднимается до ближайшей функции (или глобального скоупа). Блоки `if`, `for`, `while` для `var` **прозрачны**.

```js
function demo() {
  for (var i = 0; i < 3; i++) {
    var temp = i * 2
  }

  console.log(i)    // 3 — i пробила for-блок!
  console.log(temp) // 4 — temp пробила for-блок!
}

// Эквивалентно:
function demo() {
  var i    // поднято
  var temp // поднято

  for (i = 0; i < 3; i++) {
    temp = i * 2
  }

  console.log(i)    // 3
  console.log(temp) // 4
}
```

## Порядок поднятия при конфликтах

Если функция и переменная `var` имеют одинаковое имя, функция «побеждает»:

```js
console.log(typeof foo) // "function"

var foo = 'переменная'
function foo() {} // поднимается первой

// Но после присваивания:
console.log(typeof foo) // "string"
```

<DeepDive>
Порядок обработки при инициализации скоупа:

1. Сначала обрабатываются все `function` объявления — добавляются в Environment Record с их телами
2. Затем обрабатываются `var` — добавляются как `undefined` (если имя уже занято функцией — не перезаписывают)
3. Затем начинается выполнение кода построчно

Для `let` и `const` имена тоже регистрируются в Environment Record при парсинге, но остаются в **TDZ** (Temporal Dead Zone) до строки инициализации — об этом в следующей главе.
</DeepDive>

## Итог: сравнение поведения

```js
// Функция — полное поднятие
hello()          // "Hello" ✓
function hello() { console.log('Hello') }

// var — частичное поднятие (undefined)
console.log(a)   // undefined ✓ (не ошибка)
var a = 1

// let — TDZ (ошибка до объявления)
// console.log(b) // ReferenceError ✗
let b = 2

// const — TDZ (ошибка до объявления)
// console.log(c) // ReferenceError ✗
const c = 3

// Функциональное выражение — как переменная
// fn()            // TypeError: fn is not a function ✗
var fn = function() {}
```
