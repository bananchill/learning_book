---
title: "Строгий режим и современный JS"
parent: "ch01-intro"
order: 4
---

import { Callout } from '@book/ui'

## Зачем нужен строгий режим

JavaScript создавался быстро, с ошибками в дизайне. Некоторые «особенности» языка — настоящие ловушки для разработчиков. В ES5 (2009) добавили **строгий режим** (`use strict`), который запрещает самые опасные конструкции.

Включить строгий режим просто — добавь строку в начало файла или функции:

```js
'use strict'

// Теперь эти ошибки будут выброшены явно, а не молча проигнорированы
x = 10 // ReferenceError: x is not defined (без strict — создала бы глобальную переменную!)
```

## Что запрещает strict mode

```js
'use strict'

// 1. Нельзя использовать необъявленные переменные
mistake = 42 // ❌ ReferenceError

// 2. Нельзя удалять переменные и функции
let obj = {}
delete obj // ❌ SyntaxError

// 3. Дублирующиеся параметры функции
function f(a, a) { } // ❌ SyntaxError

// 4. this в обычных функциях — undefined (не window)
function showThis() {
  console.log(this) // undefined, а не window
}
showThis()

// 5. Зарезервированные слова нельзя использовать как имена
let implements = 1 // ❌ SyntaxError
```

<Callout type="tip">
**ES-модули** (файлы с `import`/`export`) автоматически используют строгий режим — писать `'use strict'` не нужно. Если ты используешь сборщик (Vite, webpack) — скорее всего, strict уже включён.
</Callout>

## ES6+ — современный JavaScript

В 2015 году вышел **ES6 (ES2015)** — самое большое обновление языка за всю историю. С тех пор версии выходят ежегодно.

Вот что появилось в ES6+ и используется каждый день:

```js
// ES6: let и const вместо var
let count = 0
const PI = 3.14159

// ES6: стрелочные функции
const double = x => x * 2

// ES6: шаблонные литералы
const name = 'Иван'
console.log(`Привет, ${name}!`) // Привет, Иван!

// ES6: деструктуризация
const [first, ...rest] = [1, 2, 3]  // first = 1, rest = [2, 3]
const { title, author } = book       // извлечь поля объекта

// ES6: классы (синтаксический сахар над прототипами)
class Animal {
  constructor(name) {
    this.name = name
  }
  speak() {
    return `${this.name} издаёт звук`
  }
}

// ES2017: async/await
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// ES2020: optional chaining и nullish coalescing
const city = user?.address?.city ?? 'Неизвестно'
```

## Как проверить поддержку

Не все браузеры поддерживают новые фичи одинаково. Проверить поддержку можно на [caniuse.com](https://caniuse.com) или [MDN](https://developer.mozilla.org).

Для совместимости используют **транспайлеры** (Babel, TypeScript) — они преобразуют современный JS в ES5, который понимают старые браузеры.

```js
// Ты пишешь (ES2020):
const value = obj?.nested?.value ?? 'default'

// Babel преобразует в (ES5):
var _obj, _obj2
var value = (_obj = obj) === null || _obj === void 0
  ? void 0
  : (_obj2 = _obj.nested) === null || _obj2 === void 0
    ? void 0
    : _obj2.value
value = value !== null && value !== void 0 ? value : 'default'
```

<Callout type="info">
В этой книге мы используем **ES2020+** и TypeScript. Если видишь `??`, `?.`, `async/await` — это уже хорошо поддерживается во всех современных браузерах.
</Callout>
