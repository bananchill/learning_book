import { Callout, DeepDive } from '@book/ui'

# Трансформация объектов

Самая частая задача при работе с типами — изменить свойства существующего объектного типа: сделать все поля необязательными, только для чтения, выбрать подмножество ключей. TypeScript предоставляет для этого шесть встроенных утилит.

## Partial&lt;T&gt;

Делает **все свойства** типа `T` необязательными (`?`). Полезен для функций обновления, где нужно передать только изменённые поля.

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Все поля стали необязательными
type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

// Типичный сценарий: функция обновления
function updateUser(id: number, updates: Partial<User>): User {
  const existing = getUserById(id)
  return { ...existing, ...updates }
}

// Можно передать только те поля, которые меняются
updateUser(1, { name: 'Новое имя' })         // OK
updateUser(1, { email: 'new@example.com' })   // OK
updateUser(1, {})                              // OK — ничего не обновляем
```

<DeepDive title="Как устроен Partial изнутри">

```typescript
// Реализация через mapped type
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

`keyof T` возвращает union всех ключей T, а модификатор `?` делает каждое свойство необязательным.

</DeepDive>

## Required&lt;T&gt;

Противоположность `Partial` — делает **все свойства обязательными**, удаляя модификатор `?`.

```typescript
interface Config {
  host?: string
  port?: number
  debug?: boolean
}

// Все поля стали обязательными
type FullConfig = Required<Config>
// { host: string; port: number; debug: boolean }

// Полезно для валидированных конфигов
function startServer(config: Required<Config>) {
  // Уверены, что все поля определены
  console.log(`Запуск на ${config.host}:${config.port}`)
}

// Ошибка — debug не указан
// startServer({ host: 'localhost', port: 3000 })

// OK — все поля на месте
startServer({ host: 'localhost', port: 3000, debug: false })
```

<DeepDive title="Как устроен Required изнутри">

```typescript
// Модификатор -? удаляет необязательность
type Required<T> = {
  [P in keyof T]-?: T[P]
}
```

Префикс `-` перед `?` — это синтаксис удаления модификатора.

</DeepDive>

## Readonly&lt;T&gt;

Делает **все свойства** типа только для чтения. Присваивание в такое свойство вызовет ошибку компиляции.

```typescript
interface State {
  count: number
  items: string[]
}

const state: Readonly<State> = {
  count: 0,
  items: ['a', 'b']
}

// Ошибка: Cannot assign to 'count' because it is a read-only property
// state.count = 1

// Внимание: Readonly — неглубокий! Вложенные объекты остаются мутабельными
state.items.push('c') // OK — массив сам по себе не readonly
```

<Callout type="warning">
`Readonly<T>` работает **неглубоко** (shallow). Для глубокой иммутабельности используйте рекурсивный тип `DeepReadonly<T>` или библиотеку вроде `ts-essentials`.
</Callout>

<DeepDive title="Как устроен Readonly изнутри">

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

Модификатор `readonly` добавляется к каждому свойству через mapped type.

</DeepDive>

## Record&lt;K, T&gt;

Создаёт объектный тип, в котором **ключи** имеют тип `K`, а **значения** — тип `T`. Удобен для словарей и lookup-таблиц.

```typescript
// Словарь: ключи — строки, значения — числа
type PriceList = Record<string, number>

const prices: PriceList = {
  apple: 120,
  banana: 80,
  cherry: 350
}

// Ключи ограничены конкретным union
type Role = 'admin' | 'editor' | 'viewer'

interface Permission {
  read: boolean
  write: boolean
  delete: boolean
}

// Каждой роли соответствует объект с разрешениями
const permissions: Record<Role, Permission> = {
  admin:  { read: true, write: true, delete: true },
  editor: { read: true, write: true, delete: false },
  viewer: { read: true, write: false, delete: false }
}
```

<DeepDive title="Как устроен Record изнутри">

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

`keyof any` — это `string | number | symbol`, то есть все допустимые типы ключей объекта.

</DeepDive>

## Pick&lt;T, K&gt;

Создаёт тип, **выбирая** только указанные свойства `K` из типа `T`.

```typescript
interface Article {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
  updatedAt: Date
}

// Только id и title
type ArticlePreview = Pick<Article, 'id' | 'title'>
// { id: number; title: string }

// Для списка статей не нужен полный контент
function getArticleList(): ArticlePreview[] {
  return articles.map(a => ({ id: a.id, title: a.title }))
}

// Комбинирование: выбираем и делаем необязательными
type OptionalDates = Partial<Pick<Article, 'createdAt' | 'updatedAt'>>
// { createdAt?: Date; updatedAt?: Date }
```

<DeepDive title="Как устроен Pick изнутри">

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

`K extends keyof T` гарантирует, что выбранные ключи существуют в исходном типе.

</DeepDive>

## Omit&lt;T, K&gt;

Противоположность `Pick` — создаёт тип, **исключая** указанные свойства `K`.

```typescript
interface User {
  id: number
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

// Всё, кроме чувствительных данных
type PublicUser = Omit<User, 'passwordHash'>
// { id: number; name: string; email: string; createdAt: Date }

// Для создания — без id и createdAt (их генерирует сервер)
type CreateUserDto = Omit<User, 'id' | 'createdAt'>
// { name: string; email: string; passwordHash: string }

function createUser(dto: CreateUserDto): User {
  return {
    id: generateId(),
    createdAt: new Date(),
    ...dto
  }
}
```

<Callout type="tip">
Используйте `Pick`, когда список нужных полей **короче** списка ненужных, и `Omit`, когда нужно исключить **несколько** полей из большого типа.
</Callout>

<DeepDive title="Как устроен Omit изнутри">

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

`Omit` реализован через `Pick` и `Exclude`: из всех ключей T исключаются ключи K, затем Pick выбирает оставшиеся.

</DeepDive>

## Комбинирование утилит

Утилитарные типы раскрывают свою мощь при комбинировании:

```typescript
interface Entity {
  id: number
  name: string
  description: string
  status: 'active' | 'archived'
  metadata: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

// DTO для создания: без id и дат
type CreateDto = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>

// DTO для обновления: без id и дат, все поля опциональные
type UpdateDto = Partial<Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>

// Только для чтения: все поля readonly
type ReadonlyEntity = Readonly<Entity>

// Превью: только ключевые поля
type EntityPreview = Pick<Entity, 'id' | 'name' | 'status'>
```
