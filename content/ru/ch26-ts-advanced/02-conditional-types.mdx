import { Callout, DeepDive } from '@book/ui'

# Conditional Types

## Синтаксис и основы

```typescript
// T extends U ? X : Y
type IsString<T> = T extends string ? 'да' : 'нет'

type A = IsString<string>  // 'да'
type B = IsString<number>  // 'нет'
type C = IsString<'hello'> // 'да' — literal string extends string
```

## Дистрибутивные условные типы

Когда параметр типа — «голый» T (не обёрнут в структуру), условный тип дистрибутивен:

```typescript
// NonNullable — встроенный тип
type NonNullable<T> = T extends null | undefined ? never : T

type A = NonNullable<string | null | undefined>
// Распределяется:
// (string extends null|undefined ? never : string) |
// (null extends null|undefined ? never : null) |
// (undefined extends null|undefined ? never : undefined)
// = string | never | never = string

// Извлечение из union
type Extract<T, U> = T extends U ? T : never

type Numbers = Extract<string | number | boolean, number>
// = number

type Exclude<T, U> = T extends U ? never : T

type NonNumbers = Exclude<string | number | boolean, number>
// = string | boolean
```

<Callout type="warning">
Дистрибутивность работает только когда параметр типа используется как `T`, не как `T[]`, `[T]` или `{ val: T }`. Чтобы отключить дистрибутивность — оберните в кортеж: `[T] extends [U]`.
</Callout>

## infer в условных типах

```typescript
// Типичные паттерны с infer

// Тип возвращаемого значения функции
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

// Тип первого аргумента
type FirstArg<T> = T extends (first: infer F, ...rest: any[]) => any ? F : never

// Тип элемента массива
type ElementType<T> = T extends (infer E)[] ? E : never

// Распаковка Promise (рекурсивная)
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T

// Тип ключа Record
type KeyType<T> = T extends Record<infer K, any> ? K : never
```

## Рекурсивные условные типы

```typescript
// Flatten вложенных массивов
type Flatten<T> = T extends Array<infer Item>
  ? Flatten<Item>
  : T

type Result = Flatten<number[][][]>  // number

// Deeply remove null/undefined
type DeepNonNullable<T> = T extends null | undefined
  ? never
  : T extends object
    ? { [K in keyof T]: DeepNonNullable<T[K]> }
    : T
```

<DeepDive title="Циклы через условные типы">

TypeScript позволяет создавать сложные type-level алгоритмы:

```typescript
// Создаём тип-кортеж из N элементов типа T
type Tuple<T, N extends number, R extends unknown[] = []> =
  R['length'] extends N ? R : Tuple<T, N, [T, ...R]>

type Triple = Tuple<string, 3>  // [string, string, string]

// Вычисляем длину кортежа
type Length<T extends any[]> = T['length']
type Len = Length<[1, 2, 3]>  // 3

// Сложение через кортежи
type Add<A extends number, B extends number> =
  Length<[...Tuple<0, A>, ...Tuple<0, B>]>

type Sum = Add<3, 4>  // 7
```

Это type-level программирование — TypeScript становится Turing-complete языком на уровне типов!
</DeepDive>
