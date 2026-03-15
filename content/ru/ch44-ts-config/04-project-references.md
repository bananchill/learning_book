---
title: "Project References и монорепо"
parent: "ch44-ts-config"
order: 4
---

## Проблема больших проектов

В большом проекте или монорепозитории TypeScript должен проверить **всё** при каждом запуске `tsc`. Если проект содержит сотни тысяч строк, это занимает десятки секунд.

Project References решают эту проблему: они позволяют разбить проект на **независимые части**, которые компилируются и кешируются отдельно.

## Что такое Project References

Project References — это способ указать TypeScript, что проект зависит от других TypeScript-проектов. Каждый «подпроект» компилируется отдельно, результат кешируется, и при изменении перекомпилируется только то, что изменилось.

```
monorepo/
├── packages/
│   ├── shared/        ← отдельный TS-проект
│   │   ├── src/
│   │   └── tsconfig.json
│   ├── core/          ← зависит от shared
│   │   ├── src/
│   │   └── tsconfig.json
│   └── app/           ← зависит от core и shared
│       ├── src/
│       └── tsconfig.json
└── tsconfig.json      ← корневой конфиг
```

## Настройка: composite

Каждый подпроект, на который ссылаются, должен включить `composite: true`:

```jsonc
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

`composite: true` обязывает:
- `declaration: true` — генерация `.d.ts` (чтобы зависимые проекты видели типы)
- `include` или `files` — явное указание файлов (TypeScript должен знать границы проекта)
- TypeScript создаёт `.tsbuildinfo` — файл кеша для инкрементальной сборки

### declarationMap

```jsonc
{
  "compilerOptions": {
    "declarationMap": true
  }
}
```

Генерирует `.d.ts.map` — карту соответствия между `.d.ts` и исходным `.ts`. Позволяет IDE переходить к исходникам зависимости (Go to Definition), а не к `.d.ts`-файлу.

## Настройка: references

Проект-потребитель указывает зависимости через `references`:

```jsonc
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
```

```jsonc
// packages/app/tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" },
    { "path": "../core" }
  ]
}
```

`"path"` указывает на **директорию с tsconfig.json** или на **сам файл tsconfig.json**.

## Сборка: tsc --build (tsc -b)

Обычный `tsc` не понимает Project References. Для сборки нужен режим `--build`:

```bash
# Собрать текущий проект и все его зависимости
tsc --build

# Сокращённая форма
tsc -b

# Собрать конкретный проект
tsc -b packages/app/tsconfig.json

# Полная пересборка (без кеша)
tsc -b --force

# Очистить выходные файлы
tsc -b --clean

# Подробный вывод (что перекомпилируется)
tsc -b --verbose
```

`tsc -b` делает следующее:
1. Находит все проекты по цепочке `references`
2. Определяет порядок сборки (топологическая сортировка)
3. Проверяет, что изменилось с последней сборки
4. Перекомпилирует только изменённые проекты

### Инкрементальная сборка

При первой сборке `tsc -b` создаёт `.tsbuildinfo` — файл, где хранит хеши файлов. При следующей сборке TypeScript сравнивает хеши и перекомпилирует только изменённые файлы:

```
packages/shared/
  dist/
    index.js
    index.d.ts
    tsconfig.tsbuildinfo  ← кеш сборки
```

На больших проектах это сокращает время сборки с минут до секунд.

## Корневой tsconfig.json

В корне монорепо создают конфиг, который ссылается на все проекты:

```jsonc
// tsconfig.json (корень монорепо)
{
  "files": [],
  "references": [
    { "path": "packages/shared" },
    { "path": "packages/core" },
    { "path": "packages/app" }
  ]
}
```

`"files": []` — корневой конфиг сам ничего не компилирует, только указывает на подпроекты.

```bash
# Собрать всё из корня
tsc -b
```

## Базовый конфиг с extends

В монорепо удобно вынести общие настройки в базовый конфиг:

```jsonc
// tsconfig.base.json (корень)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

```jsonc
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```jsonc
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
```

## Интеграция с бандлерами

### Vite

Vite **не использует** `tsc` для компиляции — он использует esbuild. Но TypeScript всё равно нужен для проверки типов.

Типичная настройка для Vite в монорепо:

```jsonc
// packages/app/tsconfig.json — для проверки типов
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" },
    { "path": "../core" }
  ]
}
```

```ts
// packages/app/vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ссылки на исходники (не dist) — Vite скомпилирует сам
      "@book/shared": path.resolve(__dirname, "../shared/src"),
      "@book/core": path.resolve(__dirname, "../core/src"),
    },
  },
});
```

> В Vite-проекте `noEmit: true` — Vite сам занимается компиляцией. TypeScript используется только для `tsc --noEmit` (проверка типов).

### esbuild

esbuild не понимает Project References. Для монорепо с esbuild используют `paths` и плагины:

```ts
// build.ts
import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  // esbuild сам разрешает импорты через node_modules
  // или через paths в tsconfig
  tsconfig: "tsconfig.json",
});
```

## Типичные ошибки

### Циклические ссылки

```jsonc
// packages/a/tsconfig.json
{ "references": [{ "path": "../b" }] }

// packages/b/tsconfig.json
{ "references": [{ "path": "../a" }] }
// Ошибка: Project references may not form a circular graph
```

Решение: вынести общий код в отдельный пакет.

### Забыли composite

```
error TS6306: Referenced project must have setting "composite": true
```

Каждый проект, на который ссылаются через `references`, должен иметь `composite: true`.

### Забыли declaration

```
error TS6305: Output file has not been built from source file
```

С `composite: true` обязательно `declaration: true` — иначе зависимые проекты не увидят типы.

## Полный пример: монорепо с тремя пакетами

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

```jsonc
// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

```jsonc
// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" }
  ]
}
```

```jsonc
// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../shared" },
    { "path": "../core" }
  ]
}
```

```jsonc
// tsconfig.json (корень)
{
  "files": [],
  "references": [
    { "path": "packages/shared" },
    { "path": "packages/core" },
    { "path": "packages/app" }
  ]
}
```

```bash
# Проверить типы во всём монорепо
tsc -b

# Проверить только app и его зависимости
tsc -b packages/app
```

## Итоги

| Концепция | Назначение |
|----------|-----------|
| `composite: true` | Помечает проект как «подпроект» для references |
| `references` | Указывает зависимости между проектами |
| `tsc -b` | Режим сборки с учётом references |
| `.tsbuildinfo` | Кеш для инкрементальной сборки |
| `declarationMap` | Go to Definition в исходники (не .d.ts) |
| `extends` + базовый конфиг | Общие настройки для всех пакетов |
