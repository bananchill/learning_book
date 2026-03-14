---
title: "Шпаргалка: this и контекст"
---

## Четыре правила (приоритет сверху вниз)

| Правило | Пример вызова | this |
|---------|--------------|------|
| new | `new Fn()` | Новый объект |
| Явный | `fn.call(obj)` / `fn.apply(obj)` / `fn.bind(obj)()` | `obj` |
| Неявный | `obj.method()` | `obj` |
| По умолчанию | `fn()` | `undefined` (strict) / global |

## Быстрая диагностика

```
fn.call(x)     → this = x
fn.apply(x)    → this = x
fn.bind(x)()   → this = x
new fn()       → this = новый объект
obj.fn()       → this = obj
fn()           → this = undefined (strict) / global
(() => {})()   → this из внешнего контекста
```

## call vs apply vs bind

```js
fn.call(ctx, a, b)     // вызывает, аргументы через запятую
fn.apply(ctx, [a, b])  // вызывает, аргументы массивом
const f = fn.bind(ctx) // НЕ вызывает, возвращает новую функцию
f(a, b)                // вызов позже
```

## Стрелочные функции

```js
// Берут this из внешнего контекста (лексически)
const obj = {
  name: 'x',
  fn: () => this,     // this из места где obj определён, НЕ obj!
  method() {
    return () => this  // this из method() === obj ✓
  }
}
```

## Когда НЕ использовать стрелки

- Методы объекта (нужен this === объект)
- Конструкторы (стрелки нельзя вызывать с new)
- Обработчики событий, где нужен this === DOM-элемент

## Решение потери контекста

```js
// 1. Стрелочная обёртка
setTimeout(() => obj.method(), 100)

// 2. bind
setTimeout(obj.method.bind(obj), 100)

// 3. Стрелочный class field
class C { handleClick = () => { this.count++ } }
```
