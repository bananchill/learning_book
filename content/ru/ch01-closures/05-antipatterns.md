---
title: "Антипаттерны"
parent: "ch01-closures"
order: 5
---

## Замыкание вместо параметра

```js
// ❌ Скрытая зависимость от внешнего состояния
let currentUser = null

function greet() {
  console.log(`Привет, ${currentUser.name}`)
}
```

```js
// ✅ Явный параметр — чистая функция
function greet(user) {
  console.log(`Привет, ${user.name}`)
}
```

Если данные можно передать аргументом — передавай аргументом.

## Чрезмерная вложенность

```js
// ❌ 4 уровня — нечитаемо
function createApp(config) {
  return function createRouter(routes) {
    return function createMiddleware(middleware) {
      return function handleRequest(req) {
        middleware.forEach(m => m(req))
        return routes.find(r => r.path === req.path)?.handler(req)
      }
    }
  }
}
```

```js
// ✅ Объект вместо вложенности
function createApp(config) {
  const routes = []
  const middleware = []

  return {
    addRoute(path, handler) { routes.push({ path, handler }) },
    use(m) { middleware.push(m) },
    handle(req) {
      middleware.forEach(m => m(req))
      return routes.find(r => r.path === req.path)?.handler(req)
    },
  }
}
```

2 уровня — нормально. 3 — подумай. 4+ — рефактори.

## Замыкание над мутабельным состоянием в async

```js
// ❌ data может быть null к моменту вызова setTimeout
function loadAndProcess() {
  let data = null

  fetch('/api/data')
    .then(res => res.json())
    .then(json => { data = json })

  setTimeout(() => {
    console.log(data.length) // data может быть null!
  }, 100)
}
```

```js
// ✅ async/await гарантирует порядок
async function loadAndProcess() {
  const data = await fetch('/api/data').then(res => res.json())
  console.log(data.length)
}
```

## Ненужное замыкание

```js
// ❌ Замыкание ничего не захватывает — бессмысленная обёртка
function createFormatter() {
  return function format(date) {
    return date.toLocaleDateString('ru-RU')
  }
}
```

```js
// ✅ Просто функция
function formatDate(date) {
  return date.toLocaleDateString('ru-RU')
}
```

Если возвращаемая функция не использует переменные из внешнего окружения — замыкание не нужно.

## Захват DOM-элементов без очистки

```js
// ❌ Элемент удалён из DOM, но замыкание держит ссылку
function initTooltip(element) {
  const tooltip = document.createElement('div')
  document.body.appendChild(tooltip)

  element.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block'
  })
  // element удалён → обработчик и tooltip утекли
}
```

```js
// ✅ Функция очистки
function initTooltip(element) {
  const tooltip = document.createElement('div')
  document.body.appendChild(tooltip)

  const show = () => { tooltip.style.display = 'block' }
  const hide = () => { tooltip.style.display = 'none' }

  element.addEventListener('mouseenter', show)
  element.addEventListener('mouseleave', hide)

  return function destroy() {
    element.removeEventListener('mouseenter', show)
    element.removeEventListener('mouseleave', hide)
    tooltip.remove()
  }
}
```

## Замыкание vs класс

| Критерий | Замыкание | Класс |
|----------|-----------|-------|
| Простой случай (1-3 метода) | Проще | Избыточно |
| Много методов (5+) | Неудобно | Удобнее |
| Наследование | Нет | `extends` |
| Приватность | По умолчанию | `#private` (ES2022) |
| Тестируемость | Сложнее мокать | Проще через DI |

## Правила

1. Замыкание — для фабрик, мемоизации, debounce/throttle
2. Класс — для сущностей с состоянием и множеством методов
3. Не замыкай то, что можно передать параметром
4. Не больше 2 уровней вложенности
5. Всегда думай об очистке — если замыкание живёт долго, убедись, что оно не держит лишнее
