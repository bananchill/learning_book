---
title: "DefinitelyTyped, @types и публикация"
parent: "ch43-ts-declarations"
order: 3
---

# DefinitelyTyped, @types и публикация

## Экосистема @types

Когда JS-библиотека не включает собственные типы, сообщество публикует их в **DefinitelyTyped** -- крупнейшем репозитории `.d.ts`-файлов. Типы из него доступны через npm как пакеты `@types/*`:

```sh
# Установка типов для express
npm install -D @types/express

# Установка типов для lodash
npm install -D @types/lodash

# Установка типов для Node.js API
npm install -D @types/node
```

TypeScript автоматически подхватывает `@types` из `node_modules/@types/` -- никакой дополнительной настройки не нужно.

## Как устроен DefinitelyTyped

DefinitelyTyped -- это GitHub-репозиторий ([github.com/DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)) с тысячами папок, по одной на каждый пакет:

```
DefinitelyTyped/
  types/
    lodash/
      index.d.ts      # Основной файл деклараций
      common.d.ts      # Вспомогательные типы
      package.json      # Метаданные (версия, зависимости)
      tsconfig.json     # Настройки для проверки
      lodash-tests.ts   # Тесты типов
    express/
      index.d.ts
      ...
```

### Структура пакета в DefinitelyTyped

Каждый пакет содержит:

1. **index.d.ts** -- основной файл деклараций
2. **tsconfig.json** -- конфиг для проверки типов
3. **Тесты** -- файлы `*-tests.ts`, проверяющие корректность деклараций
4. **package.json** -- минимальный, содержащий версию и зависимости

```json
// types/lodash/package.json
{
  "name": "@types/lodash",
  "version": "4.17.0",
  "description": "TypeScript definitions for lodash",
  "license": "MIT",
  "dependencies": {},
  "typesPublisherContentHash": "..."
}
```

### Версионирование @types

Версии `@types` следуют мажорной и минорной версии основного пакета:

| Пакет | Версия | @types | Версия |
|-------|--------|--------|--------|
| lodash | 4.17.21 | @types/lodash | 4.17.x |
| express | 4.18.2 | @types/express | 4.17.x |
| react | 18.2.0 | @types/react | 18.2.x |

Патч-версии `@types` не связаны с патч-версиями основного пакета -- они обновляются при исправлении ошибок в декларациях.

## Два способа предоставить типы

### 1. Бандлинг типов в пакете (рекомендуется)

Типы включены прямо в npm-пакет. Пользователи получают их автоматически:

```json
// package.json вашей библиотеки
{
  "name": "my-awesome-lib",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

Преимущества:
- Типы всегда синхронизированы с кодом
- Не нужна отдельная установка `@types`
- Контроль над качеством деклараций

```json
// tsconfig.json для генерации .d.ts
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "dist",
    "outDir": "dist",
    "strict": true
  },
  "include": ["src"]
}
```

### 2. Публикация в DefinitelyTyped

Для библиотек, которые вы не контролируете или которые не хотят включать типы:

```sh
# Клонируем DefinitelyTyped
git clone https://github.com/DefinitelyTyped/DefinitelyTyped.git

# Создаём директорию для пакета
mkdir types/my-lib
```

Минимальный набор файлов:

```ts
// types/my-lib/index.d.ts
export function doSomething(input: string): number;
export interface Options {
  verbose?: boolean;
  timeout?: number;
}
```

```json
// types/my-lib/tsconfig.json
{
  "compilerOptions": {
    "module": "commonjs",
    "lib": ["es6"],
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictFunctionTypes": true,
    "strictNullChecks": true,
    "types": [],
    "noEmit": true,
    "forceConsistentCasingInFileNames": true
  },
  "files": ["index.d.ts", "my-lib-tests.ts"]
}
```

```ts
// types/my-lib/my-lib-tests.ts
import { doSomething, Options } from "my-lib";

const result: number = doSomething("test");

const opts: Options = { verbose: true };

// @ts-expect-error
doSomething(123);
```

## Deep Dive: как .d.ts устроен внутри

### Что может содержать .d.ts

Файл `.d.ts` может содержать **только** декларации -- никакой исполняемой логики:

```ts
// Допустимо в .d.ts:
declare function greet(name: string): void;
declare class Logger { }
declare namespace MyLib { }
declare enum Color { Red, Green, Blue }
declare module "some-module" { }
interface User { name: string; }
type ID = string | number;
export { greet, Logger };

// Недопустимо в .d.ts:
// const x = 5;               // Реализация
// function add(a, b) { ... } // Тело функции
// class Foo { bar() { } }    // Тело метода
```

### Скрипты vs модули в контексте .d.ts

Файл `.d.ts` **без** `import`/`export` -- это **скрипт**. Все его декларации попадают в глобальную область:

```ts
// globals.d.ts (скрипт -- нет import/export)
declare const BUILD_TIME: string;        // Глобальная переменная
declare function log(msg: string): void; // Глобальная функция
```

Файл `.d.ts` **с** `import` или `export` -- это **модуль**. Декларации доступны только при импорте:

```ts
// utils.d.ts (модуль -- есть export)
export declare function formatDate(date: Date): string;
export declare function parseDate(input: string): Date;
```

Если нужно добавить глобальные типы из модульного `.d.ts`, используйте `declare global`:

```ts
// module-with-globals.d.ts
export {};

declare global {
  const APP_VERSION: string;
  function debugLog(msg: string): void;
}
```

### Поле "types" и "typesVersions"

Для поддержки нескольких версий TypeScript используйте `typesVersions`:

```json
{
  "name": "my-lib",
  "types": "types/index.d.ts",
  "typesVersions": {
    ">=4.5": {
      "*": ["types/v4.5/*"]
    },
    ">=3.8": {
      "*": ["types/v3.8/*"]
    }
  }
}
```

TypeScript выберет подходящий набор типов для текущей версии компилятора.

## Проверка качества деклараций

### dtslint

Инструмент для проверки `.d.ts`-файлов, используемый в DefinitelyTyped:

```sh
npx dtslint types/my-lib
```

Он проверяет:
- Корректность TypeScript-синтаксиса
- Соблюдение стиля (линтинг)
- Прохождение тестов типов

### tsd

Альтернативный инструмент для тестирования типов:

```ts
// test-types.ts
import { expectType, expectError } from "tsd";
import { doSomething } from "my-lib";

// Проверяем, что тип возврата -- number
expectType<number>(doSomething("hello"));

// Проверяем, что ошибка возникает при передаче числа
expectError(doSomething(42));
```

## Итоги

- `@types/*` -- пакеты с типами из DefinitelyTyped, устанавливаемые через npm
- Предпочтительный способ -- бандлить типы прямо в пакет (поле `"types"` в `package.json`)
- DefinitelyTyped -- для библиотек без собственных типов
- `.d.ts` без `import`/`export` -- скрипт (глобальная область), с `export` -- модуль
- `typesVersions` позволяет поддерживать разные версии TypeScript
- Тестируйте декларации с помощью `@ts-expect-error`, dtslint или tsd
