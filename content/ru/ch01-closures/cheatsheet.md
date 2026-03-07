---
title: "Шпаргалка: Замыкания"
parent: "ch01-closures"
---

## Определение

**Замыкание** = функция + ссылка на лексическое окружение, где она создана.

## Ключевые факты

- Хранит **ссылку**, не копию значения
- Каждый вызов внешней функции создаёт **новое** замыкание
- `var` — одна переменная на функцию, `let` — новая на каждую итерацию

## Базовый паттерн

```js
function outer(config) {
  let state = 0
  return {
    get() { return state },
    set(v) { state = v },
  }
}
```

## Частые паттерны

```js
// Мемоизация
function memoize(fn) {
  const cache = new Map()
  return (arg) => cache.get(arg) ?? (cache.set(arg, fn(arg)), cache.get(arg))
}

// Каррирование
function curry(fn) {
  return function c(...a) {
    return a.length >= fn.length ? fn(...a) : (...b) => c(...a, ...b)
  }
}

// Debounce
function debounce(fn, ms) {
  let t
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) }
}
```

## Частые баги

```js
// ❌ Цикл + var
for (var i = 0; i < 5; i++) { setTimeout(() => log(i), 0) } // 5 5 5 5 5

// ✅ Цикл + let
for (let i = 0; i < 5; i++) { setTimeout(() => log(i), 0) } // 0 1 2 3 4
```

## Чеклист

- [ ] Используешь `let`, а не `var` в циклах?
- [ ] Есть `removeEventListener` для обработчиков?
- [ ] Не захватываешь тяжёлые объекты без необходимости?
- [ ] Не больше 2 уровней вложенности?
- [ ] Используешь стрелочную функцию для this в замыканиях?
