---
title: "Event Loop: как JavaScript управляет асинхронностью"
parent: "ch02-async"
order: 2
---

## Архитектура JS-рантайма

Чтобы понять event loop, нужно знать из каких частей состоит среда выполнения JavaScript. Вот три ключевые структуры:

**Call Stack** — стек вызовов. Функции добавляются при вызове, удаляются при завершении. JavaScript выполняет только то, что на вершине стека.

**Web API / Node API** — среда выполнения предоставляет асинхронные возможности: `setTimeout`, `fetch`, `fs.readFile`. Это **не часть** движка V8 — это API браузера или Node.js.

**Очереди задач** — когда асинхронная операция завершается, её колбэк ставится в очередь. Event loop перемещает колбэки из очереди в call stack.

```js
console.log('1')              // → call stack → выполняется сразу

setTimeout(() => {
  console.log('2')            // → Web API → task queue → ... → call stack
}, 0)

console.log('3')              // → call stack → выполняется сразу

// Вывод: 1, 3, 2
```

Даже с задержкой 0 мс, `setTimeout` **никогда** не выполняется мгновенно — колбэк ставится в очередь и ждёт, пока стек опустеет.

## Алгоритм event loop

Упрощённый алгоритм по [спецификации HTML](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model):

1. **Взять одну задачу** из task queue (macrotask)
2. **Выполнить её** до конца (run-to-completion)
3. **Выполнить ВСЕ микрозадачи** из microtask queue
4. **Рендеринг** (если нужен — обновить UI)
5. Повторить с шага 1

Ключевое: между шагами 2 и 4 выполняются **все** микрозадачи — не одна, а все. Если микрозадача добавляет новую микрозадачу — она тоже выполнится до рендеринга.

## Macrotasks vs Microtasks

Это два типа очередей с разным приоритетом:

### Macrotasks (задачи)

- `setTimeout`, `setInterval`
- Обработка событий (click, input)
- `requestAnimationFrame`
- Парсинг HTML
- I/O колбэки (Node.js)

Выполняется **одна** задача за итерацию event loop.

### Microtasks (микрозадачи)

- `Promise.then()`, `.catch()`, `.finally()`
- `queueMicrotask()`
- `MutationObserver`
- `process.nextTick()` (Node.js)

Выполняются **все** микрозадачи после каждой макрозадачи.

> Микрозадачи имеют более высокий приоритет. Promise.then **всегда** выполнится раньше setTimeout, даже если setTimeout поставлен первым.

## Интерактивный симулятор

Попробуй сам — выбери пресет или напиши свой код. Симулятор покажет пошагово, как event loop обрабатывает каждую строку: что попадает в call stack, что в microtask queue, а что в macrotask queue.

<EventLoopSimulator />

## Классический пример порядка выполнения

```js
console.log('1') // синхронный

setTimeout(() => console.log('2'), 0) // macrotask

Promise.resolve().then(() => console.log('3')) // microtask

queueMicrotask(() => console.log('4')) // microtask

console.log('5') // синхронный
```

**Вывод:** `1, 5, 3, 4, 2`

**Разбор по шагам:**

1. `console.log('1')` — синхронно, выполняется сразу → **1**
2. `setTimeout` — колбэк ставится в task queue
3. `Promise.then` — колбэк ставится в microtask queue
4. `queueMicrotask` — колбэк ставится в microtask queue
5. `console.log('5')` — синхронно → **5**
6. Стек пуст → выполняем все микрозадачи → **3**, **4**
7. Выполняем следующую макрозадачу → **2**

## Вложенные микрозадачи

Микрозадачи, добавленные внутри микрозадачи, выполняются **в том же цикле**:

```js
Promise.resolve().then(() => {
  console.log('A')
  Promise.resolve().then(() => console.log('B'))
})

setTimeout(() => console.log('C'), 0)

// Вывод: A, B, C
// B выполняется до C, потому что это микрозадача,
// добавленная во время обработки микрозадач
```

## Опасность: микрозадачи могут заблокировать рендеринг

Поскольку все микрозадачи выполняются до рендеринга, рекурсивные микрозадачи могут заблокировать UI навсегда:

```js
// ❌ Бесконечный цикл — браузер зависнет
function freeze() {
  queueMicrotask(freeze)
}
freeze()
```

`setTimeout` в аналогичной ситуации не блокирует — между макрозадачами браузер может обновить UI.

## setTimeout: минимальная задержка

```js
setTimeout(() => console.log('привет'), 0)
```

Реальная задержка не 0 мс, а ~4 мс (для вложенных setTimeout глубже 5 уровней, по [спецификации HTML](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers)). `setTimeout(fn, 0)` — это «выполни как можно скорее, но после текущего кода и всех микрозадач».

## requestAnimationFrame

`requestAnimationFrame` выполняется перед рендерингом, на шаге 4 алгоритма. Это идеальное место для анимаций:

```js
function animate() {
  element.style.left = `${position++}px`
  requestAnimationFrame(animate) // следующий кадр
}
requestAnimationFrame(animate)
```

В отличие от `setTimeout`, rAF синхронизируется с частотой обновления экрана (~60fps).

<DeepDive>

В Node.js event loop основан на библиотеке [libuv](https://libuv.org/) и имеет 6 фаз вместо простой модели «macrotask → microtasks → render». Ключевые отличия: `setImmediate` выполняется после I/O (фаза check), а `process.nextTick` обрабатывается между фазами — даже раньше microtasks. Подробности — в [документации Node.js](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick).

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| Call stack | Стек выполняемых функций, LIFO |
| Macrotask | setTimeout, события, I/O — одна задача за цикл |
| Microtask | Promise.then, queueMicrotask — все за цикл |
| Приоритет | Синхронный код → все microtasks → одна macrotask |
| Рендеринг | Происходит после microtasks, между macrotasks |
| setTimeout(0) | Минимум ~4 мс, после всех microtasks |
