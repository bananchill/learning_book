---
title: "Шпаргалка: Каррирование"
parent: "ch05-currying"
---

## Определение

**Каррирование** = трансформация `f(a, b, c)` в `f(a)(b)(c)`. Не вызывает, а перестраивает.

## Универсальный curry

```js
function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...more) => curried(...args.concat(more))
  }
}
```

## Каррирование vs частичное применение

```js
// Каррирование — трансформация структуры
const add = a => b => a + b          // f(a, b) → f(a)(b)

// Частичное применение — фиксация аргументов
const add5 = add.bind(null, 5)       // f(a, b) → g(b) где a = 5
```

| | Каррирование | Частичное применение |
|---|---|---|
| Что делает | Трансформирует | Фиксирует аргументы |
| Результат | Цепочка унарных функций | Функция с меньшим числом аргументов |
| Требует | Фиксированное число параметров | Любую функцию |

## compose и pipe

```js
// Справа налево: f(g(h(x)))
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)

// Слева направо: h(g(f(x)))
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
```

## partial

```js
const partial = (fn, ...fixed) => (...rest) => fn(...fixed, ...rest)
```

## Когда использовать

- Создание специализированных функций из общих
- Построение пайплайнов с `pipe`/`compose`
- Middleware: `store => next => action`
- HOC: `config => Component => EnhancedComponent`
- Каррированные валидаторы, логгеры, обработчики

## Когда НЕ использовать

- Rest-параметры, defaults, arguments (`fn.length` врёт)
- Больше 3 уровней вложенности
- Объект конфигурации вместо позиционных аргументов
- Команда не знает ФП
- TypeScript без опыта работы с рекурсивными типами

## Частые ошибки

```js
// ❌ Каррирование функции с rest-параметрами
const sum = curry((...nums) => nums.reduce((a, b) => a + b))
// fn.length === 0 → вызовется сразу без аргументов

// ❌ Потеря this
const method = curry(obj.method)
method(1)(2) // this === undefined

// ✅ Привязать this
const method = curry(obj.method.bind(obj))

// ❌ Слишком длинная цепочка
request(host)(port)(proto)(path)(headers)(body)(timeout)

// ✅ Объект конфигурации
request({ host, port, proto, path, headers, body, timeout })
```

## Реальный мир

```js
// Redux middleware
const logger = store => next => action => {
  console.log(action.type)
  return next(action)
}

// Express middleware
const rateLimit = (max) => (windowMs) => (req, res, next) => { /* ... */ }

// Lodash
const add = _.curry((a, b, c) => a + b + c)

// Ramda — все функции каррированы, data-last
R.pipe(R.map(R.prop('name')), R.take(3), R.join(', '))
```

## Чеклист

- [ ] `fn.length` отражает реальное число аргументов?
- [ ] Не больше 3 уровней вложенности?
- [ ] Каждый уровень семантически оправдан?
- [ ] Команда понимает паттерн?
- [ ] TypeScript-типы не превращают код в нечитаемый?
- [ ] Не используется в hot path на миллионах итераций?
