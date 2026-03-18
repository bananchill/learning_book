---
title: "Типы ошибок и кастомные классы"
---

import { Callout } from '@book/ui'

## Встроенные типы ошибок

JavaScript имеет несколько встроенных классов ошибок, каждый из которых сигнализирует об определённом типе проблемы. Знание этих типов важно для точной обработки — в `catch` можно проверить `instanceof` и реагировать по-разному на синтаксическую ошибку в JSON, обращение к несуществующей переменной или выход за пределы допустимого диапазона.

```js
// TypeError — неверный тип операции
null.property          // TypeError: Cannot read properties of null
undefined()            // TypeError: undefined is not a function
42 + Symbol()          // TypeError: Cannot convert Symbol to number

// RangeError — значение вне допустимого диапазона
new Array(-1)          // RangeError: Invalid array length
(1.23456789).toFixed(200) // RangeError: toFixed() digits argument must be...

// ReferenceError — обращение к несуществующей переменной
console.log(undeclared) // ReferenceError: undeclared is not defined

// SyntaxError — ошибка синтаксиса (чаще при парсинге)
JSON.parse('{bad json}') // SyntaxError: Unexpected token

// URIError — ошибка URI
decodeURIComponent('%') // URIError: URI malformed

// EvalError — ошибка eval (устаревший)
```

## Кастомные классы ошибок

Для приложений важно создавать **информативные ошибки** с дополнительными полями:

```js
class ValidationError extends Error {
  constructor(message, field) {
    super(message)         // вызываем Error(message)
    this.name = 'ValidationError'
    this.field = field     // дополнительное поле
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} с id=${id} не найден`)
    this.name = 'NotFoundError'
    this.resource = resource
    this.id = id
    this.statusCode = 404  // удобно для HTTP API
  }
}

// Использование
try {
  const user = findUser(123)
} catch (error) {
  if (error instanceof NotFoundError) {
    // Знаем, что это за ошибка и у неё есть statusCode
    res.status(error.statusCode).json({ message: error.message })
  } else {
    throw error // непредвиденная ошибка — пробрасываем
  }
}
```

<Callout type="info">
Важно установить `this.name = 'ValidationError'` вручную — иначе `error.name` будет `'Error'` из родительского класса. В некоторых проектах для корректного `instanceof` также нужно `Object.setPrototypeOf(this, ValidationError.prototype)` (при работе с TypeScript и target < ES6).
</Callout>

## Иерархия ошибок

Можно строить иерархии для группировки:

```js
// Базовый класс для всех ошибок приложения
class AppError extends Error {
  constructor(message, code) {
    super(message)
    this.name = this.constructor.name  // автоматически берёт имя класса
    this.code = code
  }
}

class DatabaseError extends AppError {
  constructor(message, query) {
    super(message, 'DB_ERROR')
    this.query = query
  }
}

class NetworkError extends AppError {
  constructor(message, url, status) {
    super(message, 'NETWORK_ERROR')
    this.url = url
    this.status = status
  }
}

// Проверка по иерархии
try {
  await loadData()
} catch (error) {
  if (error instanceof AppError) {
    // Все ошибки приложения — обработаем в UI
    showError(error.message)
  } else {
    // Системные ошибки — логируем и краш
    logger.fatal(error)
    throw error
  }
}
```

## Полезные свойства кастомных ошибок

```js
class HttpError extends Error {
  constructor(message, { status, url, method } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status       // HTTP статус код
    this.url = url             // URL запроса
    this.method = method       // GET, POST, etc
    this.isOperational = true  // флаг: ожидаемая ошибка (не баг)
  }

  get isClientError() { return this.status >= 400 && this.status < 500 }
  get isServerError() { return this.status >= 500 }
}
```
