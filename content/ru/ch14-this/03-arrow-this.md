---
title: "Стрелочные функции и this"
---

import { Callout, DeepDive } from '@book/ui'

## Лексический this стрелочных функций

Стрелочные функции **не имеют собственного `this`**. Они берут `this` из лексического окружения — из того места, где написаны, а не откуда вызваны.

```js
class Timer {
  constructor() {
    this.count = 0
  }

  start() {
    // Стрелочная функция захватывает this из start()
    // this в start() === экземпляр Timer
    setInterval(() => {
      this.count++ // this === Timer — работает!
      console.log(this.count)
    }, 1000)
  }
}

const timer = new Timer()
timer.start() // 1, 2, 3...
```

Если бы вместо стрелки использовалась обычная функция:

```js
setInterval(function() {
  this.count++ // this === undefined (strict) или window
}, 1000)
// Ошибка: Cannot set properties of undefined
```

## Стрелку нельзя переопределить

`call`, `apply`, `bind` не могут изменить `this` стрелочной функции:

```js
const arrow = () => this  // this из глобального/модульного контекста

arrow.call({ x: 1 })    // не меняет this
arrow.bind({ x: 2 })()  // не меняет this
new arrow()              // TypeError: arrow is not a constructor
```

## Когда НЕ использовать стрелочные функции

### 1. Методы объекта

```js
const obj = {
  name: 'Объект',
  // ПЛОХО: стрелка берёт this из глобального контекста
  badMethod: () => {
    console.log(this?.name) // undefined — this не obj!
  },
  // ХОРОШО: обычная функция
  goodMethod() {
    console.log(this.name) // "Объект"
  }
}

obj.badMethod()  // undefined
obj.goodMethod() // "Объект"
```

### 2. Методы прототипа

```js
class Counter {
  count = 0

  // ПЛОХО: стрелка в прототипе не работает правильно
  // (на самом деле стрелки в классе создаются в конструкторе, не в прототипе)
  increment = () => {
    this.count++ // работает, но копируется в КАЖДЫЙ экземпляр
  }

  // ЛУЧШЕ: обычный метод — один в прототипе для всех экземпляров
  decrement() {
    this.count--
  }
}
```

### 3. Обработчики событий, где нужен this === элемент

```js
button.addEventListener('click', function() {
  this.textContent = 'Нажато!' // this === button ✓
})

button.addEventListener('click', () => {
  this.textContent = 'Нажато!' // this !== button ✗
})
```

### 4. Функции-конструкторы

```js
// Стрелки нельзя использовать как конструкторы
const Foo = () => {}
new Foo() // TypeError: Foo is not a constructor
```

<DeepDive>
Под капотом стрелочная функция при создании записывает текущее значение `this` в своё замыкание. Когда стрелку вызывают, движок просто читает это сохранённое значение — без поиска в цепочке вызовов. `call`/`apply`/`bind` технически выполняются, но шаг «установить this» пропускается, потому что у стрелки нет своего [[ThisMode]].
</DeepDive>

## Идеальные случаи для стрелочных функций

```js
// Колбэки в методах — часто нужен this метода
class DataService {
  constructor() {
    this.data = []
    this.prefix = 'LOG'
  }

  fetchAndProcess(items) {
    // Стрелки в map/filter/reduce — отличный выбор
    return items
      .filter(item => item.active)     // this не нужен
      .map(item => this.transform(item)) // this === DataService ✓
  }

  transform(item) {
    return { ...item, prefix: this.prefix }
  }
}
```
