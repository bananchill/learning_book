import { Callout, DeepDive } from '@book/ui'

# Что такое дженерики

## Проблема без дженериков

Представьте функцию, которая возвращает первый элемент массива:

```typescript
// Без дженериков — теряем информацию о типе
function first(arr: any[]): any {
  return arr[0]
}

const num = first([1, 2, 3])   // тип: any — плохо!
const str = first(['a', 'b'])  // тип: any — плохо!
```

TypeScript не знает, какой тип вернётся. Мы теряем все преимущества типизации.

## Решение: параметры типов

```typescript
// С дженериком — тип сохраняется
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}

const num = first([1, 2, 3])   // тип: number | undefined
const str = first(['a', 'b'])  // тип: string | undefined
```

`<T>` — это **параметр типа**. Это как обычный параметр функции, но для типов.

<Callout type="info">
Буква `T` — просто соглашение (от «Type»). Можно использовать любое имя: `Item`, `Element`, `Value`. Несколько параметров: `<T, U>`, `<K, V>`.
</Callout>

## Встроенные дженерики

Вы уже используете дженерики каждый день:

```typescript
// Array<T> — массив элементов типа T
const numbers: Array<number> = [1, 2, 3]
const strings: string[] = ['a', 'b'] // сокращённая запись Array<string>

// Promise<T> — промис, который разрешается значением типа T
const fetchUser = (): Promise<User> => {
  return fetch('/api/user').then(r => r.json())
}

// Map<K, V> — словарь с ключами типа K и значениями типа V
const cache = new Map<string, number>()
cache.set('age', 25)

// Set<T> — множество элементов типа T
const ids = new Set<number>([1, 2, 3])
```

## Вывод типов (Type Inference)

TypeScript часто может **вывести** параметр типа автоматически:

```typescript
function identity<T>(value: T): T {
  return value
}

// TypeScript сам определяет T = number
const result1 = identity(42)        // T выведен как number
const result2 = identity('hello')   // T выведен как string

// Явное указание типа (обычно не нужно)
const result3 = identity<boolean>(true)
```

<DeepDive title="Как TypeScript выводит параметры типов">

TypeScript использует **унификацию** для вывода параметров типов. Компилятор смотрит на переданные аргументы и «решает» уравнение, подбирая тип.

Для `identity(42)` компилятор видит: параметр `value` имеет тип `T`, передаётся значение `42` типа `number`, значит `T = number`.

При неоднозначности TypeScript пробует найти наилучший общий тип:
```typescript
function merge<T>(a: T, b: T): T[] {
  return [a, b]
}

// T выводится как string | number — общий тип
const mixed = merge(1, 'hello') // T = string | number
```
</DeepDive>

## Несколько параметров типов

```typescript
// Функция с двумя параметрами типов
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second]
}

const p1 = pair(1, 'hello')      // [number, string]
const p2 = pair(true, [1, 2])    // [boolean, number[]]

// Generic словарь
function zip<K extends string | number | symbol, V>(
  keys: K[],
  values: V[]
): Record<K, V> {
  const result = {} as Record<K, V>
  keys.forEach((key, i) => {
    result[key] = values[i]
  })
  return result
}

const obj = zip(['a', 'b'], [1, 2]) // { a: number, b: number }
```
