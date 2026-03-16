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

## Собственные vs унаследованные свойства

Когда вы обращаетесь к свойству через точку, JavaScript не различает, где оно лежит — в самом объекте или где-то в прототипной цепочке. Но иногда важно понять: это **собственное** свойство объекта или **унаследованное** от прототипа?

Метод `hasOwnProperty(prop)` отвечает на этот вопрос. Он возвращает `true`, только если свойство определено **непосредственно на объекте**, а не получено через цепочку прототипов.

```js
const parent = { inherited: 'от родителя' }
const child = Object.create(parent)
child.own = 'своё'

// Оба свойства «видны» через точку
console.log(child.own)       // "своё"
console.log(child.inherited) // "от родителя"

// Но hasOwnProperty различает их
child.hasOwnProperty('own')       // true — определено на child
child.hasOwnProperty('inherited') // false — пришло из parent
```

У `hasOwnProperty` есть подвох: если кто-то создаст объект без прототипа (`Object.create(null)`) или переопределит этот метод, вызов сломается. Поэтому в ES2022 появился статический метод `Object.hasOwn()` — он безопаснее и короче:

```js
// Старый безопасный способ (вызов через Object.prototype)
Object.prototype.hasOwnProperty.call(child, 'own') // true

// Современный способ (ES2022) — рекомендуется
Object.hasOwn(child, 'own') // true
```

## Перебор свойств: for...in vs Object.keys()

`for...in` перебирает **все** перечисляемые (enumerable) свойства объекта, **включая унаследованные** из прототипной цепочки. Часто это не то, что нужно:

```js
const parent = { a: 1 }
const child = Object.create(parent)
child.b = 2

// for...in — захватит и своё b, и унаследованное a
for (const key in child) {
  console.log(key) // b, a
}
```

Самый простой способ перебрать **только собственные** свойства — `Object.keys()`, `Object.values()` и `Object.entries()`. Они изначально игнорируют прототипную цепочку:

```js
Object.keys(child)    // ["b"] — только ключи
Object.values(child)  // [2]   — только значения
Object.entries(child) // [["b", 2]] — пары [ключ, значение]

// Удобно в цикле:
for (const [key, value] of Object.entries(child)) {
  console.log(key, value) // b 2
}
```

<Callout type="tip">
Используйте `Object.keys()` / `Object.entries()` вместо `for...in` — это и проще, и безопаснее. `for...in` нужен крайне редко — только когда вам действительно нужны унаследованные свойства.
</Callout>

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
