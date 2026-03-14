---
title: "Антипаттерны прототипного наследования"
---

import { Callout } from '@book/ui'

## Антипаттерн 1: изменение Object.prototype

Никогда не добавляй методы в `Object.prototype`. Это «отравляет» все объекты в программе.

```js
// ПЛОХО: не делай так никогда!
Object.prototype.log = function() {
  console.log(this)
}

const obj = { x: 1 }
obj.log() // работает, но...

// for...in теперь включает 'log' для ВСЕХ объектов
for (const key in { a: 1 }) {
  console.log(key) // "a", "log" — лишнее!
}

// Конфликты с библиотеками, с браузерными API, с будущими стандартами
```

<Callout type="error">
Изменение встроенных прототипов (`Object.prototype`, `Array.prototype`, `String.prototype`) — серьёзная ошибка. Это называется **monkey patching** и может сломать любую библиотеку или код, который ожидает «чистые» прототипы.
</Callout>

## Антипаттерн 2: глубокие цепочки наследования

```js
// Глубокая иерархия — признак плохого дизайна
class A { methodA() {} }
class B extends A { methodB() {} }
class C extends B { methodC() {} }
class D extends C { methodD() {} }
class E extends D { methodE() {} }

// Проблемы:
// 1. Производительность: поиск метода идёт по 5 уровням
// 2. Хрупкость: изменение A ломает B, C, D, E
// 3. Жёсткая связность: сложно переиспользовать части
// 4. Нарушение принципа единственной ответственности

// Лучше: композиция вместо наследования
class Component {
  constructor({ serializer, logger, validator }) {
    this.serializer = serializer
    this.logger = logger
    this.validator = validator
  }
}
```

## Антипаттерн 3: instanceof-ловушки

`instanceof` проверяет **цепочку прототипов** в момент вызова. Это может давать неожиданные результаты:

```js
// Ловушка 1: разные области видимости (iframes, realm)
const arr = new window.frames[0].Array()
arr instanceof Array // false! Это Array из другого iframe

// Ловушка 2: изменение прототипа после создания
function Foo() {}
const obj = new Foo()
Foo.prototype = {}  // заменяем прототип

obj instanceof Foo  // false! Прототип obj уже не равен новому Foo.prototype

// Ловушка 3: примитивы
'строка' instanceof String // false (примитив, не объект)
new String('строка') instanceof String // true (объект-обёртка)
```

Предпочтительные альтернативы:

```js
// Проверка через duck typing
function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

// Проверка тега
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call({}) // "[object Object]"
Array.isArray([])  // true — надёжнее instanceof Array
```

## Антипаттерн 4: смешивание прототипного и классового подходов

```js
// ПЛОХО: непоследовательное использование
function Animal(name) {
  this.name = name
}

class Dog extends Animal { // extends с function-конструктором — работает, но...
  bark() { console.log('Гав') }
}

// ...создаёт путаницу. Лучше:
// Если используешь классы — только классы
class Animal2 {
  constructor(name) { this.name = name }
}
class Dog2 extends Animal2 {
  bark() { console.log('Гав') }
}
```

## Антипаттерн 5: неверное копирование объектов с прототипами

```js
const original = Object.create({ method() {} })
original.data = [1, 2, 3]

// Поверхностное копирование — теряет прототип
const bad1 = { ...original }  // только собственные свойства, прототип — Object.prototype
const bad2 = Object.assign({}, original)  // то же самое

// Если прототип важен:
const good = Object.create(
  Object.getPrototypeOf(original),
  Object.getOwnPropertyDescriptors(original)
)
```

## Паттерн: предпочитай композицию наследованию

```js
// Вместо глубокой иерархии — собирай объекты из частей
const canSwim = {
  swim() { console.log(this.name + ' плывёт') }
}

const canFly = {
  fly() { console.log(this.name + ' летит') }
}

function createDuck(name) {
  return Object.assign(
    Object.create(null),
    canSwim,
    canFly,
    { name }
  )
}

const duck = createDuck('Дональд')
duck.swim() // "Дональд плывёт"
duck.fly()  // "Дональд летит"
```
