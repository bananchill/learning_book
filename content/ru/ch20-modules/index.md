# Модульная система JavaScript

Модули — способ разбить код на независимые части с явными зависимостями. Современный JS имеет две системы: ESM (нативная) и CommonJS (Node.js). Их различия влияют на tree shaking, SSR, тестирование и сборку.

import { Callout } from '@book/ui'

<Callout type="concept">
ESM (ECMAScript Modules) — стандартная система: `import`/`export`. Статический анализ, живые привязки, работает в браузере нативно. CommonJS — `require()`/`module.exports`, динамический, только Node.js (до 2019+).
</Callout>

## Что изучим

- **[ESM: import и export](/frontend/javascript/ch20-modules/01-esm-basics)** — named export, default export, re-export, namespace import
- **[CommonJS vs ESM](/frontend/javascript/ch20-modules/02-cjs-vs-esm)** — ключевые различия, interop, когда что использовать
- **[Динамический import()](/frontend/javascript/ch20-modules/03-dynamic-import)** — code splitting, ленивая загрузка, условный импорт
- **[Tree shaking и циклические зависимости](/frontend/javascript/ch20-modules/04-tree-shaking)** — как бандлеры удаляют неиспользуемый код
