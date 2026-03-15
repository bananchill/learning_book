import { Callout, DeepDive } from '@book/ui'

# Awaited и строковые типы

В этой подглаве рассмотрим `Awaited` для работы с промисами и четыре утилиты для манипуляции строковыми литеральными типами.

## Awaited&lt;T&gt;

Рекурсивно «разворачивает» тип `Promise`, извлекая конечное значение. Добавлен в **TypeScript 4.5**.

```typescript
// Простой Promise
type A = Awaited<Promise<string>>
// string

// Вложенные Promise (рекурсивная развёртка)
type B = Awaited<Promise<Promise<number>>>
// number

// Если не Promise — возвращает как есть
type C = Awaited<boolean>
// boolean

// Union с Promise
type D = Awaited<Promise<string> | number>
// string | number
```

```typescript
// Практический сценарий: типизация результатов async-функций
async function fetchUsers(): Promise<{ id: number; name: string }[]> {
  const response = await fetch('/api/users')
  return response.json()
}

// Извлекаем тип результата без вызова функции
type Users = Awaited<ReturnType<typeof fetchUsers>>
// { id: number; name: string }[]

// Полезно для Promise.all
async function loadDashboard() {
  const [users, stats, config] = await Promise.all([
    fetchUsers(),
    fetchStats(),
    fetchConfig()
  ])
  // TypeScript автоматически выводит типы через Awaited
}
```

```typescript
// Типизация универсальной функции-обёртки
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = 3
): Promise<Awaited<T>> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
    }
  }
  throw new Error('Все попытки исчерпаны')
}
```

<DeepDive title="Как устроен Awaited изнутри">

```typescript
type Awaited<T> =
  T extends null | undefined ? T :
  T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ?
    F extends ((value: infer V, ...args: infer _) => any) ?
      Awaited<V> :  // рекурсия для вложенных Promise
      never :
  T  // не thenable — вернуть как есть
```

TypeScript проверяет наличие метода `then` (thenable-протокол), извлекает тип первого аргумента `onfulfilled`, и рекурсивно разворачивает, если это тоже thenable.

</DeepDive>

## Строковые типы-утилиты

TypeScript 4.1 добавил **template literal types** и четыре встроенных утилиты для трансформации строковых литералов на уровне типов. Они реализованы как **интринсики компилятора** — их нельзя выразить через пользовательские типы.

### Uppercase&lt;S&gt;

Преобразует строковый литеральный тип в **ВЕРХНИЙ РЕГИСТР**.

```typescript
type Shout = Uppercase<'hello'>
// 'HELLO'

type Loud = Uppercase<'warning'>
// 'WARNING'

// С template literal types
type EventHandler<T extends string> = `on${Uppercase<T>}`

type ClickHandler = EventHandler<'click'>
// 'onCLICK'
```

### Lowercase&lt;S&gt;

Преобразует строковый литеральный тип в **нижний регистр**.

```typescript
type Quiet = Lowercase<'HELLO'>
// 'hello'

type NormalizedStatus = Lowercase<'ACTIVE' | 'INACTIVE' | 'BANNED'>
// 'active' | 'inactive' | 'banned'

// Нормализация ключей API
type ApiField<T extends string> = Lowercase<T>
type Field = ApiField<'UserName' | 'EMAIL'>
// 'username' | 'email'
```

### Capitalize&lt;S&gt;

Преобразует **первый символ** строкового литерала в верхний регистр.

```typescript
type Name = Capitalize<'alice'>
// 'Alice'

// Генерация имён геттеров
type Getter<T extends string> = `get${Capitalize<T>}`

type NameGetter = Getter<'name'>
// 'getName'

type AgeGetter = Getter<'age'>
// 'getAge'

// Автоматическая генерация геттеров для всех полей
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// { getName: () => string; getAge: () => number }
```

### Uncapitalize&lt;S&gt;

Преобразует **первый символ** строкового литерала в нижний регистр.

```typescript
type Lower = Uncapitalize<'Hello'>
// 'hello'

type CamelCase = Uncapitalize<'UserName'>
// 'userName'

// Преобразование имён компонентов в имена пропсов
type PropName<T extends string> = Uncapitalize<T>

type Prop = PropName<'IsVisible'>
// 'isVisible'
```

## Комбинирование строковых утилит

```typescript
// Паттерн: генерация типизированных событий из интерфейса
interface FormFields {
  username: string
  email: string
  password: string
}

// Генерируем типы для onChange-обработчиков
type ChangeHandlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void
}

type FormHandlers = ChangeHandlers<FormFields>
// {
//   onUsernameChange: (value: string) => void
//   onEmailChange: (value: string) => void
//   onPasswordChange: (value: string) => void
// }
```

```typescript
// Паттерн: CSS-свойства в camelCase → kebab-case на уровне типов
// (упрощённая версия)
type KebabPrefix<S extends string> =
  S extends `${infer C}${infer Rest}`
    ? C extends Uppercase<C>
      ? `-${Lowercase<C>}${KebabPrefix<Rest>}`
      : `${C}${KebabPrefix<Rest>}`
    : S

type ToKebab<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? `${Lowercase<First>}${KebabPrefix<Rest>}`
    : S

type Result = ToKebab<'backgroundColor'>
// 'background-color'

type Result2 = ToKebab<'borderTopWidth'>
// 'border-top-width'
```

<Callout type="tip">
Строковые утилитарные типы работают только со **строковыми литеральными типами** (`'hello'`), а не с типом `string` вообще. `Uppercase<string>` даст `string` — TypeScript не может трансформировать то, что не знает на этапе компиляции.
</Callout>

## Сводная таблица

| Утилита | Вход | Результат |
|---------|------|-----------|
| `Awaited<Promise<Promise<T>>>` | вложенные промисы | `T` |
| `Uppercase<'hello'>` | строковый литерал | `'HELLO'` |
| `Lowercase<'HELLO'>` | строковый литерал | `'hello'` |
| `Capitalize<'hello'>` | строковый литерал | `'Hello'` |
| `Uncapitalize<'Hello'>` | строковый литерал | `'hello'` |
