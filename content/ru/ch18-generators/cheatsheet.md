# Шпаргалка: Генераторы и итераторы

## Протокол итерации

```js
// Итерируемый объект
const iterable = {
  [Symbol.iterator]() {   // метод возвращает итератор
    let i = 0
    return {
      next() {            // итератор имеет next()
        return i < 3
          ? { value: i++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}
```

## Генераторы

```js
function* gen() {
  yield 1           // пауза + возвращает 1
  yield 2           // пауза + возвращает 2
  return 'конец'    // завершает (done: true)
}

const g = gen()
g.next()  // { value: 1, done: false }
g.next()  // { value: 2, done: false }
g.next()  // { value: 'конец', done: true }

// Короткая форма — spread
[...gen()] // [1, 2] — значение return не попадает в массив
```

## Передача значений

```js
function* dialog() {
  const name = yield 'Как тебя зовут?'
  yield `Привет, ${name}!`
}
const d = dialog()
d.next()          // { value: 'Как тебя зовут?', done: false }
d.next('Алиса')  // { value: 'Привет, Алиса!', done: false }
```

## yield* — делегирование

```js
function* a() { yield 1; yield 2 }
function* b() { yield* a(); yield 3 }
[...b()] // [1, 2, 3]
```

## Бесконечные последовательности

```js
function* range(start, end = Infinity, step = 1) {
  for (let i = start; i < end; i += step) yield i
}
[...range(0, 5)]     // [0, 1, 2, 3, 4]
[...range(0, 10, 2)] // [0, 2, 4, 6, 8]
```

## Async-генераторы

```js
async function* asyncRange(start, end) {
  for (let i = start; i <= end; i++) {
    await delay(100) // можно ждать промисы
    yield i
  }
}

for await (const n of asyncRange(1, 5)) {
  console.log(n) // 1, 2, 3, 4, 5 с задержкой
}
```

## Ключевые паттерны

| Паттерн | Код |
|---------|-----|
| Ленивый диапазон | `function* range(a, b) { for (let i=a; i<b; i++) yield i }` |
| Бесконечная последовательность | `function* fib() { let [a,b]=[0,1]; while(true) { yield a; [a,b]=[b,a+b] } }` |
| Взять N элементов | `function take(gen, n) { return [...gen].slice(0, n) }` ← плохо! Используй цикл с break |
| Делегирование | `yield* otherGenerator()` |
| Постраничная загрузка | `async function* pages(url) { let p=1; while(true) { const d = await fetch(url+'?page='+p++); yield d } }` |
