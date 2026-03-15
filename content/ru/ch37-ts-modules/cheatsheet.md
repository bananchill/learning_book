---
title: "Шпаргалка: Модули и пространства имён"
description: "Краткий справочник по модулям, module resolution, namespaces и declaration merging в TypeScript"
---

## Import / Export

```ts
// Именованный экспорт / импорт
export function fn() {}
export const VALUE = 42;
import { fn, VALUE } from "./module";

// Default экспорт / импорт
export default class MyClass {}
import MyClass from "./module";

// Реэкспорт
export { fn } from "./module";
export { default as Name } from "./module";
export * from "./module";
export * as Ns from "./module";

// Импорт только типов (стирается при компиляции)
import type { MyType } from "./types";
import { type MyType, myValue } from "./module";
export type { MyType } from "./types";

// Импорт всего модуля
import * as utils from "./utils";

// Динамический импорт
const { fn } = await import("./module");

// CommonJS interop (устаревший синтаксис)
export = value;
import value = require("./module");
```

## Module Resolution — tsconfig.json

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./packages/shared/src/*"]
    },
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "vitest/globals"],
    "esModuleInterop": true,
    "verbatimModuleSyntax": true
  }
}
```

| Стратегия | Когда использовать |
|-----------|-------------------|
| `node16` / `nodenext` | Node.js проекты |
| `bundler` | Vite, webpack, esbuild |
| `node10` | Legacy CJS проекты |
| `classic` | Не используй |

## Namespace

```ts
// Объявление
namespace Validation {
  export interface Rule { isValid(s: string): boolean; }
  export class EmailRule implements Rule {
    isValid(s: string) { return s.includes("@"); }
  }
}

// Использование
const rule = new Validation.EmailRule();

// Псевдоним
import EmailRule = Validation.EmailRule;
```

## Declaration Merging

```ts
// Слияние интерфейсов
interface Config { host: string; }
interface Config { port: number; }
// Результат: { host: string; port: number; }

// Namespace + Class (статические члены)
class Api { /* ... */ }
namespace Api {
  export interface Options { timeout: number; }
}

// Namespace + Function (свойства функции)
function handler(req: Request): void { /* ... */ }
namespace handler {
  export const method = "GET";
}

// Namespace + Enum (утилиты для enum)
enum Status { Active, Inactive }
namespace Status {
  export function parse(s: string): Status { /* ... */ }
}
```

## Module Augmentation

```ts
// Расширение стороннего модуля
import "express";
declare module "express" {
  interface Request { userId?: string; }
}

// Global Augmentation
export {};
declare global {
  interface Window { __APP__: string; }
  interface Array<T> { first(): T | undefined; }
}

// Расширение process.env (без import — автоматически глобально)
declare namespace NodeJS {
  interface ProcessEnv { API_KEY: string; }
}
```

## Быстрые решения

| Проблема | Решение |
|----------|---------|
| Модуль не найден | Проверь `moduleResolution` и `paths` в tsconfig |
| `.js` в импорте `.ts`-файла | Нормально при `node16` — пиши `.js` |
| Нет типов для пакета | `npm i -D @types/имя_пакета` |
| Расширить тип библиотеки | `declare module "имя"` в `.d.ts` |
| Скрипт утекает в глобальный скоуп | Добавь `export {}` |
| `require` в ESM | Используй `import` или `createRequire` |
