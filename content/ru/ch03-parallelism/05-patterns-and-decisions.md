---
title: "Паттерны и решения"
parent: "ch03-parallelism"
order: 5
---

## Worker Pool

Создание воркера — дорого (~5ms для worker_threads, ~30-100ms для процесса). Создавать воркер на каждую задачу — антипаттерн. **Worker pool** — N предсозданных воркеров с очередью задач.

```js
class WorkerPool {
  #workers = []
  #queue = []
  #free = []

  constructor(workerFile, size) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerFile)
      this.#workers.push(worker)
      this.#free.push(worker)
    }
  }

  exec(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject }
      const worker = this.#free.pop()
      if (worker) {
        this.#run(worker, task)
      } else {
        this.#queue.push(task) // все заняты — в очередь
      }
    })
  }

  #run(worker, task) {
    const onMessage = (result) => {
      worker.removeListener('message', onMessage)
      worker.removeListener('error', onError)
      task.resolve(result)
      this.#release(worker)
    }
    const onError = (err) => {
      worker.removeListener('message', onMessage)
      worker.removeListener('error', onError)
      task.reject(err)
      this.#release(worker)
    }
    worker.on('message', onMessage)
    worker.on('error', onError)
    worker.postMessage(task.data)
  }

  #release(worker) {
    const next = this.#queue.shift()
    if (next) {
      this.#run(worker, next) // есть задача в очереди — сразу берём
    } else {
      this.#free.push(worker) // очередь пуста — воркер свободен
    }
  }

  destroy() {
    this.#workers.forEach(w => w.terminate())
  }
}
```

Использование:

```js
const pool = new WorkerPool('./compute.js', 4)

const results = await Promise.all([
  pool.exec({ n: 40 }),
  pool.exec({ n: 41 }),
  pool.exec({ n: 42 }),
  pool.exec({ n: 43 }),
  pool.exec({ n: 44 }), // 5-я задача ждёт в очереди (пул из 4)
])

pool.destroy()
```

## Чеклист: нужен ли воркер?

```
1. Задача CPU-bound?
   Нет → async/await достаточно
   Да → продолжай ↓

2. Задача занимает > 16ms?
   Нет → не стоит (overhead > выигрыш)
   Да → продолжай ↓

3. Задача выполняется часто?
   Нет → одиночный воркер
   Да → worker pool

4. Нужна общая память?
   Нет → postMessage / Transferable
   Да → SharedArrayBuffer + Atomics

5. Нужна полная изоляция (crash safety)?
   Нет → worker_threads
   Да → child_process
```

**Правило 16ms:** один кадр при 60fps = ~16ms. Если вычисление занимает меньше — воркер не нужен, overhead создания и передачи данных съест выигрыш.

## Готовые решения

### piscina (Node.js)

Production-ready worker pool для Node.js. Используется в Node.js core, Jest, webpack.

```js
import Piscina from 'piscina'

const pool = new Piscina({
  filename: './worker.js',
  minThreads: 2,
  maxThreads: 8,
  idleTimeout: 30000, // убить неактивный поток через 30с
})

const result = await pool.run({ data: [1, 2, 3] })
```

```js
// worker.js
export default function({ data }) {
  return data.reduce((a, b) => a + b, 0)
}
```

Преимущества piscina:
- Автоматическое управление пулом (min/max threads)
- Очередь задач с приоритетами
- Поддержка Transferable и SAB
- Cancellation через AbortController
- Backpressure — не даёт переполнить очередь

### Comlink (браузер)

Библиотека от Google Chrome Labs. Превращает postMessage API в обычные вызовы функций через `Proxy`:

```js
// worker.js
import * as Comlink from 'comlink'

const api = {
  fibonacci(n) {
    if (n <= 1) return n
    return api.fibonacci(n - 1) + api.fibonacci(n - 2)
  },

  processImage(imageData) {
    // тяжёлая обработка
    return result
  }
}

Comlink.expose(api)
```

```js
// main.js
import * as Comlink from 'comlink'

const api = Comlink.wrap(new Worker('worker.js'))

// Вызываем как обычную async-функцию
const result = await api.fibonacci(42)
const processed = await api.processImage(data)
```

Comlink убирает весь boilerplate с postMessage, id-отслеживанием и сериализацией.

### workerpool (универсальный)

Работает и в Node.js, и в браузере:

```js
import workerpool from 'workerpool'

const pool = workerpool.pool('./worker.js', { maxWorkers: 4 })

const result = await pool.exec('fibonacci', [42])
pool.terminate()
```

## Сравнение библиотек

| Библиотека | Среда | Pool | Transferable | SAB | TypeScript |
|-----------|-------|------|-------------|-----|-----------|
| piscina | Node.js | ✅ | ✅ | ✅ | ✅ |
| Comlink | Браузер | ❌ | ✅ | ❌ | ✅ |
| workerpool | Оба | ✅ | ❌ | ❌ | ✅ |
| tinypool | Node.js | ✅ | ✅ | ✅ | ✅ |

## Антипаттерны

### 1. Воркер на каждый запрос

```js
// ❌ Создаёт и убивает воркер на каждый вызов
async function compute(data) {
  const worker = new Worker('./compute.js')
  return new Promise((resolve) => {
    worker.onmessage = (e) => { resolve(e.data); worker.terminate() }
    worker.postMessage(data)
  })
}

// ✅ Worker pool
const pool = new WorkerPool('./compute.js', 4)
const result = await pool.exec(data)
```

### 2. Передача огромных данных без Transferable

```js
// ❌ Копирование 100MB
worker.postMessage(hugeArrayBuffer)

// ✅ Transfer (zero-copy)
worker.postMessage(hugeArrayBuffer, [hugeArrayBuffer])
```

### 3. Atomics.wait в main thread

```js
// ❌ Deadlock: main thread заблокирован, воркер не может отправить notify
Atomics.wait(view, 0, 0) // TypeError в браузере, зависание в Node.js main

// ✅ Только в воркерах
// Или используй Atomics.waitAsync (не блокирует):
Atomics.waitAsync(view, 0, 0).value.then(() => { /* ... */ })
```

### 4. Воркер для тривиальных задач

```js
// ❌ Overhead > выигрыш
worker.postMessage([1, 2, 3]) // сложить 3 числа через воркер

// ✅ Просто посчитай в main thread
const sum = [1, 2, 3].reduce((a, b) => a + b)
```

## Выбор подхода: итоговая таблица

| Задача | Подход |
|--------|--------|
| Сетевой запрос | `async/await` (I/O-bound) |
| Парсинг JSON 1KB | Main thread (быстро) |
| Парсинг JSON 100MB | Web Worker + Transferable |
| Хеширование пароля | worker_threads |
| Обработка изображений | Web Worker |
| HTTP-сервер на все ядра | cluster / PM2 |
| Запуск ffmpeg | child_process.spawn |
| Много CPU-задач параллельно | Worker pool (piscina) |
| Общий счётчик между потоками | SharedArrayBuffer + Atomics |

## Итого

| Факт | Описание |
|------|----------|
| Worker pool | Предсоздание N воркеров + очередь задач |
| Правило 16ms | Если задача < 16ms, воркер не нужен |
| piscina | Production worker pool для Node.js |
| Comlink | Прозрачные вызовы воркера как async-функций |
| Антипаттерны | Воркер на запрос, передача без Transfer, wait в main thread |
| Выбор | I/O → async/await, CPU < 16ms → main thread, CPU > 16ms → Worker |
