import { Callout } from '@book/ui'

# Шпаргалка: Продвинутые типы TypeScript

## Mapped Types

```typescript
// Базовый синтаксис
type T = { [K in keyof Source]: Source[K] }

// Модификаторы
type Partial<T>  = { [K in keyof T]?: T[K] }        // добавить ?
type Required<T> = { [K in keyof T]-?: T[K] }        // убрать ?
type Readonly<T> = { readonly [K in keyof T]: T[K] } // добавить readonly
type Mutable<T>  = { -readonly [K in keyof T]: T[K] } // убрать readonly

// Переименование ключей
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] }
```

## Conditional Types

```typescript
type IsArray<T> = T extends any[] ? true : false
type NonNullable<T> = T extends null | undefined ? never : T
type Extract<T, U> = T extends U ? T : never
type Exclude<T, U> = T extends U ? never : T
```

## Template Literal Types

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`
type CSSProp = `${'margin' | 'padding'}-${'top' | 'bottom' | 'left' | 'right'}`
```

## Стандартные Utility Types

```typescript
Pick<User, 'id' | 'name'>     // выбрать поля
Omit<User, 'password'>        // убрать поля
Record<string, number>         // словарь
ReturnType<typeof fn>          // тип возврата
Parameters<typeof fn>          // типы параметров
```

<Callout type="tip">
Комбинируйте utility types: `Partial<Pick<User, 'name' | 'email'>>` — опциональный поддип User.
</Callout>
