---
title: "Модули в TypeScript"
description: "ES Module Syntax, export/import, CommonJS interop, default exports, re-exports, import type"
---

## Что такое модуль в TypeScript

В TypeScript любой файл, содержащий `import` или `export` верхнего уровня, считается **модулем**. Файл без импортов и экспортов — **скрипт**, и его содержимое доступно в глобальной области видимости.

```ts
// math.ts — это модуль (есть export)
export function add(a: number, b: number): number {
  return a + b;
}

// globals.ts — это скрипт (нет import/export)
// Всё объявленное здесь попадает в глобальный скоуп
const VERSION = "1.0.0";
```

Если нужно превратить скрипт в модуль без реальных экспортов, добавь пустой экспорт:

```ts
// Теперь это модуль — переменные не утекают в глобальный скоуп
const internal = "приватное";
export {};
```

## Именованные экспорты и импорты

Основной способ организации модулей — именованные экспорты:

```ts
// utils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString("ru-RU");
}

export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} ₽`;
}

export const DEFAULT_LOCALE = "ru-RU";
```

```ts
// app.ts
import { formatDate, formatCurrency, DEFAULT_LOCALE } from "./utils";

console.log(formatDate(new Date())); // "15.03.2026"
console.log(formatCurrency(1999.9)); // "1999.90 ₽"
```

### Псевдонимы при импорте

```ts
import { formatDate as fd, formatCurrency as fc } from "./utils";

fd(new Date());
fc(100);
```

### Импорт всего модуля как объекта

```ts
import * as utils from "./utils";

utils.formatDate(new Date());
utils.DEFAULT_LOCALE; // "ru-RU"
```

## Default export

Каждый модуль может иметь один default-экспорт:

```ts
// logger.ts
export default class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}
```

```ts
// app.ts — имя при импорте произвольное
import Logger from "./logger";
import MyLogger from "./logger"; // тоже работает

const logger = new Logger();
logger.log("Запуск приложения");
```

> **Совет:** именованные экспорты предпочтительнее — они поддерживают автоимпорт в IDE, работают с tree shaking и не дают путаницы с именами.

## Re-exports

Реэкспорты позволяют создавать агрегирующие модули — «бочки» (barrel files):

```ts
// models/user.ts
export interface User {
  id: number;
  name: string;
}

// models/post.ts
export interface Post {
  id: number;
  title: string;
  authorId: number;
}

// models/index.ts — агрегирующий модуль
export { User } from "./user";
export { Post } from "./post";
export { default as Logger } from "./logger"; // реэкспорт default как именованного
```

```ts
// app.ts — один импорт вместо трёх
import { User, Post, Logger } from "./models";
```

Реэкспорт всего модуля:

```ts
export * from "./user";     // все именованные экспорты
export * as Models from "./models"; // как namespace-объект (TS 3.8+)
```

## import type и export type

TypeScript позволяет явно указать, что импорт используется **только для типов**. Такие импорты полностью удаляются при компиляции:

```ts
// types.ts
export interface Config {
  apiUrl: string;
  timeout: number;
}

export type LogLevel = "debug" | "info" | "warn" | "error";
```

```ts
// service.ts
import type { Config, LogLevel } from "./types";
// Или инлайн-форма (TS 4.5+):
import { type Config, type LogLevel } from "./types";

// Config и LogLevel доступны только как типы — не как значения
function createService(config: Config): void {
  // ...
}
```

Зачем это нужно:

- **Гарантия стирания.** `import type` никогда не попадёт в скомпилированный JS — даже если бандлер не умеет tree-shake типы.
- **Самодокументирование.** Видно, что импортируется именно тип, а не значение.
- **Обязательно при `verbatimModuleSyntax: true`** — этот флаг требует явного `import type` для импортов, которые не используются как значения.

Аналогично работает `export type`:

```ts
// Экспортируем только тип, не значение
export type { Config } from "./types";
```

## CommonJS Interop

TypeScript предоставляет специальный синтаксис для взаимодействия с CommonJS-модулями.

### Импорт CommonJS-модуля

```ts
// CommonJS-модуль (legacy.cjs):
// module.exports = { parse, stringify };

// Способ 1: esModuleInterop включён (рекомендуется)
import legacy from "./legacy.cjs";
legacy.parse("...");

// Способ 2: именованные импорты (работает с Node.js 22+ и некоторыми бандлерами)
import { parse, stringify } from "./legacy.cjs";
```

### Флаг esModuleInterop

Без `esModuleInterop` импорт CommonJS default-экспортов требует громоздкого синтаксиса:

```ts
// Без esModuleInterop:
import * as fs from "fs";

// С esModuleInterop: true (рекомендуется)
import fs from "fs";
```

Флаг добавляет вспомогательные функции `__importDefault` и `__importStar`, обеспечивающие корректное взаимодействие ESM и CJS.

### export = и import = require()

Для совместимости с CommonJS TypeScript поддерживает устаревший синтаксис:

```ts
// math.ts — CJS-стиль экспорта
function add(a: number, b: number): number {
  return a + b;
}
export = add;

// app.ts — CJS-стиль импорта
import add = require("./math");
add(1, 2); // 3
```

> **Важно:** этот синтаксис нужен только при создании библиотек, которые должны работать с CommonJS-потребителями. Для нового кода используй стандартный ESM.

## Динамический импорт

TypeScript полностью поддерживает `import()` — он возвращает `Promise` с типами модуля:

```ts
async function loadChart(): Promise<void> {
  // TypeScript знает типы динамически загруженного модуля
  const { Chart } = await import("./chart");
  const chart = new Chart("canvas");
  chart.render();
}
```

Динамический импорт полезен для code splitting и ленивой загрузки.

## Расширения файлов в импортах

В зависимости от настройки `moduleResolution` правила различаются:

```ts
// moduleResolution: "node16" или "nodenext" — расширение обязательно
import { helper } from "./utils.js"; // ✅ даже если файл называется utils.ts

// moduleResolution: "bundler" — расширение необязательно
import { helper } from "./utils"; // ✅ бандлер сам найдёт файл
```

При `node16`/`nodenext` TypeScript требует указывать расширение `.js` — потому что именно `.js` будет существовать после компиляции. Это может выглядеть непривычно, но соответствует поведению Node.js ESM.
