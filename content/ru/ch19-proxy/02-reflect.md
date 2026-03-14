# Reflect API

`Reflect` — объект со статическими методами, соответствующими каждой ловушке Proxy. Он предоставляет «дефолтное» поведение операций.

import { Callout } from '@book/ui'

## Зачем нужен Reflect

Без `Reflect` в ловушке легко сломать цепочку прототипов или потерять `receiver`:

```js
// НЕПРАВИЛЬНО — нарушает цепочку receiver
const bad = new Proxy({}, {
  get(target, prop) {
    return target[prop] // target[prop] игнорирует receiver
  }
})

// ПРАВИЛЬНО — передаём receiver, сохраняем прототипную цепочку
const good = new Proxy({}, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver) // корректно!
  }
})
```

## Методы Reflect

Каждый метод `Reflect` соответствует ловушке Proxy:

```js
// Аналогично target[prop]
Reflect.get(target, prop, receiver)

// Аналогично target[prop] = value
Reflect.set(target, prop, value, receiver)

// Аналогично prop in target
Reflect.has(target, prop)

// Аналогично delete target[prop]
Reflect.deleteProperty(target, prop)

// Аналогично target.apply(thisArg, args)
Reflect.apply(fn, thisArg, args)

// Аналогично new Cls(...args)
Reflect.construct(Cls, args)

// Аналогично Object.keys / for...in
Reflect.ownKeys(target)
```

<Callout type="tip">
Правило большого пальца: в теле ловушки Proxy всегда используй соответствующий `Reflect`-метод для делегирования к оригинальному объекту. Это гарантирует корректное поведение с прототипами и дескрипторами.
</Callout>

## Пример: корректный логирующий прокси

```js
function createLogger(target, name = 'obj') {
  return new Proxy(target, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value !== 'function') {
        console.log(`${name}.${prop} → ${JSON.stringify(value)}`)
      }
      return value
    },
    set(target, prop, value, receiver) {
      console.log(`${name}.${prop} = ${JSON.stringify(value)}`)
      return Reflect.set(target, prop, value, receiver)
    }
  })
}

const user = createLogger({ name: 'Алиса' }, 'user')
user.name         // лог: "user.name → "Алиса""
user.name = 'Боб' // лог: "user.name = "Боб""
```

## Reflect.apply vs Function.prototype.apply

```js
// Старый способ
Function.prototype.apply.call(Math.max, null, [1, 2, 3]) // 3

// С Reflect — чище и безопаснее
Reflect.apply(Math.max, null, [1, 2, 3]) // 3
```
