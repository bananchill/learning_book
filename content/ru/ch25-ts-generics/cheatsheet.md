import { Callout } from '@book/ui'

# Шпаргалка: Дженерики TypeScript

## Синтаксис

```typescript
// Функция
function identity<T>(value: T): T { return value }

// Стрелочная функция
const identity = <T>(value: T): T => value

// Класс
class Container<T> { constructor(public value: T) {} }

// Интерфейс
interface Wrapper<T> { value: T }

// Алиас типа
type Pair<A, B> = [A, B]
```

## Ограничения (Constraints)

```typescript
function getLength<T extends { length: number }>(x: T): number
function pick<T, K extends keyof T>(obj: T, key: K): T[K]
```

## Условные типы

```typescript
type IsArray<T> = T extends any[] ? true : false
type Unwrap<T> = T extends Array<infer E> ? E : T
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

## Полезные паттерны

| Паттерн | Описание |
|---------|----------|
| `Result<T, E>` | Явная обработка ошибок |
| `Nullable<T>` | `T \| null` |
| `Optional<T>` | `T \| undefined` |
| `DeepReadonly<T>` | Рекурсивный readonly |
| `Repository<T>` | Абстракция хранилища |

## Встроенные utility types

```typescript
ReturnType<typeof fn>        // тип возвращаемого значения
Parameters<typeof fn>        // типы параметров
ConstructorParameters<typeof Class>  // параметры конструктора
InstanceType<typeof Class>   // тип экземпляра
Awaited<Promise<T>>          // распаковка Promise
```

<Callout type="tip">
Дженерики — это мощный инструмент, но не злоупотребляйте ими. Если тип не нужно параметризировать — не используйте дженерики.
</Callout>
