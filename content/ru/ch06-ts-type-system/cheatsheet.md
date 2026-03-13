---
title: "Шпаргалка: Система типов TypeScript"
parent: "ch06-ts-type-system"
---

## Примитивы и литералы

```ts
// Примитивные типы
string  number  boolean  bigint  symbol  null  undefined

// Литеральные типы (const сохраняет, let расширяет)
const x = 'hello'  // Тип: "hello"
let y = 'hello'    // Тип: string

// Union литералов (альтернатива enum)
type Status = 'active' | 'inactive' | 'pending'

// as const — сохраняет литеральный тип и readonly
const config = { api: '/users' } as const
```

## Специальные типы

| Тип | Значение | Используй когда |
|-----|----------|----------------|
| `unknown` | Что угодно, но безопасно | Внешние данные (API, JSON) |
| `any` | Что угодно, без проверок | Миграция с JS (избегай) |
| `never` | Невозможное значение | Exhaustive check |
| `void` | Нет return | Функции без результата |

## interface vs type

```ts
// type — по умолчанию (union, кортежи, mapped types)
type Result = Success | Failure
type Pair = [number, number]

// interface — расширяемые объекты, declaration merging
interface User { id: number; name: string }
interface Admin extends User { role: string }
```

## Union (|) и Intersection (&)

```ts
type A = string | number    // Строка ИЛИ число
type B = HasName & HasAge   // Оба поля одновременно
```

## Utility Types

```ts
Partial<T>     // Все поля опциональные
Required<T>    // Все поля обязательные
Readonly<T>    // Все поля readonly
Pick<T, K>     // Только указанные поля
Omit<T, K>     // Все кроме указанных
Record<K, V>   // Объект { [ключ: K]: V }
```

## Type Narrowing

```ts
// typeof — примитивы
if (typeof x === 'string') { /* x: string */ }

// instanceof — классы
if (x instanceof Error) { /* x: Error */ }

// in — свойства
if ('swim' in animal) { /* animal: Fish */ }

// Пользовательский type guard
function isString(x: unknown): x is string {
  return typeof x === 'string'
}

// Discriminated union + exhaustive check
type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }

switch (shape.kind) {
  case 'circle': /* shape: Circle */ break
  case 'square': /* shape: Square */ break
  default: const _: never = shape // Ошибка если забыл вариант
}
```

## Быстрые правила

- `unknown` > `any` — всегда предпочитай unknown
- `type` по умолчанию, `interface` для extends и merging
- Union литералов > enum — меньше рантайм-кода
- `as const` для конфигов — сохраняет литеральные типы
- `never` в default — гарантия exhaustive check
- Branded types — если нужна номинальная типизация
