# Шпаргалка: Модули JavaScript

## ESM синтаксис

```js
// Экспорт
export const x = 1                    // named export
export function fn() {}               // named export
export default class Cls {}           // default export
export { a, b, c }                    // группой
export { fn as alias }                // с псевдонимом
export { default } from './other.js'  // re-export default

// Импорт
import { x, fn } from './mod.js'      // named imports
import Cls from './mod.js'            // default import
import { fn as f } from './mod.js'    // с псевдонимом
import * as mod from './mod.js'       // namespace import
import './side-effect.js'             // только side effects
```

## CommonJS синтаксис

```js
// Экспорт
module.exports = { fn, Cls }          // экспорт объекта
module.exports = fn                   // экспорт функции
exports.fn = fn                       // добавление к exports

// Импорт
const { fn, Cls } = require('./mod')  // деструктуризация
const fn = require('./mod')           // прямой импорт
```

## CJS vs ESM — ключевые различия

| | CJS | ESM |
|--|-----|-----|
| Синтаксис | `require` / `module.exports` | `import` / `export` |
| Выполнение | Синхронное | Асинхронное |
| Анализ | Runtime (динамический) | Parse time (статический) |
| Экспорты | Копии | Живые привязки |
| Tree shaking | Нет | Да |
| Браузер | Нет (нужен бандлер) | Да (нативно) |
| `__dirname` | Да | `fileURLToPath(import.meta.url)` |

## Динамический import()

```js
// Ленивая загрузка
const mod = await import('./heavy.js')

// Деструктуризация
const { fn } = await import('./math.js')

// В Vue Router
{ component: () => import('./Page.vue') }

// import.meta
import.meta.url           // URL текущего файла
import.meta.env.MODE      // 'development' | 'production' (Vite)
```

## Tree shaking

```js
// Хорошо — именованный импорт
import { usedFn } from 'big-lib'     // только usedFn в бандле

// Плохо — namespace import
import * as lib from 'big-lib'       // всё попадёт в бандл

// package.json
{ "sideEffects": false }             // файл без побочных эффектов
```

## Циклические зависимости — безопасный паттерн

```js
// ОПАСНО: константы могут быть undefined при циклах
export const value = otherValue      // может быть undefined!

// БЕЗОПАСНО: функции вызываются лениво
export function getValue() {
  return otherValue                  // вызов отложен до runtime
}
```
