---
title: "Triple-Slash Directives и Module Augmentation"
parent: "ch43-ts-declarations"
order: 4
---

# Triple-Slash Directives и Module Augmentation

## Triple-Slash Directives

Triple-slash директивы -- специальные комментарии вида `/// <reference ... />`, которые указывают компилятору на зависимости между файлами. Они **должны** располагаться в самом начале файла -- перед любым кодом, но после других triple-slash директив.

```ts
/// <reference path="./globals.d.ts" />
/// <reference types="node" />
/// <reference lib="es2015.promise" />

// Код начинается здесь
```

> **Важно:** triple-slash директивы -- это инструкция препроцессору. Если директива расположена не в начале файла, она игнорируется.

### `/// <reference path="..." />`

Объявляет зависимость от другого файла. Компилятор включит указанный файл в процесс компиляции:

```ts
// globals.d.ts
declare const API_BASE: string;
declare const IS_PRODUCTION: boolean;
```

```ts
// app.d.ts
/// <reference path="./globals.d.ts" />

declare namespace App {
  function init(config: { apiBase: typeof API_BASE }): void;
}
```

Когда использовать `reference path`:
- Связь между `.d.ts`-файлами в одном проекте
- Когда один файл деклараций зависит от другого
- В проектах **без** модульной системы (скрипты)

> В современных проектах с `import`/`export` директива `reference path` используется редко -- модульная система заменяет её.

### `/// <reference types="..." />`

Объявляет зависимость от `@types`-пакета. Эквивалент добавления пакета в `"types"` в `tsconfig.json`:

```ts
// server.d.ts
/// <reference types="node" />

// Теперь доступны типы Node.js
declare function startServer(options: {
  port: number;
  hostname?: string;
  callback?: (address: import("net").AddressInfo) => void;
}): void;
```

Когда использовать `reference types`:
- В `.d.ts`-файлах, зависящих от `@types`-пакетов
- Когда автор `.d.ts` хочет явно указать зависимости

```ts
// Пример: декларация для библиотеки, использующей Node.js Buffer
/// <reference types="node" />

export function encode(data: Buffer): string;
export function decode(input: string): Buffer;
```

### `/// <reference lib="..." />`

Включает встроенную библиотеку TypeScript. Эквивалент добавления значения в `"lib"` в `tsconfig.json`:

```ts
/// <reference lib="es2015.promise" />
/// <reference lib="dom" />

// Теперь доступны Promise и DOM API
declare function fetchData(url: string): Promise<Response>;
```

Доступные значения соответствуют файлам `lib.*.d.ts`:

| Значение | Что включает |
|----------|-------------|
| `es5` | Базовые типы ES5 |
| `es2015` | Все типы ES2015 (Promise, Map, Set...) |
| `es2015.promise` | Только Promise |
| `es2020` | Все типы ES2020 |
| `dom` | DOM API (Document, HTMLElement...) |
| `dom.iterable` | Итерируемые DOM-коллекции |
| `webworker` | API Web Workers |

### `/// <reference no-default-lib="true" />`

Специальная директива, запрещающая включение стандартной библиотеки. Используется в самих файлах `lib.d.ts`:

```ts
/// <reference no-default-lib="true" />

// Этот файл сам определяет базовые типы
interface Boolean { }
interface Number { }
interface String { }
```

На практике вы вряд ли будете использовать эту директиву -- она нужна авторам компилятора.

## Module Augmentation

Module augmentation позволяет **расширить** типы существующего модуля, не изменяя его исходный код. Это один из самых полезных паттернов при работе с `.d.ts`.

### Расширение стороннего модуля

```ts
// Оригинальный модуль express не знает о нашем поле user
// Добавляем его через module augmentation:

// express-augmentation.d.ts
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
    requestId?: string;
  }
}
```

Теперь `req.user` доступен во всех файлах проекта:

```ts
import express from "express";

const app = express();

app.get("/profile", (req, res) => {
  // TypeScript знает о req.user благодаря augmentation
  if (req.user) {
    res.json({ email: req.user.email });
  }
});
```

### Правила module augmentation

1. **Нельзя добавлять новые top-level экспорты** -- только расширять существующие объявления:

```ts
declare module "express" {
  // DO: расширяем существующий интерфейс
  interface Request {
    customField: string;
  }

  // DON'T: нельзя добавить новый export
  // export function newFunction(): void;
}
```

2. **Augmentation должен быть в модуле** -- файл должен содержать хотя бы один `import` или `export`:

```ts
// Неправильно -- файл без import/export = скрипт
// declare module "express" { ... } // Это declare module, не augmentation!

// Правильно -- файл является модулем
import "express";
declare module "express" {
  interface Request {
    customField: string;
  }
}
```

3. **Можно расширять интерфейсы, но не переопределять типы**:

```ts
declare module "some-lib" {
  // DO: добавляем новые поля к интерфейсу
  interface Config {
    newOption: boolean;
  }

  // DON'T: нельзя переопределить type alias
  // type ID = number; // Ошибка, если ID уже определён
}
```

### Практический пример: расширение Vue Router

```ts
// vue-router-augmentation.d.ts
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    // Добавляем типизированные мета-поля для маршрутов
    requiresAuth?: boolean;
    title?: string;
    roles?: string[];
  }
}
```

```ts
// Теперь мета-поля типизированы:
const routes = [
  {
    path: "/admin",
    component: AdminPanel,
    meta: {
      requiresAuth: true,   // Типизировано!
      roles: ["admin"],      // Типизировано!
      title: "Админ-панель", // Типизировано!
    },
  },
];
```

## Global Augmentation

Для расширения глобальных типов из модульного файла используйте `declare global`:

```ts
// Файл с import/export -- это модуль
export {};

declare global {
  // Расширяем интерфейс Window
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string;
      version: string;
      features: string[];
    };
  }

  // Добавляем метод к Array
  interface Array<T> {
    unique(): T[];
  }

  // Добавляем глобальную переменную
  var __DEV__: boolean;
}
```

### Пример: расширение встроенных типов

```ts
// string-extensions.d.ts
export {};

declare global {
  interface String {
    toTitleCase(): string;
    truncate(maxLength: number): string;
  }

  interface Number {
    clamp(min: number, max: number): number;
  }
}
```

> **Внимание:** расширение встроенных прототипов (`String.prototype`, `Array.prototype`) -- антипаттерн в продакшн-коде. Декларация типа **не добавляет** реализацию -- вы должны реализовать метод отдельно.

## declare module для неизвестных модулей

Когда TypeScript не может найти типы для модуля, `declare module` позволяет объявить его вручную:

### Wildcard-декларации

```ts
// images.d.ts -- типы для импорта изображений
declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}
```

Теперь TypeScript не будет ругаться на импорт ассетов:

```ts
import logo from "./logo.png";     // string
import icon from "./icon.svg";     // string
import styles from "./app.css";    // Record<string, string>
```

### Быстрая заглушка для модуля

Если нужно быстро подавить ошибку для модуля без типов:

```ts
// vendor.d.ts
declare module "legacy-lib";           // Все экспорты -- any
declare module "another-untyped-lib";  // Все экспорты -- any
```

Это **временное** решение. По мере возможности заменяйте заглушки полноценными декларациями или установите `@types`.

### declare module с полными типами

```ts
// custom-markdown.d.ts
declare module "custom-markdown" {
  interface MarkdownOptions {
    html?: boolean;
    linkify?: boolean;
    typographer?: boolean;
  }

  class MarkdownIt {
    constructor(options?: MarkdownOptions);
    render(src: string): string;
    renderInline(src: string): string;
    use(plugin: MarkdownPlugin, ...params: unknown[]): this;
  }

  type MarkdownPlugin = (md: MarkdownIt, ...params: unknown[]) => void;

  export default MarkdownIt;
  export { MarkdownOptions, MarkdownPlugin };
}
```

## Комбинация техник

На практике часто комбинируются несколько подходов:

```ts
// env.d.ts -- типы для Vite-проекта
/// <reference types="vite/client" />

// Расширяем ImportMetaEnv (module augmentation)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_FEATURE_FLAGS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Типы для ассетов (wildcard declare module)
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

## Итоги

- Triple-slash директивы (`/// <reference>`) должны быть в начале файла
- `reference path` -- зависимость от файла, `reference types` -- от `@types`, `reference lib` -- от встроенной библиотеки
- Module augmentation расширяет типы модуля через `declare module "name" { }`
- Global augmentation расширяет глобальные типы через `declare global { }` из модульного файла
- `declare module "*.ext"` -- wildcard для импортов ассетов
- `declare module "name"` без тела -- быстрая заглушка (все экспорты `any`)
