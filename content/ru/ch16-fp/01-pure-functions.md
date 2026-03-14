---
title: "Чистые функции и side effects"
---

import { Callout } from '@book/ui'

## Что такое чистая функция

Чистая функция — функция, которая:
1. При одинаковых аргументах **всегда** возвращает одинаковый результат
2. Не имеет **побочных эффектов** (side effects)

```js
// Чистая функция
function add(a, b) {
  return a + b  // только зависит от аргументов
}

add(2, 3) // 5 — всегда
add(2, 3) // 5 — всегда

// Нечистая функция
let counter = 0
function addAndCount(a, b) {
  counter++  // побочный эффект: изменяет внешнее состояние
  return a + b
}
```

## Что такое побочные эффекты

Side effects — любые изменения вне функции:

```js
// Побочный эффект: изменение внешней переменной
let total = 0
function addToTotal(n) {
  total += n  // мутирует total — побочный эффект
}

// Побочный эффект: мутация аргумента
function sortArray(arr) {
  return arr.sort()  // sort мутирует оригинальный массив!
}

// Побочный эффект: I/O
function logAndReturn(x) {
  console.log(x)  // запись в консоль — побочный эффект
  return x
}

// Побочный эффект: случайность/время
function getUniqueId() {
  return Math.random() // разный результат — не чистая
}
function getTimestamp() {
  return Date.now()    // разный результат — не чистая
}
```

## Почему чистые функции важны

### 1. Тестируемость

```js
// Нечистая — нужны mock-объекты, сложно тестировать
function sendEmail(user) {
  const html = generateHtml(user)
  emailService.send(user.email, html) // внешняя зависимость
}

// Чистая часть — легко тестировать
function generateEmailContent(user) {
  return {
    to: user.email,
    subject: `Привет, ${user.name}!`,
    html: `<p>Ваш аккаунт создан.</p>`
  }
}
// sendEmail = generateEmailContent + emailService.send(...)
```

### 2. Предсказуемость

```js
// Нечистая: результат зависит от внешнего состояния
let multiplier = 2
function scale(x) { return x * multiplier }
scale(5) // 10... но потом кто-то изменил multiplier

// Чистая: результат предсказуем
function scale(x, multiplier) { return x * multiplier }
scale(5, 2) // всегда 10
```

### 3. Мемоизация

Чистые функции можно безопасно мемоизировать:

```js
function memoize(fn) {
  const cache = new Map()
  return function(arg) {
    if (cache.has(arg)) return cache.get(arg)
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

// Работает только с чистыми функциями!
const expensiveCalc = memoize(n => {
  let result = 0
  for (let i = 0; i < n * 1000; i++) result += i
  return result
})
```

<Callout type="info">
Цель не в том, чтобы полностью избавиться от побочных эффектов — они неизбежны (UI, сеть, DB). Цель — **изолировать** их в специальных местах кода, а основная логика должна быть чистой.
</Callout>
