# Tree Shaking и циклические зависимости

Tree shaking — устранение неиспользуемого кода бандлером. Работает только с ESM, потому что его импорты статичны и анализируются до выполнения.

import { Callout, DeepDive } from '@book/ui'

## Как работает tree shaking

```js
// utils.js — большая библиотека
export function usedFunction() { return 'используется' }
export function unusedFunction() { return 'не используется' }
export const BIG_CONSTANT = new Array(10000).fill(0) // большой массив

// main.js — импортируем только нужное
import { usedFunction } from './utils.js'
// unusedFunction и BIG_CONSTANT не попадут в бандл!
```

```js
// ПЛОХО для tree shaking — импорт всего
import * as utils from './utils.js'  // всё попадёт в бандл

// ХОРОШО — только нужное
import { usedFunction } from './utils.js'
```

<Callout type="warning">
Tree shaking не работает с CommonJS! `require()` выполняется в runtime, бандлер не знает заранее что будет использоваться. Для tree shaking нужны именно ESM-экспорты.
</Callout>

## Побочные эффекты (side effects)

```js
// sideEffect.js
import './polyfills.js'          // выполняет код при загрузке!
console.log('модуль загружен')   // это побочный эффект

// Бандлер по умолчанию считает все файлы имеющими побочные эффекты
// Объяви чистые файлы в package.json:
{
  "sideEffects": false,          // весь код без побочных эффектов
  // Или укажи конкретные файлы с побочными эффектами:
  "sideEffects": ["./src/polyfills.js", "*.css"]
}
```

## Циклические зависимости

Циклические зависимости — когда A импортирует B, а B импортирует A. В ESM это допустимо благодаря живым привязкам, но требует осторожности:

```js
// a.js
import { b } from './b.js'
export const a = 'A: ' + b  // b может быть undefined при инициализации!

// b.js
import { a } from './a.js'
export const b = 'B'  // инициализируется первой (если её загружают первой)
```

```js
// БЕЗОПАСНЫЙ паттерн: используй функции, не константы
// a.js
import { getB } from './b.js'
export function getA() { return 'A: ' + getB() }  // вызов отложен!

// b.js
import { getA } from './a.js'
export function getB() { return 'B' }
```

<Callout type="tip">
Циклические зависимости — обычно сигнал о проблеме архитектуры. Выдели общую зависимость в отдельный модуль (shared), на который ссылаются оба.
</Callout>

<DeepDive title="Как ESM разрешает циклы">
ESM строит граф зависимостей до выполнения кода. При цикле A→B→A JavaScript создаёт «дырки» (TDZ-подобные) для неинициализированных привязок. Когда B попытается читать `a` до того как A был выполнен, получит `undefined` (или TDZ-ошибку для `const`/`let`). Функции в безопасности — их тела не выполняются при объявлении.
</DeepDive>
