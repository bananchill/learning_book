---
title: "Paths, baseUrl и алиасы"
parent: "ch44-ts-config"
order: 3
---

## Проблема длинных относительных путей

В больших проектах импорты превращаются в кашу из `../`:

```ts
// Глубоко вложенный компонент
import { formatDate } from "../../../shared/utils/date";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../../../features/auth/model/useAuth";
```

Проблемы:
- **Нечитаемо** — сколько `../` нужно, зависит от глубины файла
- **Хрупко** — при перемещении файла все импорты ломаются
- **Неинформативно** — непонятно, откуда берётся модуль

Решение — алиасы путей через `paths`.

## baseUrl

`baseUrl` устанавливает корневую директорию для **неотносительных** импортов:

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./src"
  }
}
```

Теперь импорты разрешаются относительно `src/`:

```ts
// Вместо:
import { formatDate } from "../../../shared/utils/date";

// Можно:
import { formatDate } from "shared/utils/date";
```

TypeScript ищет `src/shared/utils/date.ts`.

> С `moduleResolution: "bundler"` или `"nodenext"` свойство `baseUrl` для `paths` **не обязательно**. Пути в `paths` разрешаются относительно `tsconfig.json`.

## paths

`paths` создаёт маппинг алиасов к реальным путям:

```jsonc
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@ui/*": ["./src/shared/ui/*"]
    }
  }
}
```

Теперь импорты чистые и понятные:

```ts
import { formatDate } from "@shared/utils/date";
import { Button } from "@ui/Button";
import { useAuth } from "@features/auth/model/useAuth";
import { api } from "@/api/client";
```

### Синтаксис paths

Каждый ключ — паттерн, каждое значение — массив путей для подстановки:

```jsonc
{
  "paths": {
    // Точное совпадение — один модуль
    "config": ["./src/config/index.ts"],

    // Звёздочка — подстановка
    "@utils/*": ["./src/shared/utils/*"],

    // Несколько вариантов — TypeScript пробует по порядку
    "@components/*": [
      "./src/shared/ui/*",
      "./src/shared/ui/*/index.ts"
    ]
  }
}
```

Звёздочка `*` захватывает часть пути и подставляет её в значение:

```
Импорт: "@utils/date"
Паттерн: "@utils/*" → ["./src/shared/utils/*"]
Результат: "./src/shared/utils/date"
```

### Fallback-пути

Массив в значении — это список вариантов. TypeScript пробует каждый, пока не найдёт файл:

```jsonc
{
  "paths": {
    "*": [
      "./src/*",
      "./vendor/*"
    ]
  }
}
```

Сначала ищет в `./src/`, потом в `./vendor/`.

## paths работает только для TypeScript

**Критически важно:** `paths` — это инструкция для **проверки типов**. TypeScript разрешает алиасы при компиляции, но **не переписывает** пути в выходных `.js`-файлах.

```ts
// Исходник
import { Button } from "@ui/Button";

// Скомпилированный JS — путь НЕ заменён!
import { Button } from "@ui/Button"; // Ошибка в рантайме!
```

Для рантайма нужно настроить разрешение алиасов в бандлере:

### Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
    },
  },
});
```

### webpack

```js
// webpack.config.js
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
};
```

### Node.js (без бандлера)

Используй `tsc-alias` или `tsconfig-paths`:

```bash
npm install -D tsc-alias

# После компиляции — заменяет алиасы на реальные пути
tsc && tsc-alias
```

Или в рантайме:

```bash
npm install tsconfig-paths

# Регистрирует алиасы при запуске
node -r tsconfig-paths/register dist/index.js
```

## rootDirs: виртуальные директории

`rootDirs` объединяет несколько директорий в одну **виртуальную**. TypeScript считает, что файлы из всех указанных директорий лежат рядом:

```jsonc
{
  "compilerOptions": {
    "rootDirs": [
      "./src",
      "./generated"
    ]
  }
}
```

Структура на диске:

```
project/
├── src/
│   └── app.ts
└── generated/
    └── api-types.ts
```

Для TypeScript они как бы в одной папке:

```ts
// src/app.ts
// Импорт как будто api-types.ts лежит рядом
import { UserDTO } from "./api-types";
```

Это полезно, когда часть кода генерируется автоматически (GraphQL-типы, OpenAPI-типы) и лежит в отдельной директории.

## Типичный пример: FSD-проект с Vite

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./src/app/*"],
      "@pages/*": ["./src/pages/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@features/*": ["./src/features/*"],
      "@entities/*": ["./src/entities/*"],
      "@shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src/**/*"]
}
```

```ts
// vite.config.ts — дублируем алиасы
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
```

## Итоги

| Инструмент | Назначение | Перезаписывает пути в JS? |
|-----------|-----------|--------------------------|
| `baseUrl` | Корень для неотносительных импортов | Нет |
| `paths` | Маппинг алиасов | Нет (нужен бандлер/tsc-alias) |
| `rootDirs` | Объединение директорий в виртуальную | Нет |
| Vite `resolve.alias` | Рантайм-разрешение алиасов | Да (при сборке) |
| `tsc-alias` | Замена алиасов после tsc | Да (постобработка) |

**Правило:** алиасы настраиваются в **двух местах** — `tsconfig.json` (для проверки типов) и бандлере/инструменте сборки (для рантайма).
