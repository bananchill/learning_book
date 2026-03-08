---
title: "Web Workers"
parent: "ch03-parallelism"
order: 2
---

## Что такое Web Worker

Web Worker — отдельный поток выполнения JavaScript в браузере. Код в воркере работает **параллельно** с main thread — не блокирует UI, не мешает рендерингу.

```js
// main.js — главный поток
const worker = new Worker('worker.js')

worker.postMessage({ n: 45 })         // отправляем задачу

worker.onmessage = (event) => {
  console.log('Результат:', event.data) // получаем ответ
}
```

```js
// worker.js — отдельный поток
self.onmessage = (event) => {
  const result = fibonacci(event.data.n)
  self.postMessage(result)             // отправляем обратно
}

function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}
```

Два потока, два файла, общение через сообщения. Main thread свободен — UI не тормозит.

## Создание воркера

### Из файла

```js
const worker = new Worker('worker.js')
// или с type: 'module' для ES-модулей
const worker = new Worker('worker.js', { type: 'module' })
```

### Inline Worker (через Blob)

Когда не хочется создавать отдельный файл:

```js
const code = `
  self.onmessage = (e) => {
    const result = e.data * 2
    self.postMessage(result)
  }
`
const blob = new Blob([code], { type: 'application/javascript' })
const worker = new Worker(URL.createObjectURL(blob))
```

Inline-воркеры удобны для небольших задач и тестов.

## Обмен сообщениями: postMessage

Единственный способ общения между main thread и worker — **postMessage/onmessage**:

```js
// Main → Worker
worker.postMessage({ type: 'compute', data: [1, 2, 3] })

// Worker → Main
// внутри worker.js:
self.postMessage({ type: 'result', value: 6 })
```

Данные **копируются** при передаче — это называется **structured cloning**. Оригинал и копия полностью независимы.

## Structured Clone Algorithm

Алгоритм клонирования определяет, что можно передать через postMessage:

| Можно | Нельзя |
|-------|--------|
| Примитивы (string, number, boolean) | Функции |
| Объекты и массивы | DOM-элементы |
| Map, Set | Классы (теряют прототип) |
| Date, RegExp | Symbol |
| ArrayBuffer, TypedArray | WeakMap, WeakRef |
| Blob, File, ImageData | Замыкания |

```js
// ✅ Работает
worker.postMessage({ users: [{ name: 'Анна', age: 25 }] })
worker.postMessage(new Map([['key', 'value']]))

// ❌ Ошибка: функции нельзя клонировать
worker.postMessage({ callback: () => {} })
// DataCloneError: () => {} could not be cloned
```

> Замыкания из [главы 1](/javascript/ch01-closures) не передать в воркер — функции нельзя клонировать. Это фундаментальное ограничение: воркер не имеет доступа к scope основного потока.

## Transferable Objects

Клонирование больших данных дорого. **Transferable** позволяет _передать владение_ без копирования:

```js
const buffer = new ArrayBuffer(1024 * 1024 * 100) // 100 MB

// ❌ Медленно: копирование 100 MB
worker.postMessage(buffer)

// ✅ Мгновенно: передача владения (zero-copy)
worker.postMessage(buffer, [buffer])
console.log(buffer.byteLength) // 0 — буфер больше не доступен в main thread
```

После transfer буфер **нейтрализуется** в отправляющем потоке — его размер становится 0. Данные теперь принадлежат воркеру.

Transferable-типы: `ArrayBuffer`, `MessagePort`, `OffscreenCanvas`, `ImageBitmap`, `ReadableStream`, `WritableStream`.

## Ограничения воркеров

Воркер — **изолированный контекст**. Нет доступа к:

| Недоступно | Почему |
|------------|--------|
| `document`, DOM | DOM не thread-safe |
| `window` | Есть `self` вместо `window` |
| `localStorage` | Синхронный API, не thread-safe |
| `alert()`, `confirm()` | Привязаны к UI |
| Основной scope | Полная изоляция памяти |

Доступно в воркере:

| Доступно | Пример |
|----------|--------|
| `fetch` | Сетевые запросы |
| `setTimeout/setInterval` | Таймеры |
| `indexedDB` | Асинхронная БД |
| `WebSocket` | Реал-тайм соединения |
| `crypto` | Web Crypto API |
| `importScripts()` | Загрузка скриптов |
| `navigator` | Информация о браузере |

## Типы воркеров

| Тип | Scope | Количество | Назначение |
|-----|-------|------------|------------|
| **Dedicated Worker** | Один tab | 1:1 со страницей | CPU-bound задачи |
| **Shared Worker** | Несколько tabs | 1:N | Общее состояние между вкладками |
| **Service Worker** | Origin | 1 на origin | Кеширование, offline, push-уведомления |

В этой главе мы работаем с **Dedicated Worker** — самый простой и частый тип.

## Завершение воркера

```js
// Из main thread — немедленное убийство
worker.terminate()

// Из самого воркера — корректное завершение
self.close()
```

`terminate()` убивает поток мгновенно — текущие операции прерываются. Используй, когда результат больше не нужен (пользователь ушёл со страницы, таймаут).

## Обработка ошибок

```js
worker.onerror = (event) => {
  console.error('Ошибка в воркере:', event.message)
  console.error('Файл:', event.filename, 'строка:', event.lineno)
}

// Или через addEventListener
worker.addEventListener('error', (event) => {
  event.preventDefault() // предотвращает вывод в консоль
  handleWorkerError(event)
})
```

Необработанная ошибка в воркере **не крашит** main thread — но воркер может перестать отвечать на сообщения.

## Паттерн: запрос-ответ

postMessage — fire-and-forget. Чтобы связать запрос с ответом, добавляй идентификатор:

```js
// main.js
let requestId = 0
const pending = new Map()

function compute(data) {
  const id = requestId++
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    worker.postMessage({ id, data })
  })
}

worker.onmessage = (event) => {
  const { id, result, error } = event.data
  const handler = pending.get(id)
  if (handler) {
    pending.delete(id)
    error ? handler.reject(new Error(error)) : handler.resolve(result)
  }
}

// Использование
const result = await compute({ n: 42 })
```

Этот паттерн настолько частый, что библиотека **Comlink** делает его автоматически (подробнее в [подглаве 5](/javascript/ch03-parallelism/05-patterns-and-decisions)).

## Итого

| Факт | Описание |
|------|----------|
| Web Worker | Отдельный поток JS в браузере, не блокирует UI |
| postMessage | Единственный канал связи, данные клонируются |
| Structured Clone | Копирует объекты, массивы, Map/Set; не копирует функции и DOM |
| Transferable | Zero-copy передача ArrayBuffer — мгновенно, но источник теряет доступ |
| Ограничения | Нет DOM, нет window, нет localStorage |
| terminate() | Мгновенное убийство воркера из main thread |
