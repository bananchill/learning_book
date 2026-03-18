# Генераторы: синтаксис и поведение

Генераторы автоматически реализуют протокол итерации — не нужно вручную писать `[Symbol.iterator]` и объект с `next()`.

import { Callout, DeepDive } from '@book/ui'

## function* и yield

Генераторная функция объявляется с помощью `function*` и содержит одно или несколько выражений `yield`, каждое из которых приостанавливает выполнение и возвращает значение наружу. Вызов генераторной функции не запускает её код — он создаёт объект-генератор с методом `next()`, и только при каждом вызове `next()` выполнение продвигается до следующего `yield`.

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

Оператор `yield*` передаёт управление другому итерируемому объекту или генератору, последовательно выдавая все его значения. Это позволяет разбивать сложную логику генерации на отдельные генераторы и компоновать их вместе, сохраняя линейный поток значений.

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

Генератор можно завершить досрочно извне: `gen.return(value)` завершает генератор и возвращает указанное значение, а `gen.throw(error)` выбрасывает ошибку внутри генератора в точке последнего `yield`. Блок `finally` внутри генератора гарантированно выполнится в обоих случаях — используйте его для освобождения ресурсов.

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
