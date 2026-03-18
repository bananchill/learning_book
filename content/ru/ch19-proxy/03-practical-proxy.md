# Практические паттерны с Proxy

Proxy открывает мощные возможности для метапрограммирования. Рассмотрим наиболее полезные паттерны.

import { Callout } from '@book/ui'

## Валидация данных

Прокси позволяет встроить валидацию прямо в объект — при любой попытке записи автоматически проверяется соответствие значения заданной схеме. Это избавляет от необходимости вызывать валидацию вручную и гарантирует, что невалидные данные никогда не попадут в объект.

```js
function createValidator(target, schema) {
  return new Proxy(target, {
    set(target, prop, value, receiver) {
      if (prop in schema) {
        const validator = schema[prop]
        if (!validator(value)) {
          throw new TypeError(`Невалидное значение для ${prop}: ${value}`)
        }
      }
      return Reflect.set(target, prop, value, receiver)
    }
  })
}

const user = createValidator({}, {
  age: v => typeof v === 'number' && v >= 0 && v <= 150,
  email: v => typeof v === 'string' && v.includes('@')
})

user.age = 25      // OK
user.age = -5      // TypeError: Невалидное значение для age: -5
user.email = 'bad' // TypeError: Невалидное значение для email: bad
```

## Значения по умолчанию

С помощью ловушки `get` можно возвращать значение по умолчанию для несуществующих свойств вместо `undefined`. Этот паттерн особенно удобен для счётчиков и конфигурационных объектов, где отсутствие свойства логически эквивалентно нулю или пустому значению.

```js
// Любое несуществующее свойство возвращает 0
const counters = new Proxy({}, {
  get(target, prop, receiver) {
    return Reflect.has(target, prop)
      ? Reflect.get(target, prop, receiver)
      : 0
  }
})

counters.visits          // 0
counters.visits++        // 1 (0 + 1)
counters.clicks++        // 1
```

## Иммутабельный объект (глубокая заморозка)

```js
function deepFreeze(obj) {
  return new Proxy(obj, {
    set(target, prop) {
      throw new TypeError(`Попытка изменить иммутабельное свойство: ${prop}`)
    },
    deleteProperty(target, prop) {
      throw new TypeError(`Попытка удалить иммутабельное свойство: ${prop}`)
    },
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      // Рекурсивно оборачиваем вложенные объекты
      if (value && typeof value === 'object') {
        return deepFreeze(value)
      }
      return value
    }
  })
}

const config = deepFreeze({ db: { host: 'localhost', port: 5432 } })
config.db.host = 'other' // TypeError!
```

<Callout type="tip">
В отличие от `Object.freeze()`, прокси-иммутабельность работает глубоко и даёт понятные сообщения об ошибках — ideal для конфигурационных объектов в production.
</Callout>

## Кэширование вычислений

Ловушка `apply` перехватывает вызовы функций, что позволяет реализовать прозрачное кэширование (мемоизацию) без изменения исходного кода. Результат каждого вызова сохраняется в `Map` по ключу из сериализованных аргументов, и при повторном вызове с теми же аргументами возвращается закэшированное значение.

```js
function memoize(target) {
  const cache = new Map()
  return new Proxy(target, {
    apply(fn, thisArg, args) {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        console.log('cache hit:', key)
        return cache.get(key)
      }
      const result = Reflect.apply(fn, thisArg, args)
      cache.set(key, result)
      return result
    }
  })
}

const expensive = memoize((n) => {
  // Дорогие вычисления...
  return n * n
})

expensive(5)  // вычисляет → 25
expensive(5)  // cache hit → 25
expensive(10) // вычисляет → 100
```
