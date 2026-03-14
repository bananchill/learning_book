# Генераторы: синтаксис и поведение

Генераторы автоматически реализуют протокол итерации — не нужно вручную писать `[Symbol.iterator]` и объект с `next()`.

import { Callout, DeepDive } from '@book/ui'

## function* и yield

```js
function* simpleGen() {
  console.log('шаг 1')
  yield 'A'
  console.log('шаг 2')
  yield 'B'
  console.log('шаг 3')
  // return — завершает генератор с done: true
}

const gen = simpleGen() // функция ЕЩЁ НЕ выполняется!

gen.next() // выводит «шаг 1», возвращает { value: 'A', done: false }
gen.next() // выводит «шаг 2», возвращает { value: 'B', done: false }
gen.next() // выводит «шаг 3», возвращает { value: undefined, done: true }
gen.next() // { value: undefined, done: true } — генератор исчерпан
```

<Callout type="concept">
`yield` делает две вещи одновременно: **выбрасывает** значение наружу и **получает** значение обратно при следующем вызове `.next(value)`.
</Callout>

## Передача значений в генератор

```js
function* accumulator() {
  let total = 0
  while (true) {
    const value = yield total  // получаем значение от .next(value)
    if (value === null) break
    total += value
  }
  return total
}

const acc = accumulator()
acc.next()      // запускаем до первого yield → { value: 0, done: false }
acc.next(10)    // передаём 10 → { value: 10, done: false }
acc.next(20)    // передаём 20 → { value: 30, done: false }
acc.next(null)  // завершаем  → { value: 30, done: true }
```

## yield* — делегирование

```js
function* inner() {
  yield 'x'
  yield 'y'
}

function* outer() {
  yield 'a'
  yield* inner()  // делегируем в inner
  yield 'b'
}

console.log([...outer()]) // ['a', 'x', 'y', 'b']
```

## Досрочное завершение: return() и throw()

```js
function* gen() {
  try {
    yield 1
    yield 2
  } finally {
    console.log('cleanup') // выполнится при .return() и .throw()
  }
}

const g = gen()
g.next()            // { value: 1, done: false }
g.return('done')    // выводит «cleanup», возвращает { value: 'done', done: true }
```

<DeepDive title="Генераторы и конечные автоматы">
Каждый `yield` — это состояние конечного автомата. Генератор хранит «позицию» выполнения в замыкании, что делает его идеальным для реализации state machine: светофор, парсер протокола, workflow-движок.
</DeepDive>
