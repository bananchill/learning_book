# Шпаргалка: Перечисления (Enums)

## Объявление enum

```typescript
// Числовой enum (auto-increment от 0)
enum Direction { Up, Down, Left, Right }

// Числовой enum с начальным значением
enum Status { Active = 1, Inactive, Deleted }

// Строковый enum (все значения явные)
enum Color { Red = "RED", Green = "GREEN", Blue = "BLUE" }

// const enum (инлайнится, нет рантайм-объекта)
const enum HttpMethod { Get = "GET", Post = "POST" }

// Ambient enum (описание внешнего enum)
declare enum ExternalEnum { A = 1, B = 2 }
```

## Битовые флаги

```typescript
enum Permission {
  None    = 0,
  Read    = 1 << 0,  // 1
  Write   = 1 << 1,  // 2
  Execute = 1 << 2,  // 4
  All     = Read | Write | Execute, // 7
}

// Комбинирование
const perms = Permission.Read | Permission.Write; // 3

// Проверка
(perms & Permission.Read) === Permission.Read; // true
```

## Полезные типы

```typescript
enum E { A, B, C }

// Ключи enum
type Keys = keyof typeof E;          // "A" | "B" | "C"

// Значения enum
type Values = (typeof E)[keyof typeof E]; // E.A | E.B | E.C
```

## Reverse mapping (только числовой)

```typescript
enum Status { Ok = 200, NotFound = 404 }
Status[200];        // "Ok"
Status["Ok"];       // 200
Status.NotFound;    // 404
```

## as const альтернатива

```typescript
const STATUS = {
  Ok: 200,
  NotFound: 404,
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS]; // 200 | 404
```

## Что выбрать

| Ситуация | Выбор |
|----------|-------|
| Битовые флаги | `enum` (числовой) |
| Нужен reverse mapping | `enum` (числовой) |
| Строковые константы | `as const` объект или строковый `enum` |
| Библиотека (npm) | `as const` объект |
| `isolatedModules: true` | `as const` объект или обычный `enum` |
| Максимальная оптимизация | `const enum` (с оговорками) |
