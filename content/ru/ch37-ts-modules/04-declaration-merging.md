---
title: "Declaration Merging"
description: "Слияние интерфейсов, пространств имён, расширение модулей и глобальной области видимости"
---

## Что такое Declaration Merging

Declaration Merging (слияние деклараций) — механизм TypeScript, при котором компилятор объединяет несколько деклараций с одним именем в одну. Это мощный инструмент для расширения существующих типов.

Три категории деклараций в TypeScript:

| Декларация | Создаёт тип | Создаёт значение | Создаёт namespace |
|------------|:-----------:|:-----------------:|:-----------------:|
| `interface` | да | — | — |
| `type alias` | да | — | — |
| `class` | да | да | — |
| `enum` | да | да | — |
| `namespace` | — | да | да |
| `function` | — | да | — |
| `variable` | — | да | — |

Слияние возможно только между совместимыми декларациями.

## Слияние интерфейсов

Самый распространённый вид слияния. Два интерфейса с одинаковым именем автоматически объединяются:

```ts
interface User {
  id: number;
  name: string;
}

interface User {
  email: string;
  role: "admin" | "user";
}

// Результат — TypeScript объединяет оба интерфейса:
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: "admin" | "user";
// }

const user: User = {
  id: 1,
  name: "Алиса",
  email: "alice@example.com",
  role: "admin",
};
```

### Правила слияния интерфейсов

1. **Не-функциональные члены** должны быть уникальны. Если свойство с одинаковым именем встречается в обоих интерфейсах, их типы обязаны совпадать:

```ts
interface Box {
  size: number;
}

interface Box {
  size: number; // ✅ ОК — тот же тип
}

interface Box {
  size: string; // ❌ Ошибка — конфликт типов
}
```

2. **Функциональные члены** (методы) объединяются как перегрузки. Более поздние декларации имеют приоритет:

```ts
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}

interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: string): HTMLElement;
}

// Результат (порядок перегрузок — последний интерфейс первый):
// interface Document {
//   createElement(tagName: "canvas"): HTMLCanvasElement;  // из второго
//   createElement(tagName: string): HTMLElement;           // из второго
//   createElement(tagName: "div"): HTMLDivElement;         // из первого
//   createElement(tagName: "span"): HTMLSpanElement;       // из первого
// }
```

Исключение: перегрузки с параметром типа строкового литерала всегда поднимаются наверх.

## Слияние namespace с другими декларациями

### Namespace + Class

Позволяет добавлять статические свойства к классу:

```ts
class Album {
  label: Album.AlbumLabel;

  constructor(label: Album.AlbumLabel) {
    this.label = label;
  }
}

namespace Album {
  export interface AlbumLabel {
    name: string;
    color: string;
  }

  export function createDefault(): Album {
    return new Album({ name: "Default", color: "gray" });
  }
}

// Класс + типы + статический метод:
const album = Album.createDefault();
const label: Album.AlbumLabel = { name: "Rock", color: "red" };
```

### Namespace + Function

Добавляет свойства к функции:

```ts
function buildLabel(name: string): string {
  return `${buildLabel.prefix}${name}${buildLabel.suffix}`;
}

namespace buildLabel {
  export let prefix = ">> ";
  export let suffix = " <<";
}

buildLabel("Заголовок"); // ">> Заголовок <<"
buildLabel.prefix = "** ";
buildLabel("Заголовок"); // "** Заголовок <<"
```

### Namespace + Enum

Добавляет статические члены к enum:

```ts
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

namespace Color {
  export function fromHex(hex: string): Color {
    switch (hex.toLowerCase()) {
      case "#ff0000": return Color.Red;
      case "#00ff00": return Color.Green;
      case "#0000ff": return Color.Blue;
      default: throw new Error(`Неизвестный цвет: ${hex}`);
    }
  }
}

const color = Color.fromHex("#ff0000"); // Color.Red
```

## Module Augmentation

Самый практичный вид слияния деклараций. Позволяет расширять типы из сторонних библиотек:

```ts
// Допустим, библиотека "observable" экспортирует:
// export class Observable<T> { ... }

// Мы хотим добавить метод map:
import { Observable } from "observable";

declare module "observable" {
  interface Observable<T> {
    map<U>(fn: (value: T) => U): Observable<U>;
  }
}

// Реализация (в другом файле):
Observable.prototype.map = function <T, U>(
  this: Observable<T>,
  fn: (value: T) => U
): Observable<U> {
  // ... реализация
};
```

### Расширение Vue Router

Реальный пример — добавление типизированных meta-полей в Vue Router:

```ts
// types/router.d.ts
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    layout?: "default" | "admin" | "blank";
  }
}
```

Теперь `route.meta.requiresAuth` типизирован.

### Расширение Express Request

```ts
// types/express.d.ts
declare module "express" {
  interface Request {
    userId?: string;
    sessionId?: string;
  }
}
```

### Правила module augmentation

1. Нельзя создавать новые экспорты верхнего уровня — только расширять существующие.
2. Нельзя расширять default-экспорт напрямую (расширяй именованный тип, который стоит за default).
3. Файл с `declare module` должен быть модулем (содержать хотя бы один `import` или `export`).

## Global Augmentation

Позволяет добавлять типы в глобальную область из файла-модуля:

```ts
// global-extensions.ts
export {}; // делает файл модулем

declare global {
  interface Array<T> {
    /** Возвращает первый элемент или undefined */
    first(): T | undefined;
    /** Возвращает последний элемент или undefined */
    last(): T | undefined;
  }
}

// Реализация
Array.prototype.first = function <T>(this: T[]): T | undefined {
  return this[0];
};

Array.prototype.last = function <T>(this: T[]): T | undefined {
  return this[this.length - 1];
};
```

```ts
// Теперь доступно глобально:
const numbers = [1, 2, 3];
numbers.first(); // 1
numbers.last();  // 3
```

### Расширение Window

```ts
// types/global.d.ts
export {};

declare global {
  interface Window {
    __APP_VERSION__: string;
    __FEATURE_FLAGS__: Record<string, boolean>;
  }
}
```

```ts
// Использование — без ошибок типов:
window.__APP_VERSION__ = "2.0.0";

if (window.__FEATURE_FLAGS__?.darkMode) {
  enableDarkMode();
}
```

### Расширение ProcessEnv

```ts
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    API_KEY: string;
    PORT?: string;
  }
}
```

> **Совет:** `declare namespace` в `.d.ts`-файле без `import`/`export` автоматически глобален. Не нужен `declare global`.

## Что нельзя сливать

- `type alias` + `type alias` с одинаковым именем — ошибка
- `interface` + `type alias` с одинаковым именем — ошибка
- Два `class` с одинаковым именем — ошибка

```ts
type Point = { x: number; y: number };
type Point = { z: number }; // ❌ Duplicate identifier 'Point'

interface Shape { color: string; }
type Shape = { area: number }; // ❌ Duplicate identifier 'Shape'
```

Для расширения типов используй `interface` (поддерживает слияние) или `intersection types`:

```ts
type BasePoint = { x: number; y: number };
type Point3D = BasePoint & { z: number }; // ✅ Пересечение типов
```
