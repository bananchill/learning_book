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

Mapped types позволяют не только копировать свойства, но и менять их модификаторы. Добавляя `readonly` перед свойством, мы запрещаем его изменение после создания объекта. Добавляя `?` после ключа, мы делаем свойство опциональным — его можно не указывать при создании объекта.

Но что, если исходный тип уже содержит `readonly` или `?`, а нам нужно их убрать? Для этого TypeScript предоставляет оператор `-` (минус) перед модификатором. Запись `-?` убирает опциональность, делая все свойства обязательными, а `-readonly` убирает защиту от записи, делая свойства мутабельными.

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

Mapped types трансформируют не только модификаторы, но и сами типы значений. В правой части выражения `[K in keyof T]: ...` можно написать любую трансформацию: обернуть значение в `Promise`, добавить `| null`, заменить на `string` и так далее. Это основа для создания «зеркальных» типов, где структура объекта сохраняется, но каждое свойство проходит через заданное преобразование.

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

Ключевое слово `as` в mapped types позволяет переименовать ключи на лету. Синтаксис `[K in keyof T as NewKey]` берёт каждый ключ `K` из `T` и заменяет его на `NewKey`, который может быть вычислен из `K` с помощью template literal types или встроенных строковых утилит вроде `Capitalize`.

Кроме переименования, `as` открывает мощный паттерн фильтрации ключей: если выражение после `as` вычисляется в `never`, то это свойство полностью исключается из результирующего типа. Таким образом, конструкция `as T[K] extends ValueType ? K : never` оставляет только те свойства, чьи значения совместимы с `ValueType`.

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

Mapped types можно применять рекурсивно: если значение свойства — объект, мы вызываем тот же mapped type для вложенного объекта. Это позволяет трансформировать глубоко вложенные структуры данных целиком.

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

Mapped types особенно полезны для типизации событийных API. Вместо того чтобы вручную описывать сигнатуры `on`, `off` и `emit` для каждого события, мы задаём карту событий как единый тип и строим весь интерфейс автоматически. Если добавить новое событие в карту, все методы обновятся сами.

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
