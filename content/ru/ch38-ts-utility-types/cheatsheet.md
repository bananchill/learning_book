import { Callout } from '@book/ui'

# Шпаргалка: Утилитарные типы TypeScript

## Трансформация объектов

| Утилита | Описание | Пример |
|---------|----------|--------|
| `Partial<T>` | Все свойства необязательные | `Partial<{a: string}>` → `{a?: string}` |
| `Required<T>` | Все свойства обязательные | `Required<{a?: string}>` → `{a: string}` |
| `Readonly<T>` | Все свойства только для чтения | `Readonly<{a: string}>` → `{readonly a: string}` |
| `Record<K, T>` | Объект с ключами K и значениями T | `Record<'a'\|'b', number>` → `{a: number; b: number}` |
| `Pick<T, K>` | Выбрать свойства K из T | `Pick<{a:1; b:2; c:3}, 'a'\|'b'>` → `{a:1; b:2}` |
| `Omit<T, K>` | Исключить свойства K из T | `Omit<{a:1; b:2; c:3}, 'c'>` → `{a:1; b:2}` |

## Работа с union-типами

| Утилита | Описание | Пример |
|---------|----------|--------|
| `Exclude<U, E>` | Удалить из U члены, совместимые с E | `Exclude<'a'\|'b'\|'c', 'a'>` → `'b'\|'c'` |
| `Extract<T, U>` | Извлечь из T члены, совместимые с U | `Extract<'a'\|'b'\|'c', 'a'\|'b'>` → `'a'\|'b'` |
| `NonNullable<T>` | Удалить null и undefined | `NonNullable<string\|null>` → `string` |
| `NoInfer<T>` | Запретить вывод типа из этой позиции | Не участвует в type inference |

## Типы функций и классов

| Утилита | Описание | Пример |
|---------|----------|--------|
| `Parameters<T>` | Кортеж типов параметров | `Parameters<(a: string, b: number) => void>` → `[string, number]` |
| `ConstructorParameters<T>` | Параметры конструктора | `ConstructorParameters<typeof Error>` → `[message?: string]` |
| `ReturnType<T>` | Тип возвращаемого значения | `ReturnType<() => number>` → `number` |
| `InstanceType<T>` | Тип экземпляра класса | `InstanceType<typeof Date>` → `Date` |
| `ThisParameterType<T>` | Тип параметра this | Извлекает тип из `this: Type` |
| `OmitThisParameter<T>` | Удалить параметр this | Функция без `this` |
| `ThisType<T>` | Маркер контекста this | Устанавливает `this` для объектного литерала |

## Awaited и строковые типы

| Утилита | Описание | Пример |
|---------|----------|--------|
| `Awaited<T>` | Развернуть Promise | `Awaited<Promise<string>>` → `string` |
| `Uppercase<S>` | Верхний регистр | `Uppercase<'hello'>` → `'HELLO'` |
| `Lowercase<S>` | Нижний регистр | `Lowercase<'HELLO'>` → `'hello'` |
| `Capitalize<S>` | Первая буква заглавная | `Capitalize<'hello'>` → `'Hello'` |
| `Uncapitalize<S>` | Первая буква строчная | `Uncapitalize<'Hello'>` → `'hello'` |

## Типичные комбинации

```typescript
// DTO для создания: без id и дат, все поля обязательные
type CreateDto<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// DTO для обновления: без id и дат, все поля необязательные
type UpdateDto<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

// Только для чтения preview
type Preview<T, K extends keyof T> = Readonly<Pick<T, K>>

// Тип результата async-функции
type AsyncResult<T extends (...args: any) => any> = Awaited<ReturnType<T>>

// Геттеры из интерфейса
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}
```

<Callout type="tip">
Утилитарные типы — это обычные дженерики из `lib.es5.d.ts`. Изучите их реализацию: это лучший способ понять mapped types, conditional types и infer.
</Callout>
