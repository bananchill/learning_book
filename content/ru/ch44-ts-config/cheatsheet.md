---
title: "Шпаргалка: tsconfig.json"
parent: "ch44-ts-config"
type: "cheatsheet"
---

## Быстрый старт

```bash
# Создать tsconfig.json с дефолтами
npx tsc --init

# Проверить типы без генерации файлов
tsc --noEmit

# Сборка с Project References
tsc -b

# Указать конкретный конфиг
tsc -p tsconfig.build.json
```

## Верхнеуровневые поля

```jsonc
{
  "extends": "./tsconfig.base.json",   // Наследование
  "compilerOptions": { ... },           // Настройки компилятора
  "files": ["src/index.ts"],            // Явный список файлов
  "include": ["src/**/*"],              // Glob-паттерны включения
  "exclude": ["**/*.test.ts"],          // Glob-паттерны исключения
  "references": [{ "path": "../lib" }]  // Project References
}
```

## Строгость

| Опция | Описание |
|-------|---------|
| `strict: true` | Включает все строгие проверки |
| `noImplicitAny` | Ошибка при неявном `any` |
| `strictNullChecks` | `null`/`undefined` -- отдельные типы |
| `strictFunctionTypes` | Строгая проверка параметров функций |
| `strictPropertyInitialization` | Свойства класса должны быть инициализированы |
| `noImplicitThis` | Ошибка при неявном `this: any` |
| `useUnknownInCatchVariables` | `catch(e)` -- тип `unknown` |

## Целевая среда

| Опция | Рекомендация | Описание |
|-------|-------------|---------|
| `target` | `ES2022` | Версия JS на выходе |
| `lib` | `["ES2022", "DOM"]` | Доступные встроенные типы |

## Модули

| Опция | Рекомендация | Описание |
|-------|-------------|---------|
| `module` | `ESNext` | Формат модулей на выходе |
| `moduleResolution` | `bundler` | Алгоритм поиска модулей |
| `esModuleInterop` | `true` | Нормальные CJS-импорты |
| `isolatedModules` | `true` | Совместимость с esbuild/Vite |
| `resolveJsonModule` | `true` | Импорт `.json`-файлов |

## Выходные файлы

| Опция | Описание |
|-------|---------|
| `outDir` | Директория для выходных файлов |
| `rootDir` | Корень исходников (структура в outDir) |
| `declaration` | Генерация `.d.ts` |
| `declarationMap` | Карта `.d.ts` -> исходники |
| `sourceMap` | Генерация `.js.map` |
| `noEmit` | Не генерировать файлы (только проверка) |

## Пути и алиасы

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"]
    }
  }
}
```

> `paths` -- только для TypeScript. Для рантайма нужен бандлер (Vite `resolve.alias`) или `tsc-alias`.

## Project References

```jsonc
// Подпроект (на него ссылаются)
{
  "compilerOptions": {
    "composite": true,       // Обязательно
    "declaration": true,     // Обязательно с composite
    "declarationMap": true   // Рекомендуется
  }
}

// Проект-потребитель
{
  "references": [
    { "path": "../shared" }
  ]
}
```

```bash
tsc -b              # Собрать всё
tsc -b --force      # Полная пересборка
tsc -b --clean      # Удалить выходные файлы
tsc -b --verbose    # Подробный вывод
```

## Рекомендуемый конфиг: Vite (фронтенд)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src/**/*"]
}
```

## Рекомендуемый конфиг: Node.js (библиотека)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

## Наследование (extends)

- `compilerOptions` -- **мержатся** (дочерний побеждает)
- `files`, `include`, `exclude` -- **заменяются** целиком
- С TS 5.0+ `extends` принимает массив: `"extends": ["base1.json", "base2.json"]`

## Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|--------|
| TS6059: not under rootDir | Файл вне `rootDir` | Проверить `rootDir` и `include` |
| TS6306: must have composite | Ссылка на проект без `composite` | Добавить `composite: true` |
| Алиасы не работают в рантайме | `paths` не переписывает JS | Настроить бандлер или `tsc-alias` |
| Тесты попадают в сборку | Нет отдельного `tsconfig.build.json` | Создать конфиг с `exclude: ["**/*.test.ts"]` |
