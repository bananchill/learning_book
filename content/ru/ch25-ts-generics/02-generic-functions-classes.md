import { Callout, DeepDive } from '@book/ui'

# Generic функции и классы

## Generic функции

```typescript
// Базовый синтаксис
function wrap<T>(value: T): { value: T } {
  return { value }
}

// Стрелочные функции
const unwrap = <T>(wrapper: { value: T }): T => wrapper.value

// Несколько параметров
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Иван', age: 30 }
const name = pick(user, 'name') // тип: string
const age = pick(user, 'age')   // тип: number
```

## Ограничения (Constraints)

Ограничения позволяют требовать, чтобы параметр типа имел определённые свойства:

```typescript
// T должен иметь свойство length
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b
}

longest('hello', 'world')    // OK — строки имеют length
longest([1, 2, 3], [4, 5])  // OK — массивы имеют length
// longest(1, 2)             // Ошибка — числа не имеют length

// keyof — ограничение ключами другого типа
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

<Callout type="warning">
Ограничение `extends` в дженериках — это не наследование классов! Это означает «должен быть совместим с / должен иметь такую форму».
</Callout>

## Generic классы

```typescript
// Простой generic контейнер
class Box<T> {
  private value: T

  constructor(value: T) {
    this.value = value
  }

  getValue(): T {
    return this.value
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value))
  }
}

const numBox = new Box(42)
const strBox = numBox.map(n => n.toString()) // Box<string>

// Generic стек
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  get size(): number {
    return this.items.length
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}

const stack = new Stack<number>()
stack.push(1)
stack.push(2)
console.log(stack.pop()) // 2
```

## Generic интерфейсы

```typescript
// Generic интерфейс для репозитория
interface Repository<T, ID = number> {
  findById(id: ID): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: ID): Promise<void>
}

interface User {
  id: number
  name: string
  email: string
}

// Реализация
class UserRepository implements Repository<User> {
  private users: User[] = []

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) ?? null
  }

  async findAll(): Promise<User[]> {
    return [...this.users]
  }

  async save(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id)
    if (index >= 0) {
      this.users[index] = user
    } else {
      this.users.push(user)
    }
    return user
  }

  async delete(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id)
  }
}
```

<DeepDive title="Вариантность в дженериках TypeScript">

TypeScript использует **структурную типизацию**, поэтому дженерики в TypeScript **бивариантны** для методов и **ковариантны** для readonly свойств.

```typescript
// Ковариантность: если Dog extends Animal,
// то ReadonlyArray<Dog> совместим с ReadonlyArray<Animal>
const dogs: ReadonlyArray<Dog> = []
const animals: ReadonlyArray<Animal> = dogs // OK

// Но Array<Dog> НЕ совместим с Array<Animal>
// (из-за возможности записи)
const mutableDogs: Array<Dog> = []
// const mutableAnimals: Array<Animal> = mutableDogs // Ошибка
```

Это важно для правильного моделирования типов коллекций.
</DeepDive>

## Значения по умолчанию для параметров типов

```typescript
// Параметр типа с дефолтным значением
interface ApiResponse<T = unknown> {
  data: T
  status: number
  message: string
}

// Использование без явного параметра
const response: ApiResponse = {
  data: 'что угодно',
  status: 200,
  message: 'OK'
}

// С явным параметром
const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'Иван', email: 'ivan@example.com' },
  status: 200,
  message: 'OK'
}
```
