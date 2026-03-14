# Практические применения генераторов

Генераторы особенно полезны там, где нужны **ленивые вычисления** (вычисляем только то, что нужно прямо сейчас) или **бесконечные последовательности**.

import { Callout } from '@book/ui'

## Диапазоны и шаги

```js
// range(1, 10, 2) → 1, 3, 5, 7, 9
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i
  }
}

console.log([...range(0, 10, 3)]) // [0, 3, 6, 9]

// Бесконечная последовательность Фибоначчи
function* fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a
    ;[a, b] = [b, a + b]
  }
}

// Берём только первые N значений
function take(gen, n) {
  const result = []
  for (const val of gen) {
    result.push(val)
    if (result.length >= n) break
  }
  return result
}

take(fibonacci(), 8) // [0, 1, 1, 2, 3, 5, 8, 13]
```

## Ленивые map и filter

В отличие от `Array.map().filter()`, генераторы не создают промежуточные массивы:

```js
function* lazyMap(iterable, fn) {
  for (const item of iterable) {
    yield fn(item)
  }
}

function* lazyFilter(iterable, pred) {
  for (const item of iterable) {
    if (pred(item)) yield item
  }
}

// Обрабатываем миллион чисел без создания промежуточных массивов
const numbers = range(1, 1_000_000)
const result = lazyFilter(
  lazyMap(numbers, x => x * x),
  x => x % 3 === 0
)

// Вычисления происходят лениво — только при итерации
for (const n of result) {
  if (n > 100) break // обработали только нужное количество элементов
}
```

<Callout type="tip">
Ленивые генераторы особенно полезны при работе с большими файлами, потоками данных или бесконечными последовательностями — они не держат всё в памяти.
</Callout>

## Конечный автомат на генераторах

```js
// Светофор как генератор
function* trafficLight() {
  while (true) {
    yield 'green'   // едем
    yield 'yellow'  // замедляемся
    yield 'red'     // стоим
  }
}

const light = trafficLight()
light.next().value // 'green'
light.next().value // 'yellow'
light.next().value // 'red'
light.next().value // 'green' — цикл повторяется
```

## Плоское разворачивание вложенных структур

```js
// Рекурсивный обход дерева
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item) // рекурсивное делегирование
    } else {
      yield item
    }
  }
}

const nested = [1, [2, [3, [4]], 5], 6]
console.log([...flatten(nested)]) // [1, 2, 3, 4, 5, 6]
```
