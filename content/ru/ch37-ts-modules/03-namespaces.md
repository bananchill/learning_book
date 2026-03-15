---
title: "Namespaces"
description: "Пространства имён в TypeScript: ключевое слово namespace, многофайловые пространства, когда использовать"
---

## Что такое namespace

Namespace (пространство имён) — это способ группировки связанного кода под одним именем. Это устаревший механизм TypeScript, который появился до широкого распространения ES-модулей.

```ts
namespace Validation {
  // Экспортируем из пространства имён, чтобы было доступно снаружи
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  // Не экспортировано — приватное для пространства имён
  const letterRegexp = /^[A-Za-z]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isValid(s: string): boolean {
      return letterRegexp.test(s);
    }
  }

  export class ZipCodeValidator implements StringValidator {
    isValid(s: string): boolean {
      return s.length === 5 && /^\d+$/.test(s);
    }
  }
}

// Использование — через имя пространства
const validator = new Validation.LettersOnlyValidator();
validator.isValid("Hello"); // true
```

### Как это компилируется

TypeScript превращает namespace в IIFE (immediately invoked function expression):

```js
var Validation;
(function (Validation) {
  const letterRegexp = /^[A-Za-z]+$/;

  class LettersOnlyValidator {
    isValid(s) {
      return letterRegexp.test(s);
    }
  }
  Validation.LettersOnlyValidator = LettersOnlyValidator;

  class ZipCodeValidator {
    isValid(s) {
      return s.length === 5 && /^\d+$/.test(s);
    }
  }
  Validation.ZipCodeValidator = ZipCodeValidator;
})(Validation || (Validation = {}));
```

Неэкспортированные члены (`letterRegexp`) остаются в замыкании IIFE и недоступны снаружи.

## Вложенные пространства имён

Namespace можно вкладывать друг в друга:

```ts
namespace App {
  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
  }

  export namespace Services {
    export function getUser(id: number): Models.User {
      return { id, name: "Алиса" };
    }
  }
}

const user: App.Models.User = App.Services.getUser(1);
```

Для сокращения длинных путей используется псевдоним:

```ts
import UserModel = App.Models.User; // это не ESM-импорт, а псевдоним namespace

const user: UserModel = { id: 1, name: "Боб" };
```

## Многофайловые пространства имён

Namespace может быть разбит на несколько файлов. TypeScript объединит их в один:

```ts
// validation/string-validator.ts
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
}

// validation/letters-validator.ts
/// <reference path="string-validator.ts" />
namespace Validation {
  export class LettersOnlyValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^[A-Za-z]+$/.test(s);
    }
  }
}

// validation/zip-validator.ts
/// <reference path="string-validator.ts" />
namespace Validation {
  export class ZipCodeValidator implements StringValidator {
    isValid(s: string): boolean {
      return s.length === 5 && /^\d+$/.test(s);
    }
  }
}
```

Директива `/// <reference path="..." />` указывает зависимости между файлами. При компиляции используй `--outFile`:

```bash
tsc --outFile dist/validation.js validation/string-validator.ts validation/letters-validator.ts validation/zip-validator.ts
```

> **Важно:** `--outFile` работает только с `module: "amd"` или `module: "system"`. Для современных проектов это не актуально.

## Когда использовать namespace, а когда модули

### Используй ES-модули (import/export) когда:

- Пишешь новый код
- Работаешь с бандлером (Vite, webpack)
- Работаешь с Node.js
- Хочешь tree shaking
- Следуешь современным практикам

### Namespace уместен когда:

- Пишешь файлы деклараций (`.d.ts`) для глобальных библиотек
- Расширяешь глобальные типы через declaration merging
- Работаешь с legacy-кодом, который использует `<script>` без бандлера

```ts
// ✅ Правильно: namespace в .d.ts для глобальной библиотеки
// global.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    API_URL: string;
  }
}

// ❌ Неправильно: namespace в обычном коде вместо модулей
namespace Utils {
  export function format(s: string): string { return s.trim(); }
}
```

### Частая ошибка: namespace + модули

Не оборачивай содержимое модуля в namespace:

```ts
// ❌ Бессмысленно — модуль уже является областью видимости
// utils.ts
export namespace StringUtils {
  export function trim(s: string): string {
    return s.trim();
  }
}
// Приходится писать: StringUtils.trim("  hello  ")

// ✅ Правильно — просто экспортируй функции
// utils.ts
export function trim(s: string): string {
  return s.trim();
}
// Чисто: trim("  hello  ")
```

## Псевдоним module

Ключевое слово `module` — устаревший синоним `namespace`:

```ts
// Устаревший синтаксис (до TypeScript 1.5)
module Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
}

// Современный синтаксис — идентичен по смыслу
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
}
```

В новом коде всегда используй `namespace`, не `module`. Ключевое слово `module` в этом контексте устарело и сбивает с толку из-за пересечения с ES-модулями.
