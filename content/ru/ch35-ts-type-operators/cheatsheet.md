---
title: "Шпаргалка: операторы типов"
parent: "ch35-ts-type-operators"
---

## keyof

```ts
// Union ключей объектного типа
type Keys = keyof { a: string; b: number };        // "a" | "b"

// Числовая индексная сигнатура
type K1 = keyof { [n: number]: unknown };           // number

// Строковая индексная сигнатура
type K2 = keyof { [k: string]: boolean };           // string | number

// С intersection: все ключи
type K3 = keyof (A & B);                            // keyof A | keyof B

// С union: только общие ключи
type K4 = keyof (A | B);                            // keyof A & keyof B
```

## typeof (в контексте типов)

```ts
const value = "hello";
type V = typeof value;                              // "hello" (литеральный)

let mutable = "hello";
type M = typeof mutable;                            // string (расширенный)

const config = { port: 3000, debug: true };
type Config = typeof config;                        // { port: number; debug: boolean }

function fn() { return { x: 1 }; }
type Result = ReturnType<typeof fn>;                // { x: number }

// Нельзя: typeof fn() — ошибка
```

## Индексные типы доступа T[K]

```ts
type Person = { name: string; age: number; alive: boolean };

type Age = Person["age"];                           // number
type Sub = Person["age" | "name"];                  // number | string
type All = Person[keyof Person];                    // string | number | boolean

// Тип элемента массива
type Item = string[][number];                       // string
type El = (typeof arr)[number];                     // тип элемента arr
```

## Частые комбинации

```ts
// Ключи объекта-значения
type Keys = keyof typeof obj;

// Тип возвращаемого значения
type Ret = ReturnType<typeof fn>;

// Тип элемента массива-значения
type El = (typeof arr)[number];

// Union всех значений объекта-значения
type Values = (typeof obj)[keyof typeof obj];

// Тип конкретного свойства элемента массива
type Prop = (typeof arr)[number]["propName"];

// Типобезопасный доступ к свойству
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## as const + typeof

```ts
const STATUS = { OK: 200, ERR: 500 } as const;

type Name = keyof typeof STATUS;                    // "OK" | "ERR"
type Code = (typeof STATUS)[keyof typeof STATUS];   // 200 | 500

const ROLES = ["admin", "user", "guest"] as const;
type Role = (typeof ROLES)[number];                 // "admin" | "user" | "guest"
```
