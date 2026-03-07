---
title: "Замыкания в реальном мире"
parent: "ch01-closures"
order: 4
---

## Паттерн «Модуль»

До ES Modules замыкания были единственным способом создать модуль с приватным состоянием:

```js
const Logger = (function () {
  const logs = [] // приватное хранилище

  return {
    log(message) {
      logs.push({ message, timestamp: Date.now() })
      console.log(message)
    },
    getHistory() {
      return [...logs] // возвращаем копию
    },
    clear() {
      logs.length = 0
    },
  }
})()

Logger.log('Запуск')
Logger.log('Готово')
Logger.getHistory() // [{ message: 'Запуск', ... }, { message: 'Готово', ... }]
// Logger.logs — undefined, массив приватен
```

IIFE создаёт окружение с `logs`, а возвращённый объект — замыкание над ним.

## Фабрики функций

```js
// Валидаторы через замыкания
function createValidator(minLength, maxLength) {
  return (value) => {
    if (value.length < minLength) return `Минимум ${minLength} символов`
    if (value.length > maxLength) return `Максимум ${maxLength} символов`
    return null
  }
}

const validateUsername = createValidator(3, 20)
const validatePassword = createValidator(8, 128)

validateUsername('ab')      // "Минимум 3 символов"
validatePassword('short')  // "Минимум 8 символов"
validatePassword('good-password') // null
```

## Мемоизация

```js
function memoize(fn) {
  const cache = new Map() // кэш в замыкании

  return function (arg) {
    if (cache.has(arg)) {
      console.log('Из кэша')
      return cache.get(arg)
    }
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})

fibonacci(40) // Вычисляет один раз
fibonacci(40) // "Из кэша"
```

## Каррирование и частичное применение

```js
// Каррирование — превращаем f(a, b, c) в f(a)(b)(c)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args)
    }
    // Возвращаем новое замыкание, которое собирает оставшиеся аргументы
    return (...more) => curried(...args, ...more)
  }
}

const add = curry((a, b, c) => a + b + c)
add(1)(2)(3)    // 6
add(1, 2)(3)    // 6
add(1)(2, 3)    // 6
```

## React Hooks

React hooks — это замыкания. Каждый рендер создаёт новое замыкание со своими значениями:

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    // handleClick — замыкание, захватывает count текущего рендера
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Счёт: {count}</button>
}
```

`useState` внутри — это тоже замыкание! Упрощённая реализация:

```js
// Упрощённый useState
function createUseState() {
  let state // состояние в замыкании

  return function useState(initialValue) {
    if (state === undefined) state = initialValue

    function setState(newValue) {
      state = newValue
      // trigger re-render...
    }

    return [state, setState]
  }
}
```

## Middleware в Express / Redux

```js
// Express middleware — замыкание над config
function rateLimiter(maxRequests, windowMs) {
  const requests = new Map()

  return (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowStart = now - windowMs

    // requests, maxRequests, windowMs — из замыкания
    const timestamps = requests.get(ip)?.filter((t) => t > windowStart) ?? []

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({ error: 'Слишком много запросов' })
    }

    timestamps.push(now)
    requests.set(ip, timestamps)
    next()
  }
}

// app.use(rateLimiter(100, 60_000))
```

## Lodash debounce / throttle

```js
// Упрощённый debounce — таймер в замыкании
function debounce(fn, delay) {
  let timer // приватный таймер

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

const handleSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`)
}, 300)
```

## Итого

| Паттерн | Что в замыкании | Зачем |
|---------|-----------------|-------|
| Модуль | Приватное состояние | Инкапсуляция без классов |
| Фабрика | Параметры конфигурации | Создание специализированных функций |
| Мемоизация | Кэш результатов | Оптимизация дорогих вычислений |
| Каррирование | Накопленные аргументы | Частичное применение |
| React Hooks | Состояние компонента | Реактивный UI |
| Middleware | Конфигурация + состояние | Цепочка обработчиков |
| Debounce/Throttle | Таймер | Ограничение частоты вызовов |
