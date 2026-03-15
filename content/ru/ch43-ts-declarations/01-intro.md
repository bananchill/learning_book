---
title: "Что такое .d.ts и зачем они нужны"
parent: "ch43-ts-declarations"
order: 1
---

# Что такое .d.ts и зачем они нужны

## Проблема: JavaScript без типов

Представьте: вы подключаете популярную JS-библиотеку в TypeScript-проект. Компилятор не знает ничего о её API -- какие функции она экспортирует, какие параметры принимает, что возвращает. Всё становится `any`:

```ts
// Без деклараций -- TypeScript ничего не знает о lodash
import _ from "lodash"; // Ошибка: Could not find a declaration file for module 'lodash'

const result = _.groupBy(users, "age"); // result: any
```

Файлы `.d.ts` решают эту проблему -- они описывают типы без реализации.

## Что такое declaration file

Declaration file (файл деклараций) -- файл с расширением `.d.ts`, содержащий только **объявления типов**. В нём нет исполняемого кода -- только описание формы (shape) библиотеки:

```ts
// lodash.d.ts (упрощённо)
declare function groupBy<T>(
  collection: T[],
  iteratee: keyof T | ((value: T) => string)
): Record<string, T[]>;

export default { groupBy };
```

Ключевое слово `declare` говорит TypeScript: «эта функция существует где-то в рантайме, но я описываю только её тип».

## Ambient-декларации

Декларации, описывающие внешний код (не определённый в текущем файле), называются **ambient**-декларациями. Они используют ключевое слово `declare`:

```ts
// Объявление глобальной переменной
declare const API_URL: string;

// Объявление глобальной функции
declare function fetch(url: string): Promise<Response>;

// Объявление глобального интерфейса
declare interface Window {
  analytics: AnalyticsSDK;
}
```

Ambient-декларации не генерируют JavaScript-код -- они существуют только для проверки типов.

## Структуры библиотек

TypeScript различает три основных типа библиотек. Структура `.d.ts`-файла зависит от того, как библиотека используется.

### Глобальные библиотеки

Добавляют имена в глобальную область видимости. Классический пример -- jQuery, подключаемая через `<script>`:

```ts
// jquery.d.ts -- глобальная библиотека
declare var $: JQueryStatic;
declare var jQuery: JQueryStatic;

declare interface JQueryStatic {
  (selector: string): JQuery;
  ajax(settings: JQueryAjaxSettings): void;
}

declare interface JQuery {
  text(): string;
  text(value: string): this;
  css(property: string, value: string): this;
}
```

Признаки глобальной библиотеки:
- Подключается через `<script>` без модульной системы
- В документации используется `window.LibName` или просто `LibName`
- Нет `import`/`export` в примерах кода

### Модульные библиотеки

Работают через `import`/`require`. Большинство современных npm-пакетов -- модульные:

```ts
// axios.d.ts -- модульная библиотека (упрощённо)
export interface AxiosResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface AxiosRequestConfig {
  url?: string;
  method?: "get" | "post" | "put" | "delete";
  headers?: Record<string, string>;
  data?: unknown;
}

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
export function post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>>;

declare const axios: {
  get: typeof get;
  post: typeof post;
};

export default axios;
```

Признаки модульной библиотеки:
- Используется через `import`/`require`
- В `package.json` есть поле `"main"` или `"module"`
- Содержит `export` в исходном коде

### UMD-библиотеки

Работают и как глобальные, и как модульные. Пример -- Moment.js, Lodash:

```ts
// moment.d.ts -- UMD-библиотека
export as namespace moment; // Доступна и как глобальная переменная

export interface Moment {
  format(formatString?: string): string;
  add(amount: number, unit: string): Moment;
  subtract(amount: number, unit: string): Moment;
}

export default function moment(input?: string | Date): Moment;
```

Конструкция `export as namespace` -- маркер UMD: при импорте через `import` работает как модуль, без импорта -- как глобальная переменная `moment`.

## Как TypeScript находит типы

TypeScript ищет декларации типов в определённом порядке:

1. **Встроенные типы** -- `lib.d.ts` (DOM, ES2015+), указанные в `"lib"` конфига
2. **Типы в пакете** -- поле `"types"` или `"typings"` в `package.json` библиотеки
3. **@types-пакеты** -- `node_modules/@types/` (из DefinitelyTyped)
4. **Локальные .d.ts** -- файлы `.d.ts` в директориях проекта, включённых в `tsconfig.json`
5. **typeRoots** -- кастомные директории, указанные в `"typeRoots"`

```json
// tsconfig.json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./typings"],
    "types": ["node", "jest"] // Включить только конкретные @types
  }
}
```

> **Важно:** если указан `"types"`, TypeScript загрузит **только** перечисленные пакеты из `@types`. Без этой опции загружаются все `@types/*`.

## Автогенерация .d.ts

TypeScript может автоматически генерировать `.d.ts`-файлы из вашего кода:

```json
// tsconfig.json
{
  "compilerOptions": {
    "declaration": true,       // Генерировать .d.ts
    "declarationDir": "types", // Директория для .d.ts
    "emitDeclarationOnly": true // Только .d.ts, без .js
  }
}
```

Исходный код:

```ts
// src/math.ts
export function add(a: number, b: number): number {
  return a + b;
}
```

Сгенерированный файл:

```ts
// types/math.d.ts
export declare function add(a: number, b: number): number;
```

Это основной способ предоставить типы потребителям вашей библиотеки.

## Итоги

- `.d.ts` -- файлы, содержащие только объявления типов, без реализации
- `declare` -- ключевое слово для описания внешнего кода (ambient-деклараций)
- Библиотеки бывают глобальные, модульные и UMD -- структура `.d.ts` зависит от типа
- TypeScript ищет типы в определённом порядке: встроенные → пакет → @types → локальные `.d.ts`
- Флаг `declaration: true` автоматически генерирует `.d.ts` из вашего TypeScript-кода
