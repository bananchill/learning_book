import { Callout, DeepDive } from '@book/ui'

# infer и условные типы

## Условные типы

Условные типы работают как тернарный оператор, но для типов:

```typescript
// Базовый синтаксис: T extends U ? X : Y
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
type C = IsString<'hello'> // true — литерал string наследует string
```

## Дистрибутивные условные типы

Когда условный тип применяется к union-типу, он **распределяется** по каждому члену:

```typescript
type ToArray<T> = T extends any ? T[] : never

// Распределяется: (string extends any ? string[] : never) | (number extends any ? number[] : never)
type StringOrNumberArray = ToArray<string | number>  // string[] | number[]

// Без дистрибутивности — оборачиваем в []
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
type NotDistributed = ToArrayNonDist<string | number>  // (string | number)[]
```

<Callout type="info">
Дистрибутивность срабатывает только когда параметр типа — «голый» (naked). Если завернуть в кортеж `[T]`, дистрибутивность отключается.
</Callout>

## Ключевое слово infer

`infer` позволяет **извлекать** типы из других типов в условных выражениях:

```typescript
// Извлекаем тип возвращаемого значения функции
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type GetUser = () => User
type UserType = ReturnType<GetUser>  // User

// Извлекаем тип параметров функции
type Parameters<T> = T extends (...args: infer P) => any ? P : never

type AddFn = (a: number, b: number) => number
type AddParams = Parameters<AddFn>  // [number, number]

// Извлекаем тип элемента массива
type ArrayElement<T> = T extends (infer E)[] ? E : never

type NumElement = ArrayElement<number[]>   // number
type StrElement = ArrayElement<string[]>   // string
```

## Встроенные utility types на основе infer

```typescript
// ReturnType<T> — тип возвращаемого значения
function createUser(name: string, age: number) {
  return { id: Math.random(), name, age, createdAt: new Date() }
}
type CreatedUser = ReturnType<typeof createUser>
// { id: number, name: string, age: number, createdAt: Date }

// Parameters<T> — типы параметров
type CreateUserParams = Parameters<typeof createUser>
// [name: string, age: number]

// ConstructorParameters<T> — параметры конструктора
class Connection {
  constructor(host: string, port: number, ssl: boolean) {}
}
type ConnParams = ConstructorParameters<typeof Connection>
// [host: string, port: number, ssl: boolean]

// InstanceType<T> — тип экземпляра класса
type ConnInstance = InstanceType<typeof Connection>
// Connection
```

<DeepDive title="Глубокое погружение в infer">

`infer` можно использовать несколько раз в одном выражении:

```typescript
// Извлекаем первый и второй тип из кортежа
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never

type First = Head<[string, number, boolean]>  // string
type Rest = Tail<[string, number, boolean]>   // [number, boolean]

// Глубокое извлечение
type UnwrapPromise<T> = T extends Promise<infer U>
  ? UnwrapPromise<U>  // рекурсивно распаковываем
  : T

type Deep = UnwrapPromise<Promise<Promise<string>>>  // string
```

`infer` может появляться только в позиции «extends» условного типа. Нельзя использовать `infer` в обычных выражениях типов.
</DeepDive>

## Рекурсивные условные типы

```typescript
// Распаковываем вложенные массивы
type Flatten<T> = T extends Array<infer Item>
  ? Flatten<Item>
  : T

type Nested = Flatten<number[][][]>  // number

// Извлекаем тип промиса (любой глубины)
type Awaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: any): any }
    ? F extends (value: infer V, ...args: any) => any
      ? Awaited<V>
      : never
    : T

// Это и есть встроенный Awaited<T> из TypeScript 4.5+
type Result = Awaited<Promise<Promise<number>>>  // number
```
