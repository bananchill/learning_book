---
title: "Структура tsconfig.json"
parent: "ch44-ts-config"
order: 1
---

## Что такое tsconfig.json

Файл `tsconfig.json` в корне директории сообщает TypeScript: «это TypeScript-проект». Он определяет:

- **Какие файлы** входят в компиляцию
- **Какие правила** применяет компилятор
- **Куда** и **как** генерировать выходные файлы

Когда ты запускаешь `tsc` без аргументов, компилятор ищет `tsconfig.json` в текущей директории и поднимается вверх по дереву каталогов, пока не найдёт.

```bash
# tsc ищет tsconfig.json в текущей директории и выше
tsc

# Явное указание конфига
tsc --project ./tsconfig.build.json
tsc -p ./tsconfig.build.json
```

> Если передать файлы напрямую (`tsc index.ts`), `tsconfig.json` **игнорируется**.

## Создание tsconfig.json

Самый быстрый способ -- команда `tsc --init`:

```bash
npx tsc --init
```

Она создаёт `tsconfig.json` с закомментированными опциями и пояснениями:

```jsonc
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
    // ... остальные опции закомментированы
  }
}
```

Это разумный стартовый набор, но для реального проекта его нужно адаптировать.

## Верхнеуровневые поля

`tsconfig.json` содержит несколько секций верхнего уровня:

```jsonc
{
  // Наследование от другого конфига
  "extends": "./tsconfig.base.json",

  // Настройки компилятора
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true
  },

  // Явный список файлов для компиляции
  "files": [
    "src/index.ts",
    "src/globals.d.ts"
  ],

  // Паттерны для включения файлов
  "include": ["src/**/*"],

  // Паттерны для исключения файлов
  "exclude": ["node_modules", "dist", "**/*.test.ts"],

  // Ссылки на другие проекты (монорепо)
  "references": [
    { "path": "../shared" },
    { "path": "../core" }
  ]
}
```

## files, include и exclude

Эти три поля определяют, какие файлы попадают в компиляцию.

### files

Явный список файлов. Полезен, когда нужно включить конкретные файлы:

```jsonc
{
  "files": [
    "src/index.ts",
    "src/globals.d.ts"
  ]
}
```

Если хотя бы один файл из списка не найден -- ошибка. Для больших проектов `files` неудобен -- используй `include`.

### include

Паттерны glob для поиска файлов:

```jsonc
{
  "include": ["src/**/*"]
}
```

Поддерживаемые подстановки:
- `*` -- любое количество символов (кроме разделителя директорий)
- `?` -- один символ
- `**/` -- любая вложенность директорий

Если расширение не указано, включаются `.ts`, `.tsx`, `.d.ts` (и `.js`, `.jsx`, если `allowJs: true`).

### exclude

Исключает файлы из `include` (но **не** из `files`):

```jsonc
{
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

**По умолчанию** `exclude` содержит `node_modules`, `bower_components`, `jspm_packages` и `outDir` (если указан).

### Приоритет

```
files > include + exclude
```

Если файл указан в `files`, он **всегда** включается, даже если попадает под `exclude`. А если файл A из `include` импортирует файл B, то B тоже включается, даже если попадает под `exclude`.

## Наследование через extends

`extends` позволяет наследовать конфигурацию из другого файла:

```jsonc
// tsconfig.base.json — общие настройки
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  }
}
```

```jsonc
// tsconfig.json — наследует и дополняет
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

Правила наследования:
- `compilerOptions` **мержатся** (дочерний переопределяет родительский)
- `files`, `include`, `exclude` **заменяются** целиком (не мержатся)
- Пути разрешаются **относительно файла**, в котором они указаны

### Множественное наследование

Начиная с TypeScript 5.0, `extends` принимает массив:

```jsonc
{
  "extends": [
    "@tsconfig/node20/tsconfig.json",
    "./tsconfig.paths.json"
  ],
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

Конфиги применяются в порядке массива: последний побеждает при конфликтах.

### Готовые базовые конфиги

Пакет `@tsconfig/bases` предоставляет рекомендованные конфиги для популярных окружений:

```bash
npm install -D @tsconfig/node20
```

```jsonc
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "include": ["src/**/*"]
}
```

Доступные базы: `@tsconfig/node20`, `@tsconfig/node22`, `@tsconfig/vite-react`, `@tsconfig/strictest` и другие.

## Несколько конфигов в одном проекте

Часто в проекте нужно несколько конфигов:

```
project/
├── tsconfig.json          # Для IDE (все файлы)
├── tsconfig.build.json    # Для сборки (без тестов)
└── tsconfig.test.json     # Для тестов
```

```jsonc
// tsconfig.build.json — исключает тесты
{
  "extends": "./tsconfig.json",
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "tests/"]
}
```

```bash
# Сборка без тестов
tsc -p tsconfig.build.json
```

## Типичные ошибки

**Файл не попадает в компиляцию:**

```
error TS6059: File 'src/utils.ts' is not under 'rootDir'
```

Проверь `include`, `exclude` и `rootDir`. Часто проблема в том, что файл лежит вне `rootDir`.

**Конфликт exclude и импортов:**

Если `a.ts` импортирует `b.ts`, а `b.ts` в `exclude` -- TypeScript всё равно включит `b.ts`. Exclude работает только для **точки входа**, но не для зависимостей.

## Итоги

| Поле | Назначение | Мержится при extends? |
|------|-----------|----------------------|
| `compilerOptions` | Настройки компилятора | Да (дочерний побеждает) |
| `files` | Явный список файлов | Нет (заменяется) |
| `include` | Glob-паттерны включения | Нет (заменяется) |
| `exclude` | Glob-паттерны исключения | Нет (заменяется) |
| `extends` | Наследование конфига | -- |
| `references` | Project References | Нет (заменяется) |
