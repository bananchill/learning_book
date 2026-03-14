# Proxy: ловушки и handler

`Proxy` принимает два аргумента: целевой объект (`target`) и объект-обработчик (`handler`) с ловушками.

import { Callout, DeepDive } from '@book/ui'

## Основной синтаксис

```js
const target = { name: 'Алиса', age: 25 }

const proxy = new Proxy(target, {
  // ловушка на чтение свойства
  get(target, prop, receiver) {
    console.log(`Читаем: ${prop}`)
    return target[prop]
  },
  // ловушка на запись свойства
  set(target, prop, value, receiver) {
    console.log(`Пишем: ${prop} = ${value}`)
    target[prop] = value
    return true // обязательно вернуть true при успехе!
  }
})

proxy.name         // лог "Читаем: name" → 'Алиса'
proxy.age = 26     // лог "Пишем: age = 26"
```

<Callout type="warning">
Ловушка `set` должна возвращать `true` при успешной записи. В строгом режиме возврат `false` вызывает `TypeError`. Это легко забыть!
</Callout>

## Основные ловушки

```js
const handler = {
  // Чтение: obj.prop или obj[prop]
  get(target, prop, receiver) { },

  // Запись: obj.prop = val
  set(target, prop, value, receiver) { return true },

  // Проверка: prop in obj
  has(target, prop) { },

  // Удаление: delete obj.prop
  deleteProperty(target, prop) { return true },

  // Список ключей: Object.keys, for...in
  ownKeys(target) { },

  // Вызов функции: fn()
  apply(target, thisArg, args) { },

  // Конструктор: new Cls()
  construct(target, args) { }
}
```

## Ловушка has — скрываем свойства

```js
const secretData = new Proxy({ secret: 42, public: 'hello' }, {
  has(target, prop) {
    if (prop === 'secret') return false // скрываем от 'in'
    return prop in target
  }
})

'secret' in secretData  // false — скрыто!
'public' in secretData  // true
secretData.secret       // 42 — доступно через get (ловушки get нет)
```

## Ловушка apply — оборачиваем функции

```js
function sum(a, b) { return a + b }

const trackedSum = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log(`Вызов с аргументами: ${args}`)
    const result = target.apply(thisArg, args)
    console.log(`Результат: ${result}`)
    return result
  }
})

trackedSum(2, 3)
// лог: "Вызов с аргументами: 2,3"
// лог: "Результат: 5"
// → 5
```

<DeepDive title="Инварианты Proxy">
Некоторые ловушки имеют «инварианты» — ограничения, нарушение которых вызывает TypeError. Например, `get` не может вернуть другое значение для неконфигурируемого (non-configurable) и нередактируемого (non-writable) свойства. Это сделано для сохранения корректности языка.
</DeepDive>
