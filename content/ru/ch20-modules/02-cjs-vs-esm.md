# CommonJS vs ESM

CommonJS (CJS) — система модулей Node.js, появившаяся задолго до стандарта ESM. Их различия важны при написании библиотек и настройке сборки.

import { Callout } from '@book/ui'

## Синтаксис

```js
// CommonJS
const fs = require('fs')                    // импорт
const { readFile } = require('fs')          // деструктуризация

module.exports = { myFunc, MyClass }        // экспорт объекта
module.exports = myFunc                     // экспорт функции
exports.helper = () => { ... }             // добавление к exports

// ESM
import fs from 'fs'                         // default импорт
import { readFile } from 'fs'              // named импорт
import * as fsAll from 'fs'               // namespace импорт

export function myFunc() { ... }            // named export
export default MyClass                      // default export
```

## Ключевые различия

| Характеристика | CommonJS | ESM |
|----------------|----------|-----|
| Загрузка | Синхронная | Асинхронная |
| Анализ | Динамический (runtime) | Статический (parse time) |
| Экспорты | Копии значений | Живые привязки |
| `this` в верхнем уровне | `module.exports` | `undefined` |
| `__dirname`, `__filename` | Доступны | Недоступны (используй `import.meta.url`) |
| Расширение | `.js` (в Node.js по умолчанию) | `.mjs` или `"type": "module"` в package.json |

```js
// В ESM нет __dirname — используй import.meta
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

## Интероперабельность

```js
// ESM может импортировать CJS (Node.js 12+):
import cjsModule from './legacy.cjs'  // только default import!

// CJS НЕ МОЖЕТ require() ESM:
const esm = require('./modern.mjs')   // Error: require() of ES Module

// CJS может использовать ESM через динамический импорт:
async function loadEsm() {
  const { myFunc } = await import('./modern.mjs')
  return myFunc()
}
```

<Callout type="info">
При написании библиотеки в 2024+ году: пиши в ESM, добавляй поле `"exports"` в package.json с CJS-версией через `"require"` для обратной совместимости. Инструменты типа tsup/rollup умеют автоматически генерировать оба формата.
</Callout>

## package.json: объявление типа модулей

```json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```
