---
title: "Шпаргалка: Параллелизм и конкурентность"
parent: "ch03-parallelism"
---

## Конкурентность vs параллелизм

```
Конкурентность:  один поток, переключение (event loop)
Параллелизм:     несколько потоков, одновременно (Workers)
```

- **I/O-bound** → async/await достаточно
- **CPU-bound > 16ms** → Worker

## Web Workers (браузер)

```js
// Создание
const worker = new Worker('worker.js')
const worker = new Worker('worker.js', { type: 'module' })

// Inline worker
const blob = new Blob([code], { type: 'application/javascript' })
const worker = new Worker(URL.createObjectURL(blob))

// Обмен сообщениями
worker.postMessage(data)        // main → worker (клон)
worker.onmessage = (e) => e.data // worker → main

// Transferable (zero-copy)
worker.postMessage(buffer, [buffer]) // buffer.byteLength → 0

// Завершение
worker.terminate()  // из main
self.close()        // из воркера
```

## SharedArrayBuffer + Atomics

```js
const sab = new SharedArrayBuffer(16)
const view = new Int32Array(sab)

// Атомарные операции
Atomics.store(view, 0, 42)          // запись
Atomics.load(view, 0)               // чтение
Atomics.add(view, 0, 1)             // += 1, возвращает старое
Atomics.sub(view, 0, 1)             // -= 1
Atomics.exchange(view, 0, 100)      // = 100, возвращает старое
Atomics.compareExchange(view, 0, expected, newVal) // CAS

// Ожидание и уведомление (ТОЛЬКО в воркерах!)
Atomics.wait(view, 0, 0)            // блокирует, пока view[0] === 0
Atomics.notify(view, 0, 1)          // будит 1 ждущий поток
Atomics.waitAsync(view, 0, 0)       // неблокирующий (для main thread)
```

## Node.js

```js
// worker_threads
import { Worker, parentPort, workerData, isMainThread } from 'node:worker_threads'
const worker = new Worker('./file.js', { workerData: { key: 'value' } })
worker.on('message', (msg) => {})
parentPort.postMessage(result) // из воркера

// child_process
import { spawn, fork, exec } from 'node:child_process'
spawn('ls', ['-la'])                     // произвольная команда
fork('./child.js')                       // Node.js скрипт + IPC
exec('git log', (err, stdout) => {})     // весь вывод сразу

// cluster
import cluster from 'node:cluster'
if (cluster.isPrimary) { cluster.fork() }
else { http.createServer(handler).listen(3000) }
```

## Structured Clone: что можно передать

| ✅ Можно | ❌ Нельзя |
|----------|-----------|
| Примитивы | Функции, замыкания |
| Объекты, массивы | DOM-элементы |
| Map, Set, Date, RegExp | Symbol, WeakMap |
| ArrayBuffer, TypedArray | Классы (теряют прототип) |

## Сравнение инструментов

| | worker_threads | child_process | cluster |
|-|---------------|--------------|---------|
| Создаёт | Поток | Процесс | N процессов |
| Запуск | ~5ms | ~30-100ms | ~30-100ms |
| SAB | ✅ | ❌ | ❌ |
| Crash | Роняет процесс | Изолирован | Изолирован |
| Для | CPU-bound | Внешние команды | HTTP-серверы |

## Чеклист: нужен ли воркер?

- [ ] Задача CPU-bound? (не I/O)
- [ ] Занимает > 16ms?
- [ ] Частая → worker pool, редкая → одиночный воркер
- [ ] Большие данные → Transferable или SAB
- [ ] Нужна crash-изоляция → child_process

## Частые ошибки

```js
// ❌ Воркер на каждый вызов
const w = new Worker('f.js'); /* ... */ w.terminate()
// ✅ Worker pool

// ❌ Копирование 100MB
worker.postMessage(hugeBuf)
// ✅ Transfer
worker.postMessage(hugeBuf, [hugeBuf])

// ❌ Atomics.wait в main thread браузера
Atomics.wait(view, 0, 0) // TypeError
// ✅ Atomics.waitAsync или только в воркерах

// ❌ view[0]++ с SharedArrayBuffer
// ✅ Atomics.add(view, 0, 1)
```

## Библиотеки

| Библиотека | Среда | Что делает |
|-----------|-------|------------|
| piscina | Node.js | Worker pool с очередями и backpressure |
| Comlink | Браузер | Прозрачные вызовы воркера через Proxy |
| workerpool | Оба | Универсальный worker pool |
| tinypool | Node.js | Лёгкий worker pool (используется в Vitest) |
