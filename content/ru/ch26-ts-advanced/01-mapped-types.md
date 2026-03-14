import { Callout, DeepDive } from '@book/ui'

# Mapped Types

## Основной синтаксис

Mapped Types позволяют создавать новые типы, трансформируя каждое свойство существующего:

```typescript
// Базовый синтаксис
type Mapped<T> = {
  [K in keyof T]: T[K]
}

// Это эквивалентно копированию типа T
// Но мы можем трансформировать значения и ключи
```

## Модификаторы: readonly и ?

```typescript
// Добавляем readonly ко всем свойствам
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// Делаем все свойства опциональными
type Partial<T> = {
  [K in keyof T]?: T[K]
}

// Убираем опциональность (Required)
type Required<T> = {
  [K in keyof T]-?: T[K]
}

// Убираем readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}
```

<Callout type="info">
Знак `-` перед модификатором убирает его. `-?` убирает опциональность, `-readonly` убирает readonly.
</Callout>

## Трансформация значений

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Превращаем все значения в Nullable
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

type NullableUser = Nullable<User>
// { id: number | null, name: string | null, email: string | null }

// Превращаем все значения в их строковое представление
type Stringify<T> = {
  [K in keyof T]: string
}

// Оборачиваем все значения в Promise
type Promisify<T> = {
  [K in keyof T]: Promise<T[K]>
}
```

## Переименование ключей (as clause)

```typescript
// Добавляем префикс к ключам
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface State {
  count: number
  name: string
}

type StateGetters = Getters<State>
// {
//   getCount: () => number
//   getName: () => string
// }

// Фильтрация ключей через never
type FilteredType<T, ValueType> = {
  [K in keyof T as T[K] extends ValueType ? K : never]: T[K]
}

// Оставляем только строковые свойства
type StringProps = FilteredType<User, string>
// { name: string, email: string }
```

<DeepDive title="Рекурсивные Mapped Types">

```typescript
// DeepPartial — рекурсивный Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P]
}

interface Config {
  server: {
    host: string
    port: number
  }
  auth: {
    secret: string
    expiry: number
  }
}

type PartialConfig = DeepPartial<Config>
// Можно обновить только server.port без указания host
const update: PartialConfig = {
  server: { port: 8080 }
}
```
</DeepDive>

## Практический пример: EventEmitter типы

```typescript
// Создаём типизированный EventEmitter
type EventMap = {
  click: MouseEvent
  keydown: KeyboardEvent
  resize: UIEvent
}

type TypedEventEmitter<Events extends Record<string, any>> = {
  on<K extends keyof Events>(
    event: K,
    handler: (event: Events[K]) => void
  ): void
  off<K extends keyof Events>(
    event: K,
    handler: (event: Events[K]) => void
  ): void
  emit<K extends keyof Events>(event: K, data: Events[K]): void
}

// Использование
declare const emitter: TypedEventEmitter<EventMap>
emitter.on('click', (e) => {
  e.clientX // TypeScript знает, что e: MouseEvent
})
```
