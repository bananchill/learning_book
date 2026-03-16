---
title: "Прототипная цепочка"
---

import { Callout, DeepDive } from '@book/ui'

## Что такое прототип

У каждого объекта в JavaScript есть внутренняя ссылка `[[Prototype]]` — на другой объект, его **прототип**. Когда вы обращаетесь к свойству или методу, JavaScript сначала ищет их в самом объекте. Если не находит — идёт по ссылке `[[Prototype]]` к прототипу, и так далее. Это и есть **прототипная цепочка**.

```js
const animal = {
  breathe() {
    console.log('дышу...')
  }
}

const dog = {
  bark() {
    console.log('Гав!')
  }
}

// Устанавливаем прототип dog → animal
Object.setPrototypeOf(dog, animal)

dog.bark()     // "Гав!" — собственный метод
dog.breathe()  // "дышу..." — унаследован от animal
```

## Как получить прототип объекта

```js
const obj = {}

// Современный способ (рекомендуется)
Object.getPrototypeOf(obj) // → Object.prototype

// Устаревший способ (не использовать в новом коде)
obj.__proto__  // → Object.prototype

// Проверить прототип
console.log(Object.getPrototypeOf(dog) === animal) // true
```

<Callout type="warning">
`__proto__` — нестандартное расширение, добавленное браузерами. Технически оно есть во всех современных движках, но стандарт рекомендует `Object.getPrototypeOf()` и `Object.setPrototypeOf()`.
</Callout>

## Object.prototype — вершина цепочки

Большинство объектов в итоге наследуют от `Object.prototype`. Именно оттуда приходят методы `toString()`, `hasOwnProperty()`, `valueOf()` и другие.

```js
const obj = { name: 'Алиса' }

// Цепочка: obj → Object.prototype → null
Object.getPrototypeOf(obj) === Object.prototype  // true
Object.getPrototypeOf(Object.prototype)          // null — конец цепочки

// Методы Object.prototype доступны всем объектам
obj.toString()         // "[object Object]"
obj.hasOwnProperty('name')  // true
```

## hasOwnProperty vs унаследованные свойства

```js
const parent = { inherited: 'от родителя' }
const child = Object.create(parent)
child.own = 'своё'

// Оба свойства «видны» через точку
console.log(child.own)       // "своё"
console.log(child.inherited) // "от родителя"

// Но hasOwnProperty различает их
child.hasOwnProperty('own')       // true — своё свойство
child.hasOwnProperty('inherited') // false — унаследованное

// Безопасная проверка (если объект мог переопределить hasOwnProperty)
Object.prototype.hasOwnProperty.call(child, 'own') // true
// Или (ES2022):
Object.hasOwn(child, 'own') // true
```

## for...in и прототипная цепочка

```js
const parent = { a: 1 }
const child = Object.create(parent)
child.b = 2

// for...in перебирает ВСЕ enumerable свойства, включая унаследованные
for (const key in child) {
  console.log(key) // b, a
}

// Чтобы перебирать только собственные:
for (const key in child) {
  if (Object.hasOwn(child, key)) {
    console.log(key) // только b
  }
}

// Или используй Object.keys() — только собственные enumerable
Object.keys(child) // ["b"]
```

<DeepDive>
В движке V8 каждый объект имеет **Hidden Class** (скрытый класс / Shape). Когда два объекта имеют одинаковую структуру свойств, V8 даёт им один скрытый класс и оптимизирует доступ к свойствам. Добавление свойств после создания объекта или изменение порядка добавления переводит объект на другой скрытый класс — это «деоптимизация». Прототипы V8 также учитывает при построении скрытых классов.
</DeepDive>

## Прототипная цепочка функций

Функции — тоже объекты. У них есть:
- `Function.prototype` — прототип всех функций (содержит `call`, `apply`, `bind`)
- `fn.prototype` — объект, который станет прототипом объектов, созданных через `new fn()`

```js
function Dog(name) {
  this.name = name
}

// Dog.prototype — объект для экземпляров
Dog.prototype.bark = function() {
  console.log(this.name + ' говорит: Гав!')
}

const rex = new Dog('Рекс')
rex.bark() // "Рекс говорит: Гав!"

// Цепочка: rex → Dog.prototype → Object.prototype → null
Object.getPrototypeOf(rex) === Dog.prototype   // true
Object.getPrototypeOf(Dog.prototype) === Object.prototype // true
```
