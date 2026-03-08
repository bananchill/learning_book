---
title: "Шпаргалка: Асинхронность"
parent: "ch02-async"
---

## Event Loop

```
Синхронный код → Все microtasks → Одна macrotask → Рендеринг → ...
```

- **Microtasks:** Promise.then, queueMicrotask, MutationObserver
- **Macrotasks:** setTimeout, setInterval, events, I/O

## Promise API

```js
// Все успешны или reject при первой ошибке
await Promise.all([p1, p2, p3])

// Ждёт всех, возвращает статусы
await Promise.allSettled([p1, p2, p3])

// Первый settled (любой)
await Promise.race([p1, p2, p3])

// Первый fulfilled
await Promise.any([p1, p2, p3])
```

## async/await

```js
// Одновременно
const [a, b] = await Promise.all([fetchA(), fetchB()])

// Последовательно (если b зависит от a)
const a = await fetchA()
const b = await fetchB(a.id)
```

## Обработка ошибок

```js
// try/catch
try {
  const data = await fetch(url)
} catch (err) {
  handleError(err)
}

// .catch() на вызове
loadData().catch(err => handleError(err))
```

## Частые ловушки

```js
// ❌ forEach + async — не ждёт
items.forEach(async (item) => await process(item))

// ✅ for...of или map + Promise.all
for (const item of items) await process(item)
await Promise.all(items.map(item => process(item)))

// ❌ Последовательный await для независимых операций
const a = await fetchA(); const b = await fetchB()

// ✅ Одновременно
const [a, b] = await Promise.all([fetchA(), fetchB()])

// ❌ Promise constructor antipattern
return new Promise(async (resolve) => { resolve(await fetch(url)) })

// ✅ Просто return
return fetch(url)
```

## Паттерны

```js
// Retry с backoff
async function retry(fn, n = 3, delay = 1000) {
  for (let i = 0; i < n; i++) {
    try { return await fn() }
    catch (e) { if (i === n-1) throw e; await new Promise(r => setTimeout(r, delay * 2**i)) }
  }
}

// Timeout
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('Timeout')), ms))])

// Debounce
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms) } }

// Throttle
const throttle = (fn, ms) => { let last = 0; return (...a) => { if (Date.now() - last >= ms) { last = Date.now(); fn(...a) } } }
```

## AbortController

```js
const ctrl = new AbortController()
fetch(url, { signal: ctrl.signal })
ctrl.abort() // отменяет fetch
```

## Чеклист

- [ ] Независимые операции запускаешь через `Promise.all`?
- [ ] Обрабатываешь ошибки (`try/catch` или `.catch()`)?
- [ ] Не используешь `forEach` с `async`?
- [ ] Отменяешь запросы в cleanup (AbortController)?
- [ ] Не оборачиваешь промисы в `new Promise`?
- [ ] Не блокируешь event loop тяжёлыми вычислениями?
