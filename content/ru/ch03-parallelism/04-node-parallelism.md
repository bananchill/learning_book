---
title: "Параллелизм в Node.js"
parent: "ch03-parallelism"
order: 4
---

## Три инструмента

Node.js предоставляет три механизма для параллельного выполнения кода:

| Механизм | Что создаёт | Изоляция | Общая память |
|----------|------------|----------|-------------|
| `worker_threads` | Поток в том же процессе | Отдельный event loop, V8 isolate | Через SharedArrayBuffer |
| `child_process` | Отдельный процесс | Полная (свой PID, своя память) | Нет (только IPC) |
| `cluster` | N копий процесса | Полная | Нет |

## worker_threads

Потоки внутри одного процесса Node.js. Лёгкие, быстрый обмен данными, общая память.

```js
// main.js
import { Worker } from 'node:worker_threads'

const worker = new Worker('./compute.js', {
  workerData: { numbers: [1, 2, 3, 4, 5] }
})

worker.on('message', (result) => {
  console.log('Сумма:', result) // 15
})

worker.on('error', (err) => {
  console.error('Ошибка в воркере:', err)
})

worker.on('exit', (code) => {
  console.log('Воркер завершился с кодом:', code)
})
```

```js
// compute.js
import { parentPort, workerData } from 'node:worker_threads'

const sum = workerData.numbers.reduce((a, b) => a + b, 0)
parentPort.postMessage(sum)
```

### workerData и parentPort

- `workerData` — данные, переданные при создании (structured clone)
- `parentPort` — канал связи с родительским потоком
- `isMainThread` — проверка: main или worker

```js
import { isMainThread, parentPort, workerData } from 'node:worker_threads'

if (isMainThread) {
  // Запускаем себя как воркер
  const worker = new Worker(new URL(import.meta.url), {
    workerData: { task: 'hash' }
  })
  worker.on('message', console.log)
} else {
  // Мы в воркере
  const result = heavyComputation(workerData)
  parentPort.postMessage(result)
}
```

### SharedArrayBuffer в Node.js

В Node.js SAB доступен без ограничений (нет COOP/COEP):

```js
// main.js
const sab = new SharedArrayBuffer(4)
const view = new Int32Array(sab)

const worker = new Worker('./worker.js')
worker.postMessage({ buffer: sab })

setTimeout(() => {
  console.log('Значение:', Atomics.load(view, 0)) // значение от воркера
}, 100)
```

```js
// worker.js
import { parentPort } from 'node:worker_threads'

parentPort.on('message', ({ buffer }) => {
  const view = new Int32Array(buffer)
  Atomics.add(view, 0, 1)
})
```

## child_process

Создаёт **отдельный процесс ОС**. Полная изоляция — свои память, PID, stdout/stderr.

### spawn

Запуск произвольной команды:

```js
import { spawn } from 'node:child_process'

const ls = spawn('ls', ['-la'])

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`Код завершения: ${code}`)
})
```

### fork

Специальный spawn для Node.js-скриптов с IPC-каналом:

```js
// main.js
import { fork } from 'node:child_process'

const child = fork('./child.js')

child.send({ type: 'compute', data: [1, 2, 3] })

child.on('message', (msg) => {
  console.log('Результат:', msg.result) // 6
})
```

```js
// child.js
process.on('message', (msg) => {
  if (msg.type === 'compute') {
    const result = msg.data.reduce((a, b) => a + b, 0)
    process.send({ result })
  }
})
```

### exec и execSync

Для простых команд, когда нужен весь вывод сразу:

```js
import { exec, execSync } from 'node:child_process'

// Асинхронно
exec('git log --oneline -5', (err, stdout) => {
  console.log(stdout)
})

// Синхронно (блокирует!)
const output = execSync('git rev-parse HEAD').toString().trim()
```

## cluster

Запускает N копий приложения на одном порту. Мастер-процесс распределяет входящие соединения между воркерами.

```js
import cluster from 'node:cluster'
import http from 'node:http'
import { availableParallelism } from 'node:os'

const numCPUs = availableParallelism()

if (cluster.isPrimary) {
  console.log(`Master ${process.pid}: запускаю ${numCPUs} воркеров`)

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker) => {
    console.log(`Воркер ${worker.process.pid} упал, запускаю замену`)
    cluster.fork()
  })
} else {
  http.createServer((req, res) => {
    res.end(`Ответ от воркера ${process.pid}\n`)
  }).listen(3000)
}
```

Cluster полезен для HTTP-серверов: один порт, N процессов, автоматическая балансировка.

## Сравнение

| Критерий | worker_threads | child_process (fork) | cluster |
|----------|---------------|---------------------|---------|
| Overhead запуска | Низкий (~5ms) | Высокий (~30-100ms) | Высокий |
| Общая память | Да (SAB) | Нет | Нет |
| Изоляция | Один процесс | Разные процессы | Разные процессы |
| Обмен данными | postMessage, SAB | IPC (JSON) | IPC (JSON) |
| Crash impact | Поток → весь процесс | Только дочерний процесс | Только один воркер |
| Лучший для | CPU-bound задачи | Запуск внешних программ | HTTP-серверы |

## Когда что выбрать

```
Нужно запустить внешнюю команду (ffmpeg, python)?
  → child_process.spawn

Нужно масштабировать HTTP-сервер на все ядра?
  → cluster (или PM2, который делает это за тебя)

Нужно параллельное вычисление внутри приложения?
  → worker_threads

Нужна общая память между потоками?
  → worker_threads + SharedArrayBuffer
```

## Итого

| Факт | Описание |
|------|----------|
| worker_threads | Потоки в одном процессе, лёгкие, поддерживают SAB |
| child_process | Отдельный процесс ОС, полная изоляция |
| fork | child_process для Node.js скриптов с IPC |
| cluster | N копий приложения на одном порту |
| workerData | Передача данных при создании worker_threads |
| Выбор | CPU-bound → worker_threads, внешние команды → child_process, HTTP → cluster |
