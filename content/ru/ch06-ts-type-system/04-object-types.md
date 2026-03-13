---
title: "Объектные типы: интерфейсы, type alias, классы"
parent: "ch06-ts-type-system"
order: 4
---

## Два способа описать объект

TypeScript предлагает два ключевых слова для описания типов объектов: `interface` и `type`. Оба делают почти одно и то же, но с важными различиями.

### interface

Описывает форму объекта. Может быть расширен через `extends`:

```ts
interface User {
  id: number
  name: string
  email: string
}

interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  id: 1,
  name: 'Алекс',
  email: 'alex@example.com',
  permissions: ['users.manage', 'content.edit']
}
```

### type alias

Создаёт псевдоним для любого типа — не только объектного:

```ts
type User = {
  id: number
  name: string
  email: string
}

// type может описывать то, что interface не может:
type ID = string | number                      // union
type Pair<T> = [T, T]                          // кортеж
type Callback = (data: string) => void         // функция
type Keys = keyof User                         // "id" | "name" | "email"
```

## interface vs type — когда что

```ts
// interface — для объектов, которые будут расширяться
interface Animal {
  name: string
}

interface Dog extends Animal {
  breed: string
}

// type — для union-ов, кортежей, mapped types, computed types
type Result = Success | Failure
type Coordinates = [number, number]
type Readonly<T> = { readonly [K in keyof T]: T[K] }
```

### Ключевые различия

| Возможность | interface | type |
|-------------|-----------|------|
| Описание объекта | ✅ | ✅ |
| extends | ✅ | Через `&` |
| Union / Intersection | ❌ | ✅ |
| Кортежи | ❌ | ✅ |
| Mapped types | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Скорость компиляции (extends) | Быстрее | `&` медленнее |

### Declaration merging

Interface с одинаковым именем автоматически объединяются. Это полезно для расширения библиотечных типов:

```ts
// Расширяем Window из lib.dom.d.ts
interface Window {
  analytics: AnalyticsClient
}

// Теперь window.analytics типизирован
window.analytics.track('click')
```

<Callout type="warning">
Declaration merging может быть непредсказуемым в приложениях — два файла могут случайно определить один и тот же интерфейс, и они молча объединятся. Для приложений (не библиотек) предпочитайте type.
</Callout>

### Рекомендация

**Используйте `type` по умолчанию** — он более предсказуемый и гибкий. Переходите на `interface`, когда нужно:
- `extends` для наследования объектов (быстрее для компилятора)
- Declaration merging (расширение библиотечных типов)

## Объединение (|) и пересечение (&)

### Union type (|) — «или»

Значение может быть одним из нескольких типов:

```ts
type StringOrNumber = string | number

function format(value: StringOrNumber): string {
  if (typeof value === 'string') return value.toUpperCase()
  return value.toFixed(2)
}
```

Union — это **объединение множеств**: `string | number` содержит все строки и все числа.

### Intersection type (&) — «и»

Значение должно удовлетворять **всем** типам одновременно:

```ts
type HasName = { name: string }
type HasAge = { age: number }
type Person = HasName & HasAge

const person: Person = { name: 'Алекс', age: 25 } // Нужны ОБА поля
```

Intersection — это **пересечение множеств**: объект, который принадлежит обоим типам.

<Callout type="info">
Для примитивов intersection часто даёт never: `string & number` — невозможно быть одновременно строкой и числом.
</Callout>

## Модификаторы свойств

### readonly — только чтение

```ts
type Config = {
  readonly host: string
  readonly port: number
}

const config: Config = { host: 'localhost', port: 3000 }
config.host = 'example.com' // ❌ Ошибка: Cannot assign to 'host'
```

### Опциональные свойства (?)

```ts
type User = {
  id: number
  name: string
  bio?: string // Может быть string или undefined
}

const user: User = { id: 1, name: 'Алекс' } // ✅ — bio необязателен
```

## Типизация функций

```ts
// Стрелочная нотация
type Greet = (name: string) => string

// С перегрузками (только interface)
interface Formatter {
  (value: string): string
  (value: number): string
  (value: Date): string
}

// Функция с опциональными и default параметрами
function createUser(
  name: string,
  age: number = 25,
  email?: string
): User {
  return { id: Date.now(), name, age, email }
}
```

## Массивы и кортежи

```ts
// Массив — переменная длина, один тип элементов
const numbers: number[] = [1, 2, 3]
const names: Array<string> = ['Алекс', 'Кира'] // Альтернативный синтаксис

// Кортеж — фиксированная длина, типы по позициям
const point: [number, number] = [10, 20]
const entry: [string, number] = ['age', 25]

// Именованные кортежи (для читаемости)
type RGB = [red: number, green: number, blue: number]
```

## Index signatures

Для объектов с динамическими ключами:

```ts
type Dictionary = {
  [key: string]: number
}

const scores: Dictionary = {
  math: 95,
  physics: 88,
  // Любой строковый ключ с числовым значением
}
```

<Callout type="warning">
Index signature не проверяет, существует ли ключ: `scores['nonexistent']` вернёт `undefined`, но тип будет `number`. Включите `noUncheckedIndexedAccess` в tsconfig для безопасности.
</Callout>

## Utility types — встроенные трансформации

TypeScript предлагает набор utility types для трансформации существующих типов:

```ts
interface User {
  id: number
  name: string
  email: string
  age: number
}

// Все поля опциональные
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string; age?: number }

// Все поля обязательные
type RequiredUser = Required<PartialUser>

// Только выбранные поля
type UserPreview = Pick<User, 'id' | 'name'>
// { id: number; name: string }

// Все поля кроме указанных
type UserWithoutEmail = Omit<User, 'email'>
// { id: number; name: string; age: number }

// Запись с указанным типом ключей и значений
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>

// Только для чтения
type FrozenUser = Readonly<User>
```

### Комбинирование utility types

```ts
// Форма обновления пользователя: все поля кроме id, опциональные
type UpdateUser = Partial<Omit<User, 'id'>>
// { name?: string; email?: string; age?: number }
```

<DeepDive title="Как устроены utility types внутри">
Utility types реализованы через mapped types и conditional types. Например, `Partial`:

```ts
type Partial<T> = {
  [K in keyof T]?: T[K]
}
```

`keyof T` — union всех ключей типа `T`. `[K in ...]` — mapped type, перебирающий ключи. `?` — делает свойство опциональным. `T[K]` — тип свойства `K` в `T` (indexed access type).
</DeepDive>

## Класс как тип

В TypeScript класс одновременно создаёт **значение** (конструктор) и **тип** (форму экземпляра):

```ts
class Point {
  constructor(
    public x: number,
    public y: number
  ) {}

  distanceTo(other: Point): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }
}

// Point как тип — описывает форму экземпляра
function logPoint(p: Point) {
  console.log(`(${p.x}, ${p.y})`)
}

// Структурная типизация: объект-литерал совместим с классом!
logPoint({ x: 1, y: 2, distanceTo: () => 0 }) // ✅
```

## Итого

| Концепция | Когда использовать |
|-----------|-------------------|
| `type` | По умолчанию: union-ы, кортежи, mapped types |
| `interface` | Расширяемые объекты, declaration merging |
| `\|` (union) | Значение одного из нескольких типов |
| `&` (intersection) | Значение, удовлетворяющее всем типам |
| `readonly`, `?` | Защита от мутации, опциональность |
| Utility types | Трансформация существующих типов |
