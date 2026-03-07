---
title: "Антипаттерны и как их избежать"
parent: "ch01-closures"
order: 5
---

## Антипаттерн 1: Замыкание вместо параметра

```js
// ❌ Скрытая зависимость
let currentUser = null

function greet() {
  console.log(`Привет, ${currentUser.name}`)
}

currentUser = { name: 'Алекс' }
greet() // работает, но функция зависит от внешнего состояния
```

```js
// ✅ Явный параметр
function greet(user) {
  console.log(`Привет, ${user.name}`)
}

greet({ name: 'Алекс' }) // чистая функция, без скрытых зависимостей
```

**Правило:** если данные можно передать как аргумент — передавай как аргумент. Замыкание не должно заменять параметры.

## Антипаттерн 2: Чрезмерная вложенность

```js
// ❌ 4 уровня вложенности — нечитаемо
function createApp(config) {
  return function createRouter(routes) {
    return function createMiddleware(middleware) {
      return function handleRequest(req) {
        // config, routes, middleware, req — всё в замыкании
        middleware.forEach((m) => m(req))
        const route = routes.find((r) => r.path === req.path)
        return route?.handler(req) ?? config.notFound
      }
    }
  }
}
```

```js
// ✅ Объект или класс
function createApp(config) {
  const routes = []
  const middleware = []

  return {
    addRoute(path, handler) { routes.push({ path, handler }) },
    use(m) { middleware.push(m) },
    handle(req) {
      middleware.forEach((m) => m(req))
      const route = routes.find((r) => r.path === req.path)
      return route?.handler(req) ?? config.notFound
    },
  }
}
```

**Правило:** 2 уровня замыканий — нормально. 3 — подумай. 4+ — рефактори.

## Антипаттерн 3: Замыкание над мутабельным состоянием в async

```js
// ❌ Stale closure — data может измениться между вызовами
function loadAndProcess() {
  let data = null

  fetch('/api/data')
    .then((res) => res.json())
    .then((json) => {
      data = json
    })

  // Этот коллбэк замкнулся на data
  setTimeout(() => {
    console.log(data.length) // data может быть null!
  }, 100)
}
```

```js
// ✅ Используй цепочку промисов или async/await
async function loadAndProcess() {
  const data = await fetch('/api/data').then((res) => res.json())
  console.log(data.length) // data точно загружена
}
```

## Антипаттерн 4: Ненужное замыкание

```js
// ❌ Замыкание не нужно — функция ничего не захватывает
function createFormatter() {
  return function format(date) {
    return date.toLocaleDateString('ru-RU')
  }
}

const formatter = createFormatter()
formatter(new Date())
```

```js
// ✅ Просто функция
function formatDate(date) {
  return date.toLocaleDateString('ru-RU')
}

formatDate(new Date())
```

**Правило:** если возвращаемая функция не использует переменные из внешнего окружения — замыкание не нужно.

## Антипаттерн 5: Захват DOM-элементов

```js
// ❌ Элемент удалён из DOM, но замыкание держит ссылку → утечка
function initTooltip(element) {
  const tooltip = document.createElement('div')
  document.body.appendChild(tooltip)

  element.addEventListener('mouseenter', () => {
    tooltip.style.display = 'block' // замыкание держит tooltip
  })

  // Если element удалён из DOM — обработчик и tooltip остаются в памяти
}
```

```js
// ✅ Возвращай функцию очистки
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

## Замыкание vs класс: когда что

| Критерий | Замыкание | Класс |
|----------|-----------|-------|
| Простой случай (1-3 метода) | ✅ Проще, меньше кода | Избыточно |
| Много методов (5+) | Неудобно | ✅ Удобнее организовать |
| Наследование | Невозможно | ✅ `extends` |
| Настоящая приватность | ✅ По умолчанию | `#private` (ES2022) |
| Производительность | ≈ одинаково | ≈ одинаково |
| Тестируемость | Сложнее мокать | ✅ Проще через DI |

## Правила большого пальца

1. **Используй замыкание** для фабрик, каррирования, мемоизации, debounce/throttle
2. **Используй класс** для сущностей с состоянием и множеством методов
3. **Не замыкай то, что можно передать параметром**
4. **Не вкладывай больше 2 уровней**
5. **Всегда думай об очистке** — если замыкание живёт долго, убедись, что оно не держит лишнее
