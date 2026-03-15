---
title: "Шпаргалка: Введение в TypeScript"
parent: "ch32-ts-intro"
---

## Установка

```sh
npm install -g typescript    # Глобально
npm install -D typescript    # В проект
tsc --version                # Проверка версии
tsc --init                   # Создать tsconfig.json
```

## Компиляция

```sh
tsc hello.ts                 # Компилировать файл
tsc --noEmitOnError hello.ts # Не генерировать JS при ошибках
tsc --target es2015 hello.ts # Указать версию JS
tsc --watch                  # Режим наблюдения
```

## Аннотации типов

```ts
// Параметры функции
function greet(name: string, age: number): string {
  return `Hello ${name}, you are ${age}`;
}

// Переменные (обычно не нужно — вывод типов)
let count: number = 0;
let name = "Alice"; // TypeScript определит string сам
```

## Интерфейсы

```ts
interface User {
  name: string;
  id: number;
  email?: string; // Необязательное свойство
}

const user: User = { name: "Alice", id: 1 };
```

## Объединения (Unions)

```ts
type Status = "open" | "closed" | "pending";

function format(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}
```

## Стирание типов

```ts
// TypeScript                    // JavaScript (после tsc)
function add(a: number,          function add(a,
             b: number): number {            b) {
  return a + b;                    return a + b;
}                                }
```

## Строгий режим

```json
// tsconfig.json — рекомендация для нового проекта
{
  "compilerOptions": {
    "target": "es2020",
    "strict": true,
    "noEmitOnError": true
  }
}
```

## Ключевые флаги strict

| Флаг | Что запрещает |
|------|--------------|
| `noImplicitAny` | Неявный `any` |
| `strictNullChecks` | `null`/`undefined` в не-nullable типах |
| `strictFunctionTypes` | Бивариантность параметров функций |
| `strictPropertyInitialization` | Неинициализированные свойства класса |

## Запуск TS-кода

```sh
npx tsx hello.ts      # Быстрый запуск через tsx
npx ts-node hello.ts  # Запуск через ts-node
tsc && node hello.js  # Классический путь
```
