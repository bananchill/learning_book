---
title: "Шпаргалка: Обработка ошибок"
---

## try/catch/finally

```js
try {
  riskyOperation()
} catch (error) {
  if (error instanceof TypeError) { /* ... */ }
  else throw error  // пробрасываем неизвестное
} finally {
  cleanup()  // выполняется всегда
}
```

## Типы ошибок

| Тип | Когда |
|-----|-------|
| `TypeError` | Неверный тип, null.prop |
| `RangeError` | Значение вне диапазона |
| `ReferenceError` | Неопределённая переменная |
| `SyntaxError` | JSON.parse(bad), eval |

## Кастомный класс ошибки

```js
class AppError extends Error {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name  // имя класса
    this.code = code
    this.isOperational = true
  }
}
```

## Async ошибки

```js
// async/await
try {
  const data = await fetch(url)
} catch (error) { /* */ }

// Promise chain
promise.catch(error => { /* */ })

// Глобальный обработчик
process.on('unhandledRejection', (reason) => { /* */ })
window.addEventListener('unhandledrejection', e => { /* */ })
```

## Result тип

```js
const ok = (value) => ({ ok: true, value })
const err = (error) => ({ ok: false, error })

function divide(a, b) {
  if (b === 0) return err(new Error('деление на ноль'))
  return ok(a / b)
}

const { ok: success, value, error } = divide(10, 2)
```

## withRetry

```js
async function withRetry(fn, attempts = 3, delay = 1000) {
  for (let i = 1; i <= attempts; i++) {
    try { return await fn() }
    catch (e) {
      if (i === attempts) throw e
      await new Promise(r => setTimeout(r, delay))
    }
  }
}
```
