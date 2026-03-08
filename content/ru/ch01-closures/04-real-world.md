---
title: "Замыкания в реальном мире"
parent: "ch01-closures"
order: 4
---

## Паттерн «Модуль»

До ES Modules замыкания были единственным способом создать модуль с приватным состоянием:

```js
const Logger = (function () {
  const logs = []

  return {
    log(message) {
      logs.push({ message, timestamp: Date.now() })
      console.log(message)
    },
    getHistory() {
      return [...logs]
    },
    clear() {
      logs.length = 0
    },
  }
})()

Logger.log('Запуск')
Logger.getHistory() // [{ message: 'Запуск', ... }]
// Logger.logs — undefined
```

## Фабрики функций

```js
function createValidator(minLength, maxLength) {
  return (value) => {
    if (value.length < minLength) return `Минимум ${minLength} символов`
    if (value.length > maxLength) return `Максимум ${maxLength} символов`
    return null
  }
}

const validateUsername = createValidator(3, 20)
const validatePassword = createValidator(8, 128)

validateUsername('ab')       // "Минимум 3 символов"
validatePassword('short')   // "Минимум 8 символов"
```

## Мемоизация

```js
function memoize(fn) {
  const cache = new Map()

  return function (arg) {
    if (cache.has(arg)) return cache.get(arg)
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

const fibonacci = memoize(function fib(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})

fibonacci(40) // вычисляет
fibonacci(40) // из кэша
```

## Каррирование

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

const add = curry((a, b, c) => a + b + c)
add(1)(2)(3)  // 6
add(1, 2)(3)  // 6
```

## React Hooks

Каждый рендер создаёт новое замыкание с текущим состоянием:

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // handleClick — замыкание, захватывает count текущего рендера
  function handleClick() {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Счёт: {count}</button>
}
```

Упрощённая реализация `useState` — тоже замыкание:

```js
function createUseState() {
  let state

  return function useState(initialValue) {
    if (state === undefined) state = initialValue
    function setState(newValue) {
      state = newValue
      // trigger re-render
    }
    return [state, setState]
  }
}
```

## Middleware (Express / Redux)

```js
function rateLimiter(maxRequests, windowMs) {
  const requests = new Map()

  return (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const timestamps = requests.get(ip)?.filter(t => t > now - windowMs) ?? []

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

## Debounce / Throttle

```js
function debounce(fn, delay) {
  let timer

  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

const handleSearch = debounce(query => {
  fetch(`/api/search?q=${query}`)
}, 300)
```

## Итого

| Паттерн | Что в замыкании | Зачем |
|---------|-----------------|-------|
| Модуль | Приватное состояние | Инкапсуляция без классов |
| Фабрика | Параметры конфигурации | Специализированные функции |
| Мемоизация | Кэш результатов | Оптимизация вычислений |
| Каррирование | Накопленные аргументы | Частичное применение |
| React Hooks | Состояние компонента | Реактивный UI |
| Middleware | Конфиг + состояние | Цепочка обработчиков |
| Debounce | Таймер | Ограничение частоты вызовов |
