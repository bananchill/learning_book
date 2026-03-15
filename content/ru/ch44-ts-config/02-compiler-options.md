---
title: "Ключевые опции компилятора"
parent: "ch44-ts-config"
order: 2
---

## Обзор

В `compilerOptions` — десятки настроек. Разберём самые важные, сгруппированные по назначению.

## Строгость: strict и его флаги

### strict

```jsonc
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` включает **все** строгие проверки одной строкой. Это рекомендуемая настройка для новых проектов. Вот что она включает:

| Флаг | Что делает |
|------|-----------|
| `noImplicitAny` | Ошибка, если тип выведен как `any` |
| `strictNullChecks` | `null` и `undefined` — отдельные типы |
| `strictFunctionTypes` | Строгая проверка типов параметров функций |
| `strictBindCallApply` | Строгая проверка `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Свойства класса должны быть инициализированы |
| `noImplicitThis` | Ошибка, если `this` имеет тип `any` |
| `useUnknownInCatchVariables` | `catch (e)` — тип `unknown`, а не `any` |
| `alwaysStrict` | Добавляет `"use strict"` в каждый файл |

### Зачем включать strict

Без `strict` TypeScript позволяет многое, что ведёт к ошибкам в рантайме:

```ts
// Без noImplicitAny — TypeScript молча ставит any
function double(x) {
  //             ^ тип: any — никакой проверки
  return x * 2;
}
double("hello"); // NaN в рантайме, но TypeScript молчит

// Без strictNullChecks — null прячется в типах
function getLength(s: string) {
  return s.length;
}
getLength(null); // TypeError в рантайме, но TypeScript молчит
```

С `strict: true` обе эти ошибки найдены при компиляции.

### Стратегия миграции

Для существующего проекта включать `strict` сразу может быть больно. Включай флаги по одному:

```jsonc
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true,          // Шаг 1
    "strictNullChecks": true,        // Шаг 2
    "strictFunctionTypes": true,     // Шаг 3
    // ... и так далее
  }
}
```

## Целевая среда: target и lib

### target

Определяет версию JavaScript на выходе:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

TypeScript выполняет **даунлевелинг** — преобразует новый синтаксис в старый:

```ts
// Исходный код
const name = "World";
const greeting = `Hello, ${name}!`;

// target: ES5 — шаблонные строки недоступны
var name = "World";
var greeting = "Hello, ".concat(name, "!");

// target: ES2015+ — шаблонные строки остаются
const name = "World";
const greeting = `Hello, ${name}!`;
```

Рекомендуемые значения:
- **Node.js 20+**: `ES2022` или `ES2023`
- **Современные браузеры**: `ES2022`
- **Поддержка старых браузеров**: `ES2015` (но лучше оставить это бандлеру)

> `target` влияет только на **синтаксис**. Он не добавляет полифиллы для новых API (например, `Array.prototype.at()`). Для этого нужна опция `lib`.

### lib

Определяет, какие **типы встроенных API** доступны:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  }
}
```

- `ES2022` — типы для `Array.prototype.at()`, `Object.hasOwn()` и т.д.
- `DOM` — типы для `document`, `window`, `HTMLElement`
- `DOM.Iterable` — `NodeList` iterable, `forEach` и т.д.

Для Node.js проекта `DOM` не нужен:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"]
  }
}
```

Если `lib` не указан, TypeScript подбирает его автоматически на основе `target`.

## Модульная система: module и moduleResolution

### module

Определяет формат модулей в выходном коде:

```jsonc
{
  "compilerOptions": {
    "module": "ESNext"
  }
}
```

| Значение | Формат выхода | Когда использовать |
|----------|--------------|-------------------|
| `CommonJS` | `require()` / `module.exports` | Старый Node.js |
| `ES2015` / `ES2020` / `ESNext` | `import` / `export` | Современный Node.js, бандлеры |
| `NodeNext` | Зависит от `package.json` `"type"` | Node.js с ESM |
| `Preserve` | Не трансформирует импорты | Бандлеры (Vite, webpack) |

Для бандлера (Vite, webpack):

```jsonc
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### moduleResolution

Определяет, **как TypeScript находит модули** по строке импорта:

```jsonc
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

| Значение | Описание |
|----------|---------|
| `node10` (ранее `node`) | Алгоритм Node.js для CommonJS |
| `node16` / `nodenext` | Алгоритм Node.js для ESM + CJS |
| `bundler` | Как `node16`, но без обязательных расширений в импортах |
| `classic` | Устаревший, не используй |

**Для бандлера** (Vite, webpack, esbuild) используй `bundler` — он не требует расширений файлов в импортах:

```ts
// moduleResolution: "bundler" — работает без расширений
import { utils } from "./utils";
import { Button } from "@/components/Button";

// moduleResolution: "nodenext" — требует расширения
import { utils } from "./utils.js";
```

## Совместимость: esModuleInterop и isolatedModules

### esModuleInterop

Многие npm-пакеты (lodash, express, React) используют CommonJS-экспорт:

```js
// CommonJS-пакет (lodash)
module.exports = { chunk, map, filter };
```

Без `esModuleInterop` их нужно импортировать так:

```ts
// Без esModuleInterop — некрасивый синтаксис
import * as lodash from "lodash";
import * as React from "react";
```

С `esModuleInterop: true` работает привычный синтаксис:

```ts
// С esModuleInterop — стандартный import
import lodash from "lodash";
import React from "react";
```

Включай **всегда**. Это стандарт де-факто.

### isolatedModules

```jsonc
{
  "compilerOptions": {
    "isolatedModules": true
  }
}
```

Многие инструменты (Babel, esbuild, SWC, Vite) компилируют каждый файл **отдельно**, без знания о всём проекте. Некоторые конструкции TypeScript работают только при компиляции всего проекта:

```ts
// Re-export типа — esbuild/Babel не знают, что Foo это тип
export { Foo } from "./types";
// Решение: export type { Foo } from "./types";

// const enum — подставляет значения из другого файла
const enum Direction { Up, Down }
// Решение: обычный enum или union type

// Файл без экспортов — не считается модулем
const x = 1;
// Решение: добавить export {} в конец файла
```

`isolatedModules: true` предупредит об этих проблемах. **Включай всегда**, если используешь Vite, esbuild или любой бандлер.

## Выходные файлы: declaration, sourceMap, outDir, rootDir

### declaration

```jsonc
{
  "compilerOptions": {
    "declaration": true
  }
}
```

Генерирует `.d.ts`-файлы с типами. Необходимо для:
- npm-пакетов (чтобы потребители получили типы)
- Монорепо (чтобы другие пакеты видели типы)

```ts
// src/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// Сгенерированный dist/math.d.ts
export declare function add(a: number, b: number): number;
```

### sourceMap

```jsonc
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

Генерирует `.js.map`-файлы. Позволяет отлаживать TypeScript-код в браузере или Node.js — дебаггер покажет исходный `.ts`, а не скомпилированный `.js`.

### outDir и rootDir

```jsonc
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

- `outDir` — куда складывать скомпилированные файлы
- `rootDir` — корень исходников (определяет структуру внутри `outDir`)

```
// Структура проекта
src/
  index.ts
  utils/
    math.ts

// С rootDir: "./src", outDir: "./dist"
dist/
  index.js
  utils/
    math.js

// Без rootDir — TypeScript вычислит корень сам
// Если есть файлы вне src/, структура может быть неожиданной
```

### skipLibCheck

```jsonc
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

Пропускает проверку типов в `.d.ts`-файлах. Это **значительно** ускоряет компиляцию, потому что TypeScript не проверяет типы в `node_modules`. Включай **всегда** — ошибки в чужих `.d.ts` не твоя проблема.

## Рекомендуемые конфиги

### Для Vite-проекта (фронтенд)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "jsx": "preserve",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

`noEmit: true` — потому что Vite компилирует код сам, TypeScript используется только для проверки типов.

### Для Node.js-библиотеки

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## Итоги

| Опция | Рекомендация | Зачем |
|-------|-------------|-------|
| `strict` | `true` | Максимум проверок типов |
| `target` | `ES2022` | Современный JS без лишнего даунлевелинга |
| `module` | `ESNext` / `NodeNext` | ESM как стандарт |
| `moduleResolution` | `bundler` / `nodenext` | Правильное разрешение модулей |
| `esModuleInterop` | `true` | Нормальные импорты CJS-пакетов |
| `isolatedModules` | `true` | Совместимость с бандлерами |
| `skipLibCheck` | `true` | Скорость компиляции |
| `declaration` | `true` (библиотеки) | Типы для потребителей |
| `sourceMap` | `true` | Отладка в исходниках |
