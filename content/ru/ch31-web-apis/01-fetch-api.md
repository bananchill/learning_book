import { Callout, DeepDive } from '@book/ui'

# Fetch API

## Базовый fetch

```javascript
// GET запрос
const response = await fetch('/api/users')
const users = await response.json()

// POST запрос
const newUser = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ name: 'Иван', email: 'ivan@example.com' })
}).then(r => r.json())
```

## Объект Response

```javascript
const response = await fetch('/api/users')

// Статус и заголовки
response.status         // 200, 404, 500...
response.ok             // true если status 200-299
response.statusText     // 'OK', 'Not Found'...
response.headers.get('Content-Type')  // 'application/json'

// Чтение тела (каждый метод можно вызвать только ОДИН раз!)
await response.json()   // JSON
await response.text()   // строка
await response.blob()   // Blob (файлы, изображения)
await response.formData() // FormData
await response.arrayBuffer() // бинарные данные
```

<Callout type="warning">
`fetch` НЕ выбрасывает исключение при HTTP ошибках (404, 500)! Он выбрасывает только при сетевых ошибках. Всегда проверяйте `response.ok`.
</Callout>

## Правильная обработка ошибок

```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)

    if (!response.ok) {
      // HTTP ошибка — создаём исключение вручную
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError') {
      // Сетевая ошибка (нет соединения, CORS и т.д.)
      throw new Error('Ошибка сети: ' + error.message)
    }
    throw error
  }
}
```

## AbortController — отмена и таймауты

```javascript
// Таймаут запроса
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Таймаут: запрос к ${url} превысил ${timeout}мс`)
    }
    throw error
  }
}

// Отмена предыдущего запроса при новом (поиск)
let searchController = null

async function search(query) {
  // Отменяем предыдущий запрос
  if (searchController) {
    searchController.abort()
  }

  searchController = new AbortController()

  try {
    const response = await fetch(`/api/search?q=${query}`, {
      signal: searchController.signal
    })
    return response.json()
  } catch (error) {
    if (error.name === 'AbortError') {
      return null  // Запрос был отменён — нормальная ситуация
    }
    throw error
  }
}
```

<DeepDive title="fetch и CORS">

CORS (Cross-Origin Resource Sharing) — механизм безопасности браузера. Для запросов к другому домену сервер должен вернуть заголовок `Access-Control-Allow-Origin`.

```javascript
// Preflight запрос — браузер автоматически отправляет OPTIONS
// перед POST/PUT/DELETE к другому домену

// Credentials (cookies, auth) — нужно явно указать
const response = await fetch('https://api.example.com/data', {
  credentials: 'include'  // или 'same-origin' (по умолчанию)
})
// Сервер должен вернуть: Access-Control-Allow-Credentials: true
```
</DeepDive>
