---
title: "Замыкания в реальном мире"
parent: "ch01-closures"
order: 4
---

import { Callout } from '@book/ui'

<Callout type="info">
Примеры в этой главе используют React, Express и Redux — внешние библиотеки. Знание этих библиотек не требуется, сосредоточьтесь на паттерне замыкания.
</Callout>

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

Мемоизация — это техника кэширования результатов вызова функции. Если функция уже вызывалась с данным аргументом, результат берётся из кэша вместо повторного вычисления. Замыкание здесь хранит объект `Map` как приватный кэш, недоступный снаружи:

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

Middleware — это функция-обёртка, которая получает конфигурацию при создании и возвращает обработчик запросов. Замыкание захватывает параметры (лимит запросов, временное окно) и внутреннее состояние (`Map` с историей обращений), создавая изолированный контекст для каждого middleware:

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

Debounce откладывает вызов функции до тех пор, пока не пройдёт определённое время без новых вызовов. Это полезно для обработки пользовательского ввода — например, поиска по мере набора текста. Замыкание хранит идентификатор таймера, позволяя сбрасывать предыдущий при каждом новом вызове:

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
