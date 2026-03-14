---
title: "Паттерны обработки ошибок"
---

import { Callout } from '@book/ui'

## Result тип (явные ошибки)

Паттерн Result/Either — альтернатива исключениям. Функция возвращает объект с флагом успеха/ошибки вместо того, чтобы бросать исключение.

```js
// Результат успеха
function ok(value) {
  return { ok: true, value }
}

// Результат ошибки
function err(error) {
  return { ok: false, error }
}

// Использование
function divide(a, b) {
  if (b === 0) return err(new Error('Деление на ноль'))
  return ok(a / b)
}

const result = divide(10, 2)
if (result.ok) {
  console.log('Результат:', result.value) // 5
} else {
  console.error('Ошибка:', result.error.message)
}
```

<Callout type="info">
Result тип хорошо работает для ожидаемых ошибок (validation, not found, parse errors). Для неожиданных ошибок (баги, сетевые сбои) всё равно используй исключения.
</Callout>

## Паттерн withRetry

```js
async function withRetry(fn, maxAttempts = 3, delayMs = 1000) {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        console.warn(`Попытка ${attempt} из ${maxAttempts} провалилась. Повтор через ${delayMs}мс`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError  // все попытки исчерпаны
}

// Использование
const data = await withRetry(
  () => fetch('/api/data').then(r => r.json()),
  3,    // 3 попытки
  500   // 500мс между попытками
)
```

## Railway Oriented Programming

Концепция: функции «едут по рельсам» — если на любом шагу ошибка, результат скатывается на «рельс ошибок» и пропускает все следующие шаги.

```js
class Result {
  constructor(ok, value, error) {
    this.ok = ok
    this.value = value
    this.error = error
  }

  static success(value) { return new Result(true, value, null) }
  static failure(error) { return new Result(false, null, error) }

  // Применить функцию только если успех
  map(fn) {
    if (!this.ok) return this  // ошибка — пропускаем
    try {
      return Result.success(fn(this.value))
    } catch (e) {
      return Result.failure(e)
    }
  }

  // Применить async-функцию
  async flatMap(fn) {
    if (!this.ok) return this
    try {
      const result = await fn(this.value)
      return result instanceof Result ? result : Result.success(result)
    } catch (e) {
      return Result.failure(e)
    }
  }
}

// Использование в пайплайне
const result = await Result.success({ id: 1, json: '{"name":"Алиса"}' })
  .map(data => ({ ...data, parsed: JSON.parse(data.json) }))
  .map(data => ({ ...data, name: data.parsed.name.toUpperCase() }))

if (result.ok) {
  console.log(result.value.name) // "АЛИСА"
} else {
  console.error('Ошибка в пайплайне:', result.error)
}
```

## Централизованная обработка

```js
// Обработчик ошибок для всего приложения
class ErrorHandler {
  handle(error) {
    if (error.isOperational) {
      // Ожидаемая ошибка — показываем пользователю
      this.sendToUI(error.message)
    } else {
      // Неожиданная ошибка — логируем и уведомляем разработчиков
      this.logCritical(error)
      this.notifyDeveloper(error)
    }
  }

  sendToUI(message) {
    // toast.error(message)
  }

  logCritical(error) {
    console.error('[CRITICAL]', error)
    // Sentry.captureException(error)
  }

  notifyDeveloper(error) {
    // slack.notify(error.stack)
  }
}
```

## Советы по обработке ошибок

1. **Бросай ошибки рано** — не жди последнего момента
2. **Перехватывай поздно** — обрабатывай там, где знаешь как
3. **Не глотай ошибки** — всегда хотя бы логируй
4. **Различай ожидаемые и неожиданные** — разная стратегия
5. **Используй кастомные классы** — они информативнее
6. **Всегда обрабатывай Promise rejection** — в продакшне может упасть процесс
