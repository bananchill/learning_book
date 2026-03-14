---
title: "Шпаргалка: Scope, Hoisting, TDZ"
---

## Лексическое окружение

```
Lexical Environment = Environment Record + [[OuterEnv]]
                      (переменные)         (родительский скоуп)
```

Поиск переменной: текущий скоуп → [[OuterEnv]] → ... → глобальный → ReferenceError

## Hoisting

| Конструкция | Поднимается | Значение до строки |
|-------------|-------------|-------------------|
| `function f() {}` | Да (полностью) | Функция доступна |
| `var x` | Да (частично) | `undefined` |
| `let x` | Нет (TDZ) | ReferenceError |
| `const x` | Нет (TDZ) | ReferenceError |
| `class X` | Нет (TDZ) | ReferenceError |
| `const f = () => {}` | Нет (как const) | ReferenceError |

## TDZ — Temporal Dead Zone

```js
// От начала скоупа до строки let/const — TDZ
{
  // TDZ для x
  console.log(x) // ReferenceError!
  let x = 5      // конец TDZ
  console.log(x) // 5
}

// typeof НЕ безопасен в TDZ!
typeof x  // ReferenceError если x — let/const в TDZ
typeof y  // "undefined" если y вообще не объявлена
```

## var vs let/const — скоуп

```js
function f() {
  if (true) {
    var a = 1    // скоуп: функция f
    let b = 2    // скоуп: блок if
    const c = 3  // скоуп: блок if
  }
  console.log(a)  // 1 ✓
  // console.log(b) // ReferenceError
  // console.log(c) // ReferenceError
}
```

## Проблема var в цикле и решение

```js
// Проблема
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)) // 3, 3, 3
}

// Решение 1: let
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)) // 0, 1, 2
}

// Решение 2: IIFE
for (var i = 0; i < 3; i++) {
  ((j) => setTimeout(() => console.log(j)))(i) // 0, 1, 2
}
```

## IIFE

```js
// Создание изолированного скоупа
const module = (function() {
  let private = 0        // приватное состояние
  return {
    get: () => private,  // публичный API
    inc: () => ++private
  }
})()
```
