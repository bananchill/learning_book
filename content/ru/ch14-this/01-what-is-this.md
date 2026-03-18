---
title: "Что такое this"
---

import { Callout, DeepDive } from '@book/ui'

## this — это контекст вызова

В JavaScript `this` — это специальное ключевое слово, которое ссылается на объект, **в контексте которого вызвана функция**. Не где функция написана, а **как и откуда она вызвана**.

```js
function sayHi() {
  console.log('Привет, я ' + this.name)
}

const alice = { name: 'Алиса', sayHi }
const bob = { name: 'Боб', sayHi }

alice.sayHi() // "Привет, я Алиса" — this === alice
bob.sayHi()   // "Привет, я Боб"   — this === bob
```

Одна и та же функция, но `this` разный — зависит от того, **кто вызвал**.

## Зачем нужен this

Без `this` пришлось бы явно передавать объект в каждую функцию:

```js
// Без this — неудобно
function greet(user) {
  console.log('Привет, ' + user.name)
}
greet(alice)

// С this — метод "знает" свой объект
alice.sayHi() // this автоматически указывает на alice
```

`this` позволяет писать **методы**, которые работают с данными своего объекта, не зная заранее, к какому объекту они будут привязаны.

## Главная идея: this определяется при вызове

В большинстве языков (Java, C#, Python) `this` / `self` определяется при **создании** объекта. В JavaScript — при **вызове** функции.

```js
const user = {
  name: 'Алиса',
  greet() {
    console.log(this.name)
  }
}

user.greet()           // "Алиса" — вызов как метод объекта

const fn = user.greet  // сохраняем ссылку на функцию
fn()                   // undefined — вызов без объекта, this потерян!
```

<Callout type="warning">
Запомни: **функция и метод — это одна и та же функция**. Разница только в том, как она вызвана. `user.greet()` — вызов метода, `this === user`. Просто `fn()` — обычный вызов, `this` теряется.
</Callout>

## Простое правило: смотри на точку

Самый быстрый способ определить `this` — посмотреть, **что стоит перед точкой** при вызове:

```js
const team = {
  name: 'Команда',
  leader: {
    name: 'Алиса',
    introduce() {
      console.log(this.name)
    }
  }
}

team.leader.introduce() // "Алиса" — перед точкой стоит leader
```

Если перед точкой ничего нет — `this` будет `undefined` (в строгом режиме) или глобальный объект.

## this в разных контекстах

```js
// 1. Метод объекта — this = объект
const obj = {
  x: 10,
  getX() { return this.x }
}
obj.getX() // 10

// 2. Обычный вызов функции — this = undefined (strict mode)
'use strict'
function standalone() {
  console.log(this) // undefined
}
standalone()

// 3. Конструктор (new) — this = новый объект
function User(name) {
  this.name = name // this = новый объект, который создаёт new
}
const u = new User('Боб') // u.name === 'Боб'

// 4. Стрелочная функция — this берётся из окружения
const wrapper = {
  name: 'Обёртка',
  getArrow() {
    const arrow = () => this.name // this из getArrow
    return arrow()
  }
}
wrapper.getArrow() // "Обёртка"
```

<DeepDive title="this в глобальном контексте">
В глобальном контексте (вне функции) `this` ссылается на глобальный объект: `window` в браузере, `globalThis` в Node.js. В ES-модулях (`import`/`export`) глобальный `this` равен `undefined`. На практике глобальный `this` почти не нужен — работать с `window` напрямую понятнее.
</DeepDive>
