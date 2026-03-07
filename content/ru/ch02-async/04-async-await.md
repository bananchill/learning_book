---
title: "Async/Await: синтаксический сахар и подводные камни"
parent: "ch02-async"
order: 4
---

## Что такое async/await

`async/await` — синтаксический сахар над промисами. Async-функция **всегда** возвращает промис, а `await` приостанавливает выполнение до разрешения промиса:

```js
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`)
  const user = await response.json()
  return user // оборачивается в Promise.resolve(user)
}

// Эквивалент на промисах:
function getUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
}
```

`await` можно использовать только внутри `async`-функции (или на верхнем уровне модуля — top-level await).

## Как работает await под капотом

При встрече `await` происходит следующее:

1. Async-функция **приостанавливается**
2. Управление возвращается вызывающему коду
3. Остаток функции ставится в **очередь микрозадач**
4. Когда промис разрешается — выполнение продолжается

```js
async function example() {
  console.log('A')        // синхронно
  await Promise.resolve()
  console.log('B')        // микрозадача — после await
}

console.log('1')
example()
console.log('2')

// Вывод: 1, A, 2, B
// 'B' выполняется после '2', потому что await отложил остаток функции
```

## Обработка ошибок: try/catch

С `async/await` можно использовать обычный `try/catch`:

```js
async function loadData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.error('Ошибка загрузки:', err.message)
    return null // значение по умолчанию
  }
}
```

### try/catch vs .catch()

Оба подхода работают. Выбирай в зависимости от контекста:

```js
// try/catch — когда нужна общая обработка нескольких операций
async function process() {
  try {
    const a = await stepA()
    const b = await stepB(a)
    return await stepC(b)
  } catch (err) {
    // Ловит ошибку из любого шага
  }
}

// .catch() — когда нужна точечная обработка
async function process() {
  const a = await stepA().catch(() => defaultA)
  const b = await stepB(a).catch(() => defaultB)
  return b
}
```

## Подводный камень: последовательный await

Самая частая ошибка — ставить `await` для **независимых** операций:

```js
// ❌ Последовательно: ~3 секунды (1 + 1 + 1)
async function loadAll() {
  const users = await fetch('/api/users')     // ждём 1 сек
  const posts = await fetch('/api/posts')     // ждём ещё 1 сек
  const comments = await fetch('/api/comments') // ещё 1 сек
  return { users, posts, comments }
}

// ✅ Параллельно: ~1 секунда (максимум из трёх)
async function loadAll() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/posts'),
    fetch('/api/comments'),
  ])
  return { users, posts, comments }
}
```

Правило: если операции **не зависят** друг от друга — запускай параллельно через `Promise.all`.

## Подводный камень: await в цикле

```js
// ❌ Последовательно — каждый запрос ждёт предыдущий
async function fetchAll(urls) {
  const results = []
  for (const url of urls) {
    const data = await fetch(url).then(r => r.json())
    results.push(data)
  }
  return results
}

// ✅ Параллельно — все запросы одновременно
async function fetchAll(urls) {
  return Promise.all(urls.map(url => fetch(url).then(r => r.json())))
}
```

Но иногда **последовательное** выполнение — это то, что нужно (например, при зависимости каждого шага от предыдущего):

```js
// ✅ Последовательно — каждый шаг зависит от предыдущего
async function migrate(steps) {
  for (const step of steps) {
    await step() // тут последовательность правильна
  }
}
```

## Подводный камень: forEach + async

`forEach` не умеет ждать промисы:

```js
// ❌ forEach не ждёт — вернёт пустой массив
async function process(items) {
  const results = []
  items.forEach(async (item) => {
    const result = await transform(item)
    results.push(result)
  })
  return results // [] — forEach уже завершился!
}

// ✅ for...of ждёт каждый await
async function process(items) {
  const results = []
  for (const item of items) {
    results.push(await transform(item))
  }
  return results
}

// ✅ Или параллельно через map + Promise.all
async function process(items) {
  return Promise.all(items.map(item => transform(item)))
}
```

## Top-level await

В ES-модулях `await` можно использовать на верхнем уровне:

```js
// config.js (ES module)
const response = await fetch('/api/config')
export const config = await response.json()

// main.js
import { config } from './config.js' // модуль ждёт загрузки конфига
```

Top-level await блокирует выполнение модуля и всех зависимых модулей. Используй с осторожностью.

## Async iterators: for await...of

Для работы с потоками данных используются асинхронные итераторы:

```js
// Чтение файла по частям (Node.js)
async function readLines(stream) {
  const lines = []
  for await (const chunk of stream) {
    lines.push(chunk.toString())
  }
  return lines
}
```

<DeepDive>

Под капотом `async/await` — это синтаксический сахар над генераторами и промисами. Компилятор превращает async-функцию в генератор, где каждый `await` — это `yield`. V8 использует специальные оптимизации для async stack traces (с версии V8 7.3), чтобы в стектрейсах отображались промежуточные async-вызовы, а не только текущий микротаск.

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| async function | Всегда возвращает промис |
| await | Приостанавливает функцию, остаток — в микрозадачу |
| try/catch | Стандартная обработка ошибок async/await |
| Параллельность | `Promise.all` для независимых операций |
| forEach + async | Не работает — используй `for...of` или `map` + `Promise.all` |
| Top-level await | Только в ES-модулях, блокирует импорт |
