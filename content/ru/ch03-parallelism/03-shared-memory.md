---
title: "SharedArrayBuffer и Atomics"
parent: "ch03-parallelism"
order: 3
---

## Зачем общая память

postMessage копирует данные. Для большого массива чисел (миллионы элементов) это дорого — и по времени, и по памяти. `SharedArrayBuffer` (SAB) позволяет **нескольким потокам читать и писать одну область памяти** без копирования.

```js
// Main thread
const sab = new SharedArrayBuffer(1024) // 1 KB общей памяти
const view = new Int32Array(sab)        // типизированный доступ

worker.postMessage({ buffer: sab })     // SAB НЕ копируется — это та же память
view[0] = 42

// Worker thread
self.onmessage = (e) => {
  const view = new Int32Array(e.data.buffer)
  console.log(view[0]) // 42 — та же память
}
```

Два потока, один буфер. Изменения видны обоим.

## Data Race

Общая память = гонки данных. Два потока могут одновременно читать и писать одну ячейку:

```js
// ❌ Data race: результат непредсказуем
// Main thread         // Worker
view[0] = 0
                       // view[0]++ (read 0, add 1, write 1)
view[0]++              // (read 0, add 1, write 1) ← потеряли инкремент воркера
// Ожидали: 2, получили: 1
```

Операция `view[0]++` — это три шага: чтение, сложение, запись. Если два потока выполняют их одновременно, один результат перезаписывает другой. Это **гонка данных** (data race).

## Atomics

`Atomics` — встроенный объект с **атомарными операциями**: гарантированно неделимые чтение-модификация-запись.

### Базовые операции

```js
const sab = new SharedArrayBuffer(4)
const view = new Int32Array(sab) // один Int32 элемент

// Атомарная запись и чтение
Atomics.store(view, 0, 42)        // view[0] = 42 (атомарно)
Atomics.load(view, 0)             // 42 (атомарно)

// Атомарный инкремент
Atomics.add(view, 0, 1)           // view[0] += 1 (атомарно), возвращает старое значение
Atomics.sub(view, 0, 1)           // view[0] -= 1 (атомарно)

// Битовые операции
Atomics.and(view, 0, 0xFF)        // view[0] &= 0xFF
Atomics.or(view, 0, 0x01)         // view[0] |= 0x01
Atomics.xor(view, 0, 0x01)        // view[0] ^= 0x01

// Обмен
Atomics.exchange(view, 0, 100)    // view[0] = 100, возвращает старое значение
```

### Compare-and-Exchange (CAS)

Самая мощная атомарная операция — основа lock-free алгоритмов:

```js
// Записать newValue, только если текущее значение === expected
const old = Atomics.compareExchange(view, 0, expected, newValue)
// old === expected → запись произошла
// old !== expected → ничего не произошло, кто-то изменил значение раньше
```

CAS-цикл — типичный паттерн:

```js
function atomicIncrement(view, index) {
  let old
  do {
    old = Atomics.load(view, index)
  } while (Atomics.compareExchange(view, index, old, old + 1) !== old)
  return old + 1
}
```

### Безопасный инкремент

```js
// ❌ Гонка данных
view[0]++ // read → modify → write (3 шага, не атомарно)

// ✅ Атомарно
Atomics.add(view, 0, 1) // один неделимый шаг
```

## Wait и Notify

Механизм ожидания и уведомления — аналог condition variable:

```js
// Worker (ждёт)
const result = Atomics.wait(view, 0, 0)
// Поток спит, пока view[0] === 0
// result: 'ok' (разбудили), 'not-equal' (значение уже не 0), 'timed-out'

// Main thread (будит)
Atomics.store(view, 0, 1)
Atomics.notify(view, 0, 1) // разбудить 1 ждущий поток
// Atomics.notify(view, 0, Infinity) — разбудить всех
```

> **Важно:** `Atomics.wait()` **блокирует поток**. В main thread браузера его вызывать **нельзя** — выбросит ошибку. Только в воркерах. В Node.js — можно где угодно.

### Пример: producer-consumer

```js
// Общая память
const sab = new SharedArrayBuffer(8) // 2 × Int32
const flag = new Int32Array(sab, 0, 1)   // flag[0]: 0 = пусто, 1 = готово
const data = new Int32Array(sab, 4, 1)   // data[0]: значение

// Consumer (worker) — ждёт данные
while (true) {
  Atomics.wait(flag, 0, 0) // спим, пока flag === 0
  const value = Atomics.load(data, 0)
  console.log('Получил:', value)
  Atomics.store(flag, 0, 0) // сброс флага
}

// Producer (main) — отправляет данные
Atomics.store(data, 0, 42)
Atomics.store(flag, 0, 1)  // помечаем: данные готовы
Atomics.notify(flag, 0, 1) // будим consumer
```

## COOP/COEP: заголовки безопасности

После уязвимости **Spectre** (2018) браузеры отключили `SharedArrayBuffer` по умолчанию. Чтобы его использовать, сервер должен отправлять заголовки:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

```js
// Проверка в коде
if (typeof SharedArrayBuffer !== 'undefined') {
  // SAB доступен
} else {
  // Нужны COOP/COEP заголовки
}
```

<details>
<summary><strong>DeepDive: Spectre и почему это важно</strong></summary>

Spectre — атака по побочному каналу (side-channel), позволяющая через точные замеры времени читать память другого процесса. `SharedArrayBuffer` давал таймер высокого разрешения (через счётчик в отдельном потоке), что делало атаку практичной.

COOP/COEP создают изолированный контекст (cross-origin isolated), гарантирующий, что в процесс не загрузятся ресурсы из других origins. Это делает Spectre-атаки через SharedArrayBuffer бесполезными.

```js
// Проверка cross-origin isolation
self.crossOriginIsolated // true → SAB доступен
```

</details>

## Когда использовать SAB

| Сценарий | postMessage | SharedArrayBuffer |
|----------|------------|-------------------|
| Передать объект | ✅ Structured clone | ❌ Только числа |
| Большой числовой массив | ❌ Копирование | ✅ Без копирования |
| Несколько воркеров, общие данные | ❌ N копий | ✅ Одна копия |
| Синхронизация потоков | ❌ Нет механизма | ✅ Atomics.wait/notify |
| Высокая частота обновлений | ❌ Дорогой clone | ✅ Прямой доступ |

**Правило:** если работаешь с числовыми данными и нужна скорость — SAB. Для всего остального — postMessage.

## Итого

| Факт | Описание |
|------|----------|
| SharedArrayBuffer | Общая память между потоками, без копирования |
| Data race | Одновременная запись без синхронизации → непредсказуемый результат |
| Atomics | Неделимые операции: add, store, load, compareExchange |
| CAS | Compare-and-exchange — основа lock-free алгоритмов |
| wait/notify | Блокирующее ожидание + уведомление (только в воркерах) |
| COOP/COEP | Обязательные заголовки для SAB в браузере (из-за Spectre) |
