---
title: "Module Resolution"
description: "Стратегии разрешения модулей: node, node16, bundler, classic. Настройка paths, baseUrl, rootDirs"
---

## Что такое Module Resolution

Когда ты пишешь `import { something } from "./utils"`, TypeScript должен понять, какой файл скрывается за `"./utils"`. Процесс поиска этого файла называется **module resolution** (разрешение модулей).

TypeScript поддерживает несколько стратегий, и выбор зависит от среды выполнения:

| Стратегия | Для кого | Опция в tsconfig |
|-----------|----------|------------------|
| `node16` / `nodenext` | Node.js (ESM + CJS) | `"moduleResolution": "node16"` |
| `bundler` | Vite, webpack, esbuild | `"moduleResolution": "bundler"` |
| `node10` | Устаревшая Node.js CJS | `"moduleResolution": "node10"` |
| `classic` | Устаревшая, для старых проектов | `"moduleResolution": "classic"` |

## Стратегия node16 / nodenext

Наиболее точно отражает поведение Node.js. TypeScript различает ESM и CJS контексты:

- `.mts` / `.mjs` — всегда ESM
- `.cts` / `.cjs` — всегда CJS
- `.ts` / `.js` — зависит от ближайшего `package.json` → поле `"type"`

### Алгоритм разрешения (относительные пути)

```ts
import { helper } from "./utils.js";
```

TypeScript ищет в таком порядке:
1. `./utils.ts`
2. `./utils.tsx`
3. `./utils.d.ts`
4. `./utils.js` (как fallback)

> Обрати внимание: пишем `.js` в импорте, но TypeScript находит `.ts`-файл. Это потому что после компиляции `.ts` превратится в `.js`.

### Алгоритм разрешения (пакеты)

```ts
import { z } from "zod";
```

TypeScript ищет:
1. `node_modules/zod/package.json` → поле `"exports"` (приоритет)
2. `node_modules/zod/package.json` → поле `"types"` или `"typings"`
3. `node_modules/zod/index.d.ts`
4. `node_modules/@types/zod/index.d.ts`

Поле `"exports"` в `package.json` — современный стандарт:

```json
{
  "name": "my-lib",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "import": "./dist/utils.mjs"
    }
  }
}
```

## Стратегия bundler

Для проектов с Vite, webpack, esbuild. Более мягкие правила:

- Расширение в импортах **необязательно**: `import { x } from "./utils"` — ОК
- Поддерживает `"exports"` из `package.json`
- Не требует различать ESM/CJS контексты

```json
// tsconfig.json для проекта на Vite
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "esnext"
  }
}
```

Это наиболее распространённый выбор для фронтенд-проектов.

## Устаревшие стратегии

### node10 (бывший node)

Старый алгоритм Node.js — не поддерживает `"exports"` в `package.json`, не различает ESM/CJS. Используй только если работаешь с очень старым проектом.

### classic

Совсем устаревшая стратегия. Для относительных импортов ищет файл рядом. Для абсолютных — поднимается вверх по директориям. Не ищет в `node_modules`. На практике не используется.

## paths и baseUrl

### baseUrl

Задаёт базовую директорию для не-относительных импортов:

```json
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

```ts
// Без baseUrl: import { helper } from "../../shared/utils";
// С baseUrl:   import { helper } from "shared/utils";
```

> **Важно:** `baseUrl` влияет только на TypeScript. Бандлер (Vite, webpack) нужно настроить отдельно для тех же путей.

### paths

Алиасы для импортов — более гибкий инструмент, чем `baseUrl`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./packages/shared/src/*"],
      "@ui/*": ["./packages/ui/src/*"]
    }
  }
}
```

```ts
// Вместо:
import { Button } from "../../../packages/ui/src/components/Button";
// Пишем:
import { Button } from "@ui/components/Button";
```

`paths` всегда работает относительно `baseUrl`. Если `baseUrl` не указан, `paths` работает относительно расположения `tsconfig.json`.

### Как paths работает с бандлером

TypeScript `paths` — это только маппинг для проверки типов. Чтобы импорты работали в рантайме, настрой алиасы в бандлере:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./packages/shared/src"),
    },
  },
});
```

## rootDirs

Позволяет объединить несколько физических директорий в одну виртуальную:

```json
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/views"]
  }
}
```

```ts
// Файл в src/views/app.ts может импортировать из generated/views
// как будто они в одной директории:
import { ViewTemplate } from "./template"; // реально лежит в generated/views/template.ts
```

Полезно для проектов с генерацией кода.

## typeRoots и types

Управляют видимостью файлов деклараций (`.d.ts`):

```json
{
  "compilerOptions": {
    // Где искать @types
    "typeRoots": ["./node_modules/@types", "./custom-types"],
    // Какие пакеты @types включать (пустой массив — ни одного)
    "types": ["node", "vitest/globals"]
  }
}
```

- `typeRoots` — директории, где TypeScript ищет пакеты деклараций
- `types` — если указан, включает **только** перечисленные пакеты из `typeRoots`

## Отладка разрешения модулей

Если TypeScript не находит модуль, используй флаг `--traceResolution`:

```bash
npx tsc --traceResolution 2>&1 | head -50
```

Или в tsconfig:

```json
{
  "compilerOptions": {
    "traceResolution": true
  }
}
```

TypeScript подробно выведет, какие пути он проверял и почему.
