---
title: "call, apply, bind"
---

import { Callout } from '@book/ui'

## call — явный вызов с контекстом

`fn.call(thisArg, arg1, arg2, ...)` вызывает функцию, устанавливая `this === thisArg`. Аргументы передаются через запятую.

```js
function introduce(greeting, punctuation) {
  console.log(greeting + ', я ' + this.name + punctuation)
}

const alice = { name: 'Алиса' }
const bob = { name: 'Боб' }

introduce.call(alice, 'Привет', '!') // "Привет, я Алиса!"
introduce.call(bob, 'Здравствуй', '.') // "Здравствуй, я Боб."
```

## apply — аргументы массивом

`fn.apply(thisArg, [arg1, arg2, ...])` — то же, что `call`, но аргументы передаются массивом.

```js
const numbers = [3, 1, 4, 1, 5, 9, 2, 6]

// Найти максимум через apply — передаём массив как аргументы
const max = Math.max.apply(null, numbers) // 9

// В современном JS предпочтительнее spread:
const max2 = Math.max(...numbers) // 9

// apply полезен когда массив уже есть в переменной и нужен конкретный this
function logArgs() {
  console.log(this.prefix + ': ' + Array.from(arguments).join(', '))
}
const logger = { prefix: 'LOG' }
logArgs.apply(logger, ['a', 'b', 'c']) // "LOG: a, b, c"
```

## bind — создание привязанной функции

`fn.bind(thisArg, ...args)` создаёт **новую функцию** с жёстко привязанным `this`. Не вызывает функцию — возвращает новую.

```js
const user = {
  name: 'Алиса',
  greet() {
    console.log('Привет, я ' + this.name)
  }
}

const greetAlice = user.greet.bind(user)
greetAlice()          // "Привет, я Алиса" — this всегда user

setTimeout(greetAlice, 1000) // тоже сработает — this жёстко привязан
```

## Заимствование методов

Паттерн «заимствование метода» — вызов метода одного объекта с контекстом другого:

```js
// Массивные методы для array-like объектов
function sumArgs() {
  // arguments — не настоящий массив, поэтому нет reduce
  return Array.prototype.reduce.call(arguments, (acc, n) => acc + n, 0)
}

sumArgs(1, 2, 3, 4) // 10

// toString для определения типа
const type = Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call({})  // "[object Object]"
Object.prototype.toString.call(null) // "[object Null]"
```

## Частичное применение через bind

`bind` поддерживает **частичное применение** — предварительную фиксацию аргументов:

```js
function multiply(a, b) {
  return a * b
}

const double = multiply.bind(null, 2)  // a всегда равно 2
const triple = multiply.bind(null, 3)

double(5) // 10
triple(5) // 15

// Создание специализированных функций
function request(method, url, data) {
  return fetch(url, { method, body: JSON.stringify(data) })
}

const get = request.bind(null, 'GET')
const post = request.bind(null, 'POST')

get('/api/users')
post('/api/users', { name: 'Алиса' })
```

<Callout type="info">
**Сводная таблица:**

| Метод | Вызывает функцию? | Аргументы | Результат |
|-------|------------------|-----------|-----------|
| `call(ctx, a, b)` | Да | Через запятую | Результат функции |
| `apply(ctx, [a, b])` | Да | Массив | Результат функции |
| `bind(ctx, a, b)` | Нет | Через запятую (частично) | Новая функция |
</Callout>

## bind жёстче явной привязки

Привязанную функцию нельзя переопределить через `call`/`apply`:

```js
function fn() { console.log(this.x) }

const bound = fn.bind({ x: 1 })
bound.call({ x: 2 }) // 1 — bind выигрывает!
bound.apply({ x: 3 }) // 1 — bind выигрывает!

// НО: new может переопределить bind
const BoundFn = fn.bind({ x: 1 })
const obj = new BoundFn() // new создаёт новый объект, this = новый объект
```
