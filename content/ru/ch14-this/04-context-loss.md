---
title: "Потеря контекста и решения"
---

import { Callout } from '@book/ui'

## Что такое потеря контекста

Потеря контекста происходит, когда метод объекта вызывается **без привязки к объекту**. `this` теряется, и вместо него — `undefined` (strict) или глобальный объект.

```js
const user = {
  name: 'Алиса',
  greet() {
    console.log('Привет, я ' + this.name)
  }
}

// Нормальный вызов — контекст сохранён
user.greet() // "Привет, я Алиса"

// Потеря контекста — отрываем метод от объекта
const greet = user.greet
greet() // TypeError: Cannot read properties of undefined (strict mode)
        // или "Привет, я undefined" (non-strict)
```

## Случай 1: передача метода как колбэка

```js
const timer = {
  name: 'Таймер',
  tick() {
    console.log(this.name + ' тикает')
  }
}

// Потеря контекста при передаче в setTimeout
setTimeout(timer.tick, 100)  // "undefined тикает" или ошибка

// Решение 1: стрелочная обёртка
setTimeout(() => timer.tick(), 100) // "Таймер тикает" ✓

// Решение 2: bind
setTimeout(timer.tick.bind(timer), 100) // "Таймер тикает" ✓
```

## Случай 2: деструктуризация методов

```js
const api = {
  baseUrl: 'https://api.example.com',
  async get(path) {
    return fetch(this.baseUrl + path)
  }
}

// Деструктуризация — метод отрывается от объекта
const { get } = api
await get('/users') // this.baseUrl === undefined — ошибка!

// Решение: bind при деструктуризации
const { get: boundGet } = { get: api.get.bind(api) }

// Или: не деструктурировать методы, использовать через объект
await api.get('/users') // ✓
```

## Случай 3: вложенные функции в методах

```js
class Processor {
  constructor(data) {
    this.data = data
    this.results = []
  }

  process() {
    // Проблема: обычная функция внутри метода теряет this
    this.data.forEach(function(item) {
      this.results.push(item * 2) // TypeError — this !== Processor
    })
  }

  // Решение 1: стрелочная функция
  processFixed1() {
    this.data.forEach((item) => {
      this.results.push(item * 2) // ✓ — стрелка берёт this из processFixed1
    })
  }

  // Решение 2: bind
  processFixed2() {
    this.data.forEach(function(item) {
      this.results.push(item * 2)
    }.bind(this))
  }

  // Решение 3: сохранение this в переменной (устаревший паттерн)
  processFixed3() {
    const self = this  // сохраняем this
    this.data.forEach(function(item) {
      self.results.push(item * 2) // использует замыкание
    })
  }
}
```

<Callout type="info">
Современный код использует стрелочные функции (решение 1) — это самый читаемый подход. `self = this` — устаревший паттерн из времён до ES6.
</Callout>

## Случай 4: обработчики событий в классах

```js
class Component {
  constructor() {
    this.count = 0
    // Проблема: обработчик вызывается без контекста
    document.querySelector('#btn').addEventListener('click', this.handleClick)
    // this.handleClick будет вызван с this === кнопка (DOM-элемент)
  }

  handleClick() {
    this.count++ // this !== Component — ошибка!
  }
}

// Решение 1: bind в конструкторе
class ComponentFixed1 {
  constructor() {
    this.count = 0
    this.handleClick = this.handleClick.bind(this) // ← фиксируем this
    document.querySelector('#btn').addEventListener('click', this.handleClick)
  }
  handleClick() { this.count++ }
}

// Решение 2: стрелочный метод (class field)
class ComponentFixed2 {
  count = 0
  handleClick = () => {  // стрелка захватывает this из конструктора
    this.count++
  }
  constructor() {
    document.querySelector('#btn').addEventListener('click', this.handleClick)
  }
}
```

## Диагностика потери контекста

```
Вопросы для диагностики:
1. Как функция вызывается? (obj.fn() vs fn() vs setTimeout(fn))
2. Это стрелочная функция? (не может потерять this)
3. Есть ли bind/call/apply?
4. Используется ли new?

Правило: если функция вызывается без объекта перед точкой
и без call/apply/bind и без new — this теряется.
```
