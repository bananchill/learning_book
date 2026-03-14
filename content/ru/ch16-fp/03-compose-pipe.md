---
title: "compose и pipe"
---

import { Callout } from '@book/ui'

## Что такое compose

`compose(f, g, h)(x)` === `f(g(h(x)))` — применяет функции **справа налево**. Результат одной функции передаётся в следующую.

```js
// Реализация compose
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)

// Примеры функций
const double = x => x * 2
const addOne = x => x + 1
const square = x => x ** 2

// Применяются справа налево: square(addOne(double(3)))
const transform = compose(square, addOne, double)
transform(3)  // square(addOne(double(3))) = square(addOne(6)) = square(7) = 49
```

## Что такое pipe

`pipe(f, g, h)(x)` === `h(g(f(x)))` — применяет функции **слева направо**. Более интуитивно для большинства разработчиков.

```js
// Реализация pipe
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

// Применяются слева направо: square(addOne(double(3)))
const transform = pipe(double, addOne, square)
transform(3)  // double(3)=6 → addOne(6)=7 → square(7)=49

// Читается как процесс: "умножить на 2, затем добавить 1, затем возвести в квадрат"
```

## Практические примеры

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// Трансформация данных пользователя
const normalizeUser = pipe(
  user => ({ ...user, email: user.email.toLowerCase() }),
  user => ({ ...user, name: user.name.trim() }),
  user => ({ ...user, role: user.role || 'user' })
)

normalizeUser({ email: 'Alice@Example.COM', name: '  Боб  ', role: null })
// { email: 'alice@example.com', name: 'Боб', role: 'user' }

// Обработка данных API
const processApiResponse = pipe(
  response => response.data,
  items => items.filter(item => item.active),
  items => items.map(item => ({ id: item.id, title: item.title })),
  items => items.sort((a, b) => a.title.localeCompare(b.title))
)
```

## Функциональная точечная нотация (point-free)

```js
// Обычный стиль (с аргументом)
const getActiveUsers = users => users.filter(user => user.active)
const getUserNames = users => users.map(user => user.name)

// Point-free: функция без явного аргумента
const isActive = user => user.active
const getName = user => user.name

const getActiveUserNames = pipe(
  users => users.filter(isActive),
  users => users.map(getName)
)

// Или с каррированием:
const filter = pred => arr => arr.filter(pred)
const map = fn => arr => arr.map(fn)

const getActiveUserNamesFP = pipe(
  filter(isActive),
  map(getName)
)
```

<Callout type="info">
В JavaScript нет нативного `pipe`. В экосистеме используют: `pipe` из `ramda` / `fp-ts`, или нативный оператор `|>` (Stage 2 proposal). В Node.js 22+ есть `pipeline` для потоков данных — похожая идея.
</Callout>

## compose vs pipe

| | compose | pipe |
|---|---------|------|
| Порядок | Справа налево | Слева направо |
| `f, g, h` на `x` | `f(g(h(x)))` | `h(g(f(x)))` |
| Читаемость | Математический стиль | Пайплайн-стиль |
| Популярность в JS | Меньше | Больше (flow в lodash) |
