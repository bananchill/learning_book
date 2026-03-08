---
title: "Паттерны и реальные задачи"
parent: "ch02-async"
order: 5
---

## Retry с exponential backoff

Сетевые запросы могут упасть из-за временных проблем. Паттерн retry повторяет операцию с увеличивающейся задержкой:

```js
async function retry(fn, maxAttempts = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxAttempts - 1) throw err
      const delay = baseDelay * 2 ** attempt // 1s, 2s, 4s, ...
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

// Использование
const data = await retry(() => fetch('/api/data').then(r => r.json()))
```

Exponential backoff предотвращает перегрузку сервера при массовых повторах.

## Timeout-обёртка

Ограничение времени ожидания через `Promise.race`:

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: ${ms}ms`)), ms)
  )
  return Promise.race([promise, timeout])
}

// Использование
try {
  const data = await withTimeout(fetch('/api/slow'), 5000)
} catch (err) {
  console.error(err.message) // 'Timeout: 5000ms'
}
```

## Parallel limit (ограничение одновременных запросов)

1000 `fetch` одновременно — плохая идея. Ограничим количество одновременных задач:

```js
async function parallelLimit(tasks, limit) {
  const results = []
  const executing = new Set()

  for (const [i, task] of tasks.entries()) {
    const p = task().then(result => {
      executing.delete(p)
      results[i] = result
    })
    executing.add(p)

    if (executing.size >= limit) {
      await Promise.race(executing) // ждём завершения одной
    }
  }

  await Promise.all(executing) // дожидаемся оставшихся
  return results
}

// Использование: не более 5 запросов одновременно
const urls = Array.from({ length: 100 }, (_, i) => `/api/items/${i}`)
const tasks = urls.map(url => () => fetch(url).then(r => r.json()))
const results = await parallelLimit(tasks, 5)
```

## AbortController: отмена операций

`AbortController` — стандартный механизм отмены асинхронных операций:

```js
const controller = new AbortController()

// Отменяем через 5 секунд
setTimeout(() => controller.abort(), 5000)

try {
  const response = await fetch('/api/large-data', {
    signal: controller.signal,
  })
  const data = await response.json()
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Запрос отменён')
  }
}
```

### Отмена в React

```jsx
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') setError(err)
    })

  // Cleanup — отменяем при размонтировании или изменении deps
  return () => controller.abort()
}, [userId])
```

## Debounce и Throttle

Два паттерна для контроля частоты вызовов — основаны на замыканиях и таймерах.

### Debounce — вызов после паузы

Вызывает функцию только после того, как прошло `ms` миллисекунд без новых вызовов:

```js
function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

// Поиск: запрос только после 300мс паузы в печати
const search = debounce(query => fetch(`/api/search?q=${query}`), 300)
input.addEventListener('input', e => search(e.target.value))
```

### Throttle — не чаще раз в N мс

Гарантирует, что функция вызывается не чаще одного раза в `ms`:

```js
function throttle(fn, ms) {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= ms) {
      lastCall = now
      fn(...args)
    }
  }
}

// Скролл: обработка не чаще раз в 100мс
window.addEventListener('scroll', throttle(handleScroll, 100))
```

## Async Queue (последовательная очередь)

Задачи ставятся в очередь и выполняются строго по одной:

```js
class AsyncQueue {
  #queue = []
  #running = false

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ task, resolve, reject })
      this.#process()
    })
  }

  async #process() {
    if (this.#running) return
    this.#running = true

    while (this.#queue.length > 0) {
      const { task, resolve, reject } = this.#queue.shift()
      try {
        resolve(await task())
      } catch (err) {
        reject(err)
      }
    }

    this.#running = false
  }
}

// Использование: запись в файл строго по очереди
const queue = new AsyncQueue()
queue.enqueue(() => writeFile('log.txt', 'line 1'))
queue.enqueue(() => writeFile('log.txt', 'line 2'))
```

## Race condition и как их избежать

Race condition — когда результат зависит от порядка завершения асинхронных операций:

```js
// ❌ Race condition: быстрый поиск перезаписывается медленным
let currentQuery = ''

async function search(query) {
  currentQuery = query
  const results = await fetch(`/api/search?q=${query}`)
  // Если пользователь уже ввёл новый запрос — результат устарел
  if (query !== currentQuery) return // игнорируем устаревший ответ
  renderResults(await results.json())
}
```

Лучшее решение — `AbortController`:

```js
// ✅ Отмена предыдущего запроса
let controller

async function search(query) {
  controller?.abort() // отменяем предыдущий
  controller = new AbortController()

  try {
    const response = await fetch(`/api/search?q=${query}`, {
      signal: controller.signal,
    })
    renderResults(await response.json())
  } catch (err) {
    if (err.name !== 'AbortError') throw err
  }
}
```

## Итого

| Паттерн | Когда использовать |
|---------|-------------------|
| Retry + backoff | Нестабильная сеть, временные ошибки |
| Timeout | Ограничение времени ожидания |
| Parallel limit | Много задач, нельзя все сразу |
| AbortController | Отмена fetch, cleanup в React |
| Debounce | Поиск, автосохранение — после паузы |
| Throttle | Скролл, resize — не чаще N мс |
| Async Queue | Строго последовательные операции |
| Race condition fix | AbortController или проверка актуальности |
