# Async-генераторы

Async-генераторы объединяют мощь генераторов и async/await: они могут `yield` промисы и используются с `for await...of` для асинхронных потоков данных.

import { Callout, CrossLink } from '@book/ui'

## async function* и for await...of

```js
// Имитируем постраничную загрузку данных
async function* fetchPages(url) {
  let page = 1
  while (true) {
    const response = await fetch(`${url}?page=${page}`)
    const data = await response.json()

    if (data.items.length === 0) return // нет больше данных

    yield data.items // выдаём страницу
    page++
  }
}

// Обрабатываем все страницы по мере загрузки
for await (const items of fetchPages('/api/users')) {
  console.log(`Получено ${items.length} пользователей`)
  // обрабатываем items...
}
```

<Callout type="concept">
`for await...of` работает с любым объектом, реализующим `Symbol.asyncIterator`. Каждая итерация ждёт завершения промиса прежде чем перейти к следующей.
</Callout>

## Реальный сценарий: чтение потока

```js
// Читаем большой файл построчно (Node.js)
async function* readLines(stream) {
  let buffer = ''
  for await (const chunk of stream) {
    buffer += chunk
    const lines = buffer.split('\n')
    buffer = lines.pop() // последняя незавершённая строка

    for (const line of lines) {
      yield line
    }
  }
  if (buffer) yield buffer // последняя строка без \n
}

// Использование
for await (const line of readLines(fileStream)) {
  processLine(line)
}
```

## Управление потоком с takeWhile

```js
async function* takeWhile(asyncIter, predicate) {
  for await (const item of asyncIter) {
    if (!predicate(item)) return
    yield item
  }
}

// Берём пользователей пока id < 100
for await (const user of takeWhile(fetchPages('/api/users'), items =>
  items.some(u => u.id < 100)
)) {
  console.log(user)
}
```

## Объект с Symbol.asyncIterator

```js
// Кастомный async-итерируемый объект
class EventStream {
  constructor(eventSource) {
    this.source = eventSource
  }

  [Symbol.asyncIterator]() {
    const queue = []
    let resolve = null

    this.source.onmessage = (event) => {
      if (resolve) {
        resolve({ value: event.data, done: false })
        resolve = null
      } else {
        queue.push(event.data)
      }
    }

    return {
      next() {
        if (queue.length > 0) {
          return Promise.resolve({ value: queue.shift(), done: false })
        }
        return new Promise(res => { resolve = res })
      }
    }
  }
}

const stream = new EventStream(new EventSource('/events'))
for await (const event of stream) {
  console.log('Событие:', event)
}
```

<CrossLink chapter="ch02-async" title="Асинхронность: промисы и async/await" />
