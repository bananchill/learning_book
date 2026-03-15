---
title: "Написание declaration files"
parent: "ch43-ts-declarations"
order: 2
---

# Написание declaration files

## Declaration Reference

Прежде чем писать `.d.ts`, нужно определить, какие конструкции языка использовать. Вот основные паттерны:

### Объявление переменных и констант

```ts
// Глобальная переменная
declare var DEBUG: boolean;

// Глобальная константа (нельзя переприсвоить)
declare const VERSION: string;

// Глобальная переменная, которую можно только читать
declare let currentUser: string;
```

### Объявление функций

```ts
// Простая функция
declare function greet(name: string): void;

// Функция с перегрузками
declare function createElement(tag: "div"): HTMLDivElement;
declare function createElement(tag: "span"): HTMLSpanElement;
declare function createElement(tag: string): HTMLElement;

// Функция, принимающая callback
declare function onReady(callback: () => void): void;
```

### Объявление объектов с методами

```ts
// Объект-пространство имён с вложенными методами
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

### Объявление классов

```ts
declare class Greeter {
  constructor(greeting: string);
  greeting: string;
  showGreeting(): void;
}
```

### Объявление интерфейсов и типов

```ts
// Интерфейс (можно расширять)
declare interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

// Псевдоним типа
declare type GreetingStyle = "formal" | "casual" | "silent";
```

## Шаблоны .d.ts

### Шаблон: module-function

Для библиотек, экспортирующих одну функцию как `default`:

```ts
// string-utils.d.ts
// Использование: import capitalize from "string-utils";
//                capitalize("hello") → "Hello"

export default function capitalize(input: string): string;

// Дополнительные именованные экспорты
export function truncate(input: string, maxLength: number): string;
export function camelize(input: string): string;
```

### Шаблон: module-class

Для библиотек, экспортирующих класс:

```ts
// super-logger.d.ts
// Использование: import Logger from "super-logger";
//                const log = new Logger("app");

declare class Logger {
  constructor(prefix: string);
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error?: Error): void;
  setLevel(level: "debug" | "info" | "warn" | "error"): void;
}

export default Logger;

// Дополнительные экспорты
export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
}
```

### Шаблон: module-plugin

Для библиотек, расширяющих другие библиотеки:

```ts
// express-jwt.d.ts
// Плагин, добавляющий свойство user к Request в Express

import { Request } from "express";

// Расширяем существующий интерфейс
declare module "express" {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
  }
}

// Собственный экспорт плагина
export interface JwtOptions {
  secret: string;
  algorithms: string[];
}

export default function expressJwt(options: JwtOptions): RequestHandler;
```

### Шаблон: global-modifying-module

Для модулей, которые при импорте модифицируют глобальную область:

```ts
// observable-array.d.ts
// При импорте добавляет метод observe ко всем массивам

export {};

declare global {
  interface Array<T> {
    observe(callback: (changes: ArrayChange<T>[]) => void): void;
    unobserve(): void;
  }

  interface ArrayChange<T> {
    type: "add" | "remove" | "update";
    index: number;
    value: T;
    oldValue?: T;
  }
}
```

### Шаблон: global

Для чисто глобальных библиотек (без модульной системы):

```ts
// analytics.d.ts
// Использование: analytics.track("click", { button: "signup" });

declare namespace analytics {
  function init(apiKey: string): void;
  function track(event: string, properties?: Record<string, unknown>): void;
  function identify(userId: string, traits?: Record<string, unknown>): void;
  function page(name?: string): void;

  interface Config {
    apiKey: string;
    debug?: boolean;
    flushInterval?: number;
  }
}
```

## Do's and Don'ts

### Типы в callback-ах

```ts
// DO: используй конкретный тип возврата void для callback
declare function onEvent(callback: () => void): void;

// DON'T: не используй any для callback
// declare function onEvent(callback: () => any): void;
```

### Перегрузки

```ts
// DO: сортируй перегрузки от конкретных к общим
declare function parse(input: "json"): JsonResult;
declare function parse(input: "xml"): XmlResult;
declare function parse(input: string): Result;

// DON'T: не ставь общую перегрузку первой
// declare function parse(input: string): Result;
// declare function parse(input: "json"): JsonResult; // Никогда не вызовется!
```

TypeScript выбирает **первую** подходящую перегрузку. Если общая сигнатура стоит первой, конкретные никогда не сработают.

### Необязательные параметры

```ts
// DO: используй необязательные параметры
declare function render(template: string, data?: object): string;

// DON'T: не создавай перегрузки только ради опциональности
// declare function render(template: string): string;
// declare function render(template: string, data: object): string;
```

### Union vs перегрузки

```ts
// DO: используй union, когда тип параметра не влияет на тип возврата
declare function format(value: string | number): string;

// DO: используй перегрузки, когда тип параметра определяет тип возврата
declare function parse(input: string): StringResult;
declare function parse(input: Buffer): BufferResult;
```

### Не используй `any` без необходимости

```ts
// DON'T: any уничтожает типобезопасность
declare function process(data: any): any;

// DO: используй unknown или дженерик
declare function process(data: unknown): unknown;
declare function process<T>(data: T): ProcessedResult<T>;
```

### Не используй `Object`, `String`, `Number`, `Boolean`

```ts
// DON'T: объектные обёртки -- не то, что нужно
declare function lower(s: String): String;

// DO: используй примитивные типы
declare function lower(s: string): string;
```

## Организация файлов деклараций

### Один файл для всей библиотеки

Для небольших библиотек -- один файл `index.d.ts`:

```ts
// types/small-lib/index.d.ts
export function doSomething(input: string): number;
export function doSomethingElse(input: number): string;
export interface Options {
  verbose?: boolean;
}
```

### Несколько файлов с реэкспортом

Для крупных библиотек -- разделение по модулям:

```ts
// types/big-lib/index.d.ts
export * from "./core";
export * from "./utils";
export * from "./types";
```

```ts
// types/big-lib/core.d.ts
export declare class BigLib {
  constructor(options: import("./types").Options);
  run(): void;
}
```

```ts
// types/big-lib/types.d.ts
export interface Options {
  debug?: boolean;
  timeout?: number;
}
```

## Тестирование деклараций

Проверить корректность `.d.ts` можно с помощью тестовых файлов:

```ts
// tests/types-test.ts
import { doSomething, Options } from "my-lib";

// Проверяем, что типы работают
const result: number = doSomething("test");

// Проверяем, что невалидный код даёт ошибку
// @ts-expect-error -- аргумент должен быть строкой
doSomething(123);

// @ts-expect-error -- результат -- число, не строка
const wrong: string = doSomething("test");
```

Директива `@ts-expect-error` гарантирует, что следующая строка действительно содержит ошибку типов. Если ошибки нет -- TypeScript выдаст предупреждение.

## Итоги

- Выбирайте шаблон `.d.ts` в зависимости от типа библиотеки: module-function, module-class, module-plugin, global, global-modifying-module
- Сортируйте перегрузки от конкретных к общим -- TypeScript берёт первую подходящую
- Используйте `unknown` вместо `any`, конкретные типы вместо обёрток (`string`, не `String`)
- Предпочитайте optional-параметры вместо перегрузок для необязательных аргументов
- Тестируйте декларации с помощью `@ts-expect-error`
