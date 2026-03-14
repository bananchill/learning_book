---
title: "Maybe и Either на практике"
---

import { Callout } from '@book/ui'

## Зачем монады — без теории

Монады — это просто способ обернуть значение и управлять тем, как применяются функции. Никакой теории категорий — только практика.

**Maybe** — решает проблему null/undefined.
**Either** — решает проблему обработки ошибок функционально.

## Maybe — безопасная работа с null

```js
class Maybe {
  constructor(value) {
    this._value = value
  }

  // Обёртка над значением
  static of(value) {
    return new Maybe(value)
  }

  // Применить функцию, только если значение не null/undefined
  map(fn) {
    if (this._value == null) return this  // null → пропускаем
    return Maybe.of(fn(this._value))
  }

  // Получить значение или default
  getOrElse(defaultValue) {
    return this._value ?? defaultValue
  }
}

// Использование
const user = { profile: { address: { city: 'Москва' } } }

// Без Maybe: нужны проверки на каждом уровне
const city1 = user?.profile?.address?.city ?? 'Неизвестно'

// С Maybe: цепочка без if/undefined
const city2 = Maybe.of(user)
  .map(u => u.profile)
  .map(p => p.address)
  .map(a => a.city)
  .getOrElse('Неизвестно')

// city1 === city2 === 'Москва'

// Если что-то null — не падаем
const noCity = Maybe.of(null)
  .map(u => u.profile)  // null → пропускается
  .map(p => p.city)     // пропускается
  .getOrElse('Нет города') // 'Нет города'
```

<Callout type="info">
В современном JavaScript `?.` (optional chaining) и `??` (nullish coalescing) — встроенный Maybe в синтаксисе языка. Maybe-монада полезна при построении более сложных пайплайнов трансформаций.
</Callout>

## Either — функциональная обработка ошибок

Either имеет два состояния: Right (успех) и Left (ошибка). Функции применяются только к Right.

```js
class Either {
  static right(value) {
    return { type: 'right', value, isRight: true }
  }

  static left(error) {
    return { type: 'left', error, isRight: false }
  }
}

function map(fn, either) {
  if (!either.isRight) return either  // ошибка — пропускаем
  try {
    return Either.right(fn(either.value))
  } catch (e) {
    return Either.left(e)
  }
}

// Использование в пайплайне
function parseUser(json) {
  try {
    return Either.right(JSON.parse(json))
  } catch (e) {
    return Either.left(new Error('Неверный JSON'))
  }
}

function validateUser(user) {
  if (!user.name) return Either.left(new Error('Имя обязательно'))
  return Either.right(user)
}

const result = map(
  validateUser,
  parseUser('{"name":"Алиса","age":25}')
)

if (result.isRight) {
  console.log('Пользователь:', result.value)
} else {
  console.error('Ошибка:', result.error.message)
}
```

## Реальный пример: пайплайн обработки данных

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// Функции, возвращающие Either
const parseJSON = str => {
  try { return Either.right(JSON.parse(str)) }
  catch (e) { return Either.left(e) }
}

const getField = field => obj =>
  obj[field] != null
    ? Either.right(obj[field])
    : Either.left(new Error(`Поле ${field} отсутствует`))

// Безопасный map для Either
const mapRight = fn => either =>
  either.isRight ? map(fn, either) : either

// Пайплайн
const processInput = str => {
  let result = parseJSON(str)
  if (!result.isRight) return result

  const user = result.value
  if (!user.email) return Either.left(new Error('email обязателен'))

  return Either.right({
    email: user.email.toLowerCase(),
    name: user.name || 'Аноним'
  })
}

const r = processInput('{"email":"Test@Example.COM","name":"Алиса"}')
// Either.right({ email: "test@example.com", name: "Алиса" })
```
