---
title: "Promises: от callback hell к цепочкам"
parent: "ch02-async"
order: 3
---

## Проблема: callback hell

До промисов асинхронный код строился на колбэках. При нескольких последовательных операциях код превращался в «пирамиду смерти»:

```js
// ❌ Callback hell
getUser(userId, function(err, user) {
  if (err) return handleError(err)
  getPosts(user.id, function(err, posts) {
    if (err) return handleError(err)
    getComments(posts[0].id, function(err, comments) {
      if (err) return handleError(err)
      render(user, posts, comments)
    })
  })
})
```

Проблемы: глубокая вложенность, дублирование обработки ошибок, невозможность использовать `try/catch`.

## Что такое Promise

**Promise** — объект, представляющий результат асинхронной операции, который может быть доступен сейчас, позже или никогда.

Три состояния:
- **pending** — ожидание (начальное)
- **fulfilled** — успешно завершён (есть значение)
- **rejected** — завершён с ошибкой (есть причина)

```js
const promise = new Promise((resolve, reject) => {
  // Асинхронная операция
  setTimeout(() => {
    resolve('Готово!') // → fulfilled, значение: 'Готово!'
    // или: reject(new Error('Упс')) // → rejected
  }, 1000)
})
```

> Состояние промиса необратимо: из `pending` он переходит в `fulfilled` или `rejected` **один раз**. Повторные вызовы `resolve`/`reject` игнорируются.

## Цепочки: .then(), .catch(), .finally()

Каждый `.then()` возвращает **новый** промис, позволяя строить плоские цепочки:

```js
fetch('/api/users/1')
  .then(response => response.json())    // → новый промис с JSON
  .then(user => fetch(`/api/posts?userId=${user.id}`))
  .then(response => response.json())    // → новый промис с постами
  .then(posts => renderPosts(posts))
  .catch(err => showError(err))          // ловит ошибку из любого шага
  .finally(() => hideSpinner())          // выполняется всегда
```

**Критически важно:** всегда возвращай значение из `.then()`. Без `return` следующий `.then()` получит `undefined`:

```js
// ❌ Забыли return — floating promise
fetch(url).then(r => {
  r.json() // промис создан, но не возвращён
})

// ✅ Правильно
fetch(url).then(r => r.json())
```

## Обработка ошибок

`.catch()` ловит ошибки из **любого** предыдущего `.then()`:

```js
Promise.resolve(1)
  .then(v => { throw new Error('Бум!') })
  .then(v => console.log('Не выполнится'))
  .catch(err => {
    console.log(err.message) // 'Бум!'
    return 'Восстановились'  // цепочка продолжается!
  })
  .then(v => console.log(v)) // 'Восстановились'
```

После `.catch()` цепочка продолжается — это позволяет реализовать паттерн восстановления.

### Unhandled rejection

Если промис отклонён и нигде нет `.catch()`, возникает событие `unhandledrejection`:

```js
// ❌ Нет обработки — unhandled rejection
async function loadData() {
  const data = await fetch('/broken-url') // упадёт
}
loadData() // Кто ловит ошибку? Никто!

// ✅ Всегда обрабатывай ошибки
loadData().catch(err => console.error(err))
```

## Promise API: статические методы

### Promise.all — все или ничего

Ждёт выполнения **всех** промисов. Если хотя бы один отклоняется — весь `Promise.all` отклоняется:

```js
const [user, posts, config] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/config').then(r => r.json()),
])
// Все три запроса идут параллельно, результат — когда все готовы
```

### Promise.allSettled — подождать всех

Ждёт **все** промисы, не прерываясь при ошибках. Возвращает массив объектов с `status`:

```js
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/broken'),  // упадёт
  fetch('/api/posts'),
])

results.forEach(r => {
  if (r.status === 'fulfilled') console.log('OK:', r.value)
  if (r.status === 'rejected') console.log('Error:', r.reason)
})
```

### Promise.race — первый финиширует

Возвращает результат **первого** settled промиса (fulfilled или rejected):

```js
// Таймаут для fetch
const result = await Promise.race([
  fetch('/api/data'),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
])
```

### Promise.any — первый успешный

Возвращает результат **первого fulfilled** промиса. Отклоняется только если **все** отклонены (AggregateError):

```js
// Пробуем несколько зеркал, берём первый ответивший
const data = await Promise.any([
  fetch('https://mirror1.example.com/data'),
  fetch('https://mirror2.example.com/data'),
  fetch('https://mirror3.example.com/data'),
])
```

### Сравнительная таблица

| Метод | Ждёт | Реджектит при |
|-------|------|---------------|
| `Promise.all` | Все fulfilled | Первом reject |
| `Promise.allSettled` | Все settled | Никогда |
| `Promise.race` | Первый settled | Если первый — reject |
| `Promise.any` | Первый fulfilled | Все rejected |

## Антипаттерн: Promise constructor

Не оборачивай промисы в `new Promise` — это избыточно и может проглатывать ошибки:

```js
// ❌ Promise constructor antipattern
function getData(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(r => r.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

// ✅ fetch уже возвращает Promise
function getData(url) {
  return fetch(url).then(r => r.json())
}
```

`new Promise` нужен только для оборачивания callback-based API (например, `setTimeout`, `fs.readFile` без промис-версии).

## Колбэки .then() — всегда асинхронны

Даже для уже resolved промиса, `.then()` выполняется **асинхронно** (как микрозадача):

```js
console.log('1')
Promise.resolve('2').then(v => console.log(v))
console.log('3')

// Вывод: 1, 3, 2 — .then() всегда откладывается
```

Это гарантирует предсказуемый порядок выполнения вне зависимости от того, resolved промис или нет.

## Итого

| Концепция | Описание |
|-----------|----------|
| Promise | Объект-обёртка для асинхронного результата |
| Состояния | pending → fulfilled / rejected (необратимо) |
| Цепочки | `.then()` возвращает новый промис |
| Ошибки | `.catch()` ловит ошибки из всей цепочки |
| all | Все успешны или reject при первой ошибке |
| allSettled | Ждёт всех, возвращает статусы |
| race | Первый settled (любой) |
| any | Первый fulfilled |
