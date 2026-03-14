# Протокол итерации

`for...of`, spread-оператор и деструктуризация работают с любым объектом, реализующим **протокол итерации**. Понять этот протокол — значит понять, как JS обходит коллекции.

import { Callout, DeepDive } from '@book/ui'

## Итерируемый объект и итератор

**Итерируемый объект** (iterable) — объект с методом `Symbol.iterator`, возвращающим **итератор**.

**Итератор** — объект с методом `next()`, возвращающим `{ value, done }`.

```js
// Вручную реализуем итерируемый диапазон
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false }
        }
        return { value: undefined, done: true }
      }
    }
  }
}

for (const n of range) {
  console.log(n) // 1, 2, 3
}

console.log([...range])     // [1, 2, 3]
const [a, b] = range        // деструктуризация
```

<Callout type="info">
Встроенные итерируемые: массивы, строки, Map, Set, NodeList, аргументы функции. Обычные объекты `{}` — НЕ итерируемые.
</Callout>

## Как работает for...of

`for...of` — синтаксический сахар над протоколом итерации:

```js
// for...of раскрывается примерно в:
const iter = range[Symbol.iterator]()
let result = iter.next()
while (!result.done) {
  const n = result.value
  console.log(n)
  result = iter.next()
}
```

## Бесконечные последовательности

Итератор может никогда не возвращать `done: true` — это бесконечная последовательность:

```js
// Бесконечный счётчик
function counter(start = 0) {
  return {
    [Symbol.iterator]() {
      let i = start
      return {
        next() { return { value: i++, done: false } }
      }
    }
  }
}

// Берём только первые 5 чисел через деструктуризацию
// ОСТОРОЖНО: [...counter()] зависнет навсегда!
// Используй break или take()
for (const n of counter(10)) {
  if (n > 14) break
  console.log(n) // 10, 11, 12, 13, 14
}
```

<DeepDive title="Symbol.iterator и Symbol.asyncIterator">
Протокол синхронной итерации использует `Symbol.iterator`. Для асинхронной — `Symbol.asyncIterator`, который поддерживает `for await...of`. Async-итераторы возвращают `Promise<{ value, done }>` из `.next()`.
</DeepDive>
