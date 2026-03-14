# ESM: import и export

ESM (ECMAScript Modules) — официальный стандарт модулей в JS. Все современные браузеры и Node.js 12+ поддерживают нативно.

import { Callout, DeepDive } from '@book/ui'

## Named exports

```js
// math.js — именованные экспорты
export const PI = 3.14159

export function add(a, b) { return a + b }

export function subtract(a, b) { return a - b }

// Или группой в конце файла:
const multiply = (a, b) => a * b
const divide = (a, b) => a / b
export { multiply, divide }
```

```js
// main.js — именованные импорты
import { add, subtract } from './math.js'
import { PI } from './math.js'

// Переименование при импорте
import { multiply as mul, divide as div } from './math.js'

// Импорт всего в пространство имён
import * as math from './math.js'
math.add(1, 2) // 3
```

## Default export

```js
// user.js — один default export на файл
export default class User {
  constructor(name) { this.name = name }
  greet() { return `Привет, ${this.name}!` }
}
```

```js
// main.js — default импортируется с любым именем
import User from './user.js'
import MyUser from './user.js' // тоже работает — любое имя
```

<Callout type="tip">
Предпочитай именованные экспорты default-у. Они явны: IDE подсказывает точное имя, рефакторинг надёжнее, tree shaking работает лучше. Default используй только для «главного» объекта модуля (например, класс с тем же именем что и файл).
</Callout>

## Re-export — агрегирование

```js
// index.js — публичное API библиотеки
export { add, subtract } from './math.js'
export { default as User } from './user.js'
export * from './utils.js'

// Теперь потребители импортируют только из одного места:
import { add, User } from './my-library'
```

<DeepDive title="Живые привязки (live bindings)">
В ESM `import` создаёт «живые привязки» — не копии значений, а ссылки на экспортированные переменные. Если экспортирующий модуль изменит переменную, импортирующий увидит новое значение. В CommonJS `require` копирует значение на момент загрузки.
</DeepDive>
