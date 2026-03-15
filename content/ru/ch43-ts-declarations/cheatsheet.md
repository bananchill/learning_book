---
title: "Шпаргалка: Declaration Files"
parent: "ch43-ts-declarations"
---

## Генерация .d.ts

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,          // Генерировать .d.ts
    "declarationDir": "dist",     // Директория для .d.ts
    "emitDeclarationOnly": true   // Только .d.ts, без .js
  }
}
```

## Ambient-декларации

```ts
declare var DEBUG: boolean;                     // Глобальная переменная
declare const VERSION: string;                  // Глобальная константа
declare function log(msg: string): void;        // Глобальная функция
declare class Logger { info(msg: string): void; } // Глобальный класс
declare namespace MyLib { function init(): void; } // Пространство имён
declare enum Color { Red, Green, Blue }         // Перечисление
```

## Шаблоны .d.ts

```ts
// Модуль-функция
export default function parse(input: string): Result;

// Модуль-класс
declare class MyClass { constructor(); }
export default MyClass;

// UMD-библиотека
export as namespace myLib;
export default function myLib(): void;
```

## Module Augmentation

```ts
// Расширение стороннего модуля
import "express";
declare module "express" {
  interface Request {
    user?: { id: string };
  }
}
```

## Global Augmentation

```ts
// Расширение глобальных типов из модуля
export {};
declare global {
  interface Window { analytics: Analytics; }
  var __DEV__: boolean;
}
```

## Wildcard-модули

```ts
declare module "*.png" { const src: string; export default src; }
declare module "*.svg" { const src: string; export default src; }
declare module "*.css" { const c: Record<string, string>; export default c; }
```

## Triple-Slash Directives

```ts
/// <reference path="./globals.d.ts" />    // Зависимость от файла
/// <reference types="node" />             // Зависимость от @types
/// <reference lib="es2015.promise" />     // Встроенная библиотека
```

## Установка типов

```sh
npm install -D @types/node       # Типы для Node.js
npm install -D @types/express    # Типы для Express
npm install -D @types/lodash     # Типы для Lodash
```

## package.json для библиотеки

```json
{
  "name": "my-lib",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "typesVersions": {
    ">=5.0": { "*": ["dist/v5/*"] },
    "*":     { "*": ["dist/v4/*"] }
  }
}
```

## Do's and Don'ts

| Do | Don't |
|----|-------|
| `callback: () => void` | `callback: () => any` |
| `value: string` | `value: String` |
| `data: unknown` | `data: any` |
| Конкретные перегрузки первыми | Общие перегрузки первыми |
| Optional-параметры `fn(x?: T)` | Перегрузки для опциональности |

## Быстрая заглушка

```ts
// Подавить ошибку для модуля без типов
declare module "untyped-lib";  // Все экспорты -- any
```

## Тестирование деклараций

```ts
import { fn } from "my-lib";
const result: number = fn("test"); // Проверяем тип возврата

// @ts-expect-error -- должна быть ошибка
fn(123);
```

## Порядок поиска типов

1. Встроенные `lib.d.ts`
2. `"types"` в `package.json` библиотеки
3. `node_modules/@types/`
4. Локальные `.d.ts` в проекте
5. `"typeRoots"` в `tsconfig.json`
