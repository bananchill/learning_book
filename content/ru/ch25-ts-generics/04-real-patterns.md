import { Callout, DeepDive } from '@book/ui'

# Реальные паттерны

## Result<T, E> — обработка ошибок без исключений

Паттерн `Result` (известный как `Either` в функциональном программировании) позволяет явно обрабатывать ошибки:

```typescript
// Определение типа Result
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }

// Фабричные функции
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// Использование
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Деление на ноль')
  return ok(a / b)
}

const result = divide(10, 2)
if (result.ok) {
  console.log(result.value) // 5 — TypeScript знает, что value: number
} else {
  console.error(result.error) // TypeScript знает, что error: string
}
```

## Nullable<T> и Optional<T>

```typescript
// Nullable — может быть null
type Nullable<T> = T | null

// Optional — может быть undefined
type Optional<T> = T | undefined

// NonNullable — убирает null и undefined (встроенный)
type NonNullable<T> = T extends null | undefined ? never : T

// Пример использования
interface ApiUser {
  id: number
  name: string
  avatar: Nullable<string>     // аватар может отсутствовать
  bio: Optional<string>        // биография может быть не задана
}

function getAvatarUrl(avatar: Nullable<string>): string {
  return avatar ?? '/default-avatar.png'
}
```

## DeepReadonly<T>

```typescript
// Рекурсивный readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P]
}

interface Config {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      cert: string
    }
  }
  database: {
    url: string
  }
}

type FrozenConfig = DeepReadonly<Config>

const config: FrozenConfig = {
  server: {
    host: 'localhost',
    port: 3000,
    ssl: { enabled: true, cert: '/path/to/cert' }
  },
  database: { url: 'postgres://...' }
}

// config.server.host = 'other'     // Ошибка!
// config.server.ssl.enabled = false // Ошибка!
```

<Callout type="info">
В TypeScript 4.9+ встроен `Readonly<T>`, но он нерекурсивный. `DeepReadonly<T>` — полезный паттерн для иммутабельных конфигураций.
</Callout>

## Repository<T> — паттерн для работы с данными

```typescript
// Базовая сущность с идентификатором
interface Entity {
  id: number | string
}

// Generic репозиторий
interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>
  findAll(filter?: Partial<T>): Promise<T[]>
  create(data: Omit<T, 'id'>): Promise<T>
  update(id: T['id'], data: Partial<Omit<T, 'id'>>): Promise<T | null>
  delete(id: T['id']): Promise<boolean>
}

// Конкретная реализация
interface Post extends Entity {
  id: number
  title: string
  content: string
  authorId: number
  publishedAt: Date | null
}

class PostRepository implements Repository<Post> {
  private posts: Post[] = []
  private nextId = 1

  async findById(id: number): Promise<Post | null> {
    return this.posts.find(p => p.id === id) ?? null
  }

  async findAll(filter?: Partial<Post>): Promise<Post[]> {
    if (!filter) return [...this.posts]
    return this.posts.filter(post =>
      Object.entries(filter).every(([key, value]) =>
        post[key as keyof Post] === value
      )
    )
  }

  async create(data: Omit<Post, 'id'>): Promise<Post> {
    const post: Post = { ...data, id: this.nextId++ }
    this.posts.push(post)
    return post
  }

  async update(id: number, data: Partial<Omit<Post, 'id'>>): Promise<Post | null> {
    const index = this.posts.findIndex(p => p.id === id)
    if (index < 0) return null
    this.posts[index] = { ...this.posts[index], ...data }
    return this.posts[index]
  }

  async delete(id: number): Promise<boolean> {
    const before = this.posts.length
    this.posts = this.posts.filter(p => p.id !== id)
    return this.posts.length < before
  }
}
```

<DeepDive title="Builder паттерн с дженериками">

Дженерики отлично подходят для реализации паттерна Builder с типобезопасностью:

```typescript
// Builder, который отслеживает установленные поля
class QueryBuilder<T extends object, Set extends keyof T = never> {
  private conditions: Partial<T> = {}

  where<K extends keyof T>(
    key: K,
    value: T[K]
  ): QueryBuilder<T, Set | K> {
    (this.conditions as any)[key] = value
    return this as any
  }

  build(): Pick<T, Set> {
    return this.conditions as Pick<T, Set>
  }
}

interface UserQuery {
  name: string
  age: number
  city: string
}

const query = new QueryBuilder<UserQuery>()
  .where('name', 'Иван')
  .where('city', 'Москва')
  .build()
// Тип: { name: string, city: string }
// TypeScript знает, что установлены только name и city
```
</DeepDive>
