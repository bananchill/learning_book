---
title: "Асинхронные ошибки"
---

import { Callout } from '@book/ui'

<Callout type="info">
Эта подглава требует знания Promise и async/await из [главы Асинхронность](/frontend/javascript/ch02-async).
</Callout>

## Ошибки в Promise

```js
// Promise reject — ошибка при создании
const p = new Promise((resolve, reject) => {
  reject(new Error('Что-то пошло не так'))
})

// Обработка через .catch()
p.catch(error => {
  console.error(error.message) // "Что-то пошло не так"
})

// Или через второй аргумент .then()
p.then(
  result => console.log(result),
  error => console.error(error)  // обработчик ошибки
)
```

<Callout type="warning">
Необработанный отказ промиса (unhandled promise rejection) в Node.js v15+ завершает процесс. В браузере — генерируется событие `unhandledrejection`. Всегда обрабатывай ошибки в промисах.
</Callout>

## Ошибки в async/await

С `async/await` синхронный и асинхронный код обрабатывается одинаково:

```js
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)

    if (!response.ok) {
      // fetch не выбрасывает ошибку при 4xx/5xx — нужно проверить вручную
      throw new Error(`HTTP ошибка! Статус: ${response.status}`)
    }

    const user = await response.json()
    return user
  } catch (error) {
    if (error instanceof TypeError) {
      // Сетевая ошибка — fetch не смог подключиться
      console.error('Сетевая ошибка:', error.message)
    } else {
      // HTTP ошибка или ошибка парсинга JSON
      console.error('Ошибка получения пользователя:', error.message)
    }
    throw error  // пробрасываем выше
  }
}
```

## Promise.all и ошибки

```js
// Promise.all — прерывается при первой ошибке
try {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ])
} catch (error) {
  // Одна ошибка — все результаты теряются
  console.error('Одна из задач провалилась:', error)
}

// Promise.allSettled — ждёт все, возвращает статусы
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
])

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Успех:', result.value)
  } else {
    console.error('Ошибка:', result.reason)
  }
})
```

## unhandledRejection

```js
// Глобальный обработчик — последний рубеж
process.on('unhandledRejection', (reason, promise) => {
  console.error('Необработанный Promise rejection:', reason)
  // В продакшне: логирование + graceful shutdown
})

// В браузере:
window.addEventListener('unhandledrejection', event => {
  console.error('Необработанный rejection:', event.reason)
  event.preventDefault() // подавить стандартную обработку
})
```

## Паттерн: обёртка для async функций

```js
// Утилита для избежания дублирования try/catch
function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(error => [error, null])
}

// Использование — деструктурируем [error, result]
async function loadData() {
  const [error, user] = await to(fetchUser(1))
  if (error) {
    console.error('Не удалось загрузить:', error.message)
    return
  }

  const [postsError, posts] = await to(fetchPosts(user.id))
  if (postsError) {
    console.error('Не удалось загрузить посты:', postsError.message)
    return
  }

  return { user, posts }
}
```
