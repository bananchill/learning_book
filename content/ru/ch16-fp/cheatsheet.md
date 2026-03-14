---
title: "Шпаргалка: Функциональное программирование"
---

## Чистая функция

```
✓ Одинаковые аргументы → одинаковый результат
✓ Нет побочных эффектов (нет мутаций, нет I/O)
✗ Math.random(), Date.now() — нечистые
✗ arr.sort(), arr.push() — мутируют аргумент
```

## Иммутабельность

```js
// Объект: создай новый
const updated = { ...original, field: newValue }
const { toRemove, ...withoutField } = original

// Массив: создай новый
const added = [...arr, newItem]
const removed = arr.filter((_, i) => i !== idx)
const mapped = arr.map(item => transform(item))
```

## pipe и compose

```js
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

const transform = pipe(double, addOne, square)
// double(x) → addOne → square
```

## Maybe

```js
Maybe.of(value)
  .map(fn)         // применяет fn если не null
  .getOrElse(def)  // возвращает значение или def

// Встроенный аналог: optional chaining
user?.profile?.address?.city ?? 'Unknown'
```

## Either

```js
Either.right(value)  // успех
Either.left(error)   // ошибка

// Применяется только к Right
map(fn, Either.right(5))  // Either.right(fn(5))
map(fn, Either.left(e))   // Either.left(e) — пропущено
```

## Принципы

1. Выдели чистые функции — изолируй side effects
2. Не мутируй — возвращай новые структуры
3. Compose/pipe — строй из маленьких функций большие
4. Maybe — для null-safe операций
5. Either — для функциональной обработки ошибок
