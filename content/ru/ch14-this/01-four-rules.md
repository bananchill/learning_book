---
title: "Четыре правила привязки this"
---

import { Callout } from '@book/ui'

## Правило 1: неявная привязка (implicit binding)

Когда функция вызывается как **метод объекта**, `this` — это объект перед точкой.

```js
const user = {
  name: 'Алиса',
  greet() {
    console.log('Привет, я ' + this.name)
  }
}

user.greet() // "Привет, я Алиса" — this === user
```

## Правило 2: явная привязка (explicit binding)

`call`, `apply`, `bind` позволяют явно указать `this`.

```js
function greet() {
  console.log('Привет, я ' + this.name)
}

const alice = { name: 'Алиса' }
const bob = { name: 'Боб' }

greet.call(alice)  // "Привет, я Алиса"
greet.call(bob)    // "Привет, я Боб"
```

## Правило 3: привязка через new

При вызове функции с `new`, создаётся новый объект и `this` указывает на него.

```js
function Person(name) {
  this.name = name     // this — новый объект
  this.sayHi = function() {
    console.log('Привет, я ' + this.name)
  }
}

const alice = new Person('Алиса') // this внутри = новый объект
alice.sayHi() // "Привет, я Алиса"
```

## Правило 4: привязка по умолчанию (default binding)

Если ни одно из первых трёх правил не применимо, `this`:
- В строгом режиме (`'use strict'`) — `undefined`
- Без строгого режима — глобальный объект (`window` / `globalThis`)

```js
'use strict'

function showThis() {
  console.log(this) // undefined в strict mode
}

showThis() // undefined

// Без strict mode:
function showThisLoose() {
  console.log(this) // window/globalThis
}
showThisLoose()
```

<Callout type="info">
Четыре правила в порядке приоритета (от высшего к низшему):
1. `new` — всегда побеждает
2. Явная привязка (`call`, `apply`, `bind`) — побеждает неявную
3. Неявная привязка (метод объекта)
4. Привязка по умолчанию (global / undefined)
</Callout>

## Вложенные вызовы

```js
const obj = {
  name: 'Объект',
  outer() {
    console.log(this.name) // "Объект" — this === obj (правило 1)

    function inner() {
      console.log(this) // undefined (strict) или global — правило 4!
    }
    inner() // вызов без контекста

    const arrowInner = () => {
      console.log(this.name) // "Объект" — стрелка берёт this из outer
    }
    arrowInner()
  }
}

obj.outer()
```

## Цепочки методов

```js
const a = {
  value: 1,
  getValue() { return this.value },
  getObj() { return this }
}

a.getObj().getValue() // 1 — this сохраняется в цепочке
```
