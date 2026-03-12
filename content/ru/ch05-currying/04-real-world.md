---
title: "Каррирование в реальных проектах"
parent: "ch05-currying"
order: 4
---

## Lodash _.curry

Lodash реализует **overloaded** каррирование — поддерживает и `f(a)(b)`, и `f(a, b)`:

```js
import _ from 'lodash'

const add = _.curry((a, b, c) => a + b + c)

add(1)(2)(3)   // 6
add(1, 2)(3)   // 6
add(1)(2, 3)   // 6
add(1, 2, 3)   // 6
```

Lodash также поддерживает **плейсхолдеры** — можно зафиксировать аргументы не по порядку:

```js
const greet = _.curry((greeting, punctuation, name) => {
  return `${greeting}, ${name}${punctuation}`
})

// Фиксируем 1-й и 3-й аргумент, оставляем 2-й
const greetPolitely = greet('Здравствуйте', _.curry.placeholder)
greetPolitely('!', 'Иван')   // "Здравствуйте, Иван!"
greetPolitely('...', 'Мария') // "Здравствуйте, Мария..."
```

## Ramda — каррирование по умолчанию

В Ramda **все** функции автоматически каррированы. Данные передаются **последним аргументом** (data-last), что идеально для compose/pipe:

```js
import * as R from 'ramda'

// R.map каррирована: R.map(fn)(data)
const getNames = R.map(R.prop('name'))
const toUpper = R.map(R.toUpper)

const formatNames = R.pipe(
  getNames,
  toUpper,
  R.take(3),
  R.join(', ')
)

formatNames([
  { name: 'алекс' },
  { name: 'мария' },
  { name: 'иван' },
  { name: 'ольга' },
])
// "АЛЕКС, МАРИЯ, ИВАН"
```

Ключевое отличие от Lodash: Ramda ставит данные в конец (`R.map(fn, data)`), а Lodash — в начало (`_.map(data, fn)`). Data-last нужен для pointfree-стиля.

## Redux middleware

Паттерн middleware в Redux — каноническое каррирование:

```js
// store => next => action — три уровня каррирования
const logger = store => next => action => {
  console.log('Действие:', action.type)
  console.log('Состояние до:', store.getState())

  const result = next(action)

  console.log('Состояние после:', store.getState())
  return result
}
```

Зачем три уровня:
1. `store` — фиксируется при регистрации middleware через `applyMiddleware`
2. `next` — фиксируется при связывании middleware в цепочку
3. `action` — передаётся при каждом `dispatch`

Каждый уровень — замыкание, захватывающее свой аргумент. Это позволяет Redux собирать цепочку middleware до того, как придёт первый action.

## React Higher-Order Components

HOC в React — функция, принимающая компонент и возвращающая компонент. С каррированием — конфигурация отделяется от компонента:

```js
// connect из react-redux — каррированная функция
const enhance = connect(mapStateToProps, mapDispatchToProps)
const ConnectedComponent = enhance(MyComponent)

// Или в одну строку
export default connect(mapStateToProps)(MyComponent)
```

React.memo с кастомным сравнением — тоже каррирование:

```js
// Каррированный HOC для авторизации
const withAuth = requiredRole => Component => props => {
  const { user } = useAuth()
  if (user.role !== requiredRole) return <Redirect to="/login" />
  return <Component {...props} user={user} />
}

const AdminPage = withAuth('admin')(DashboardPage)
const EditorPage = withAuth('editor')(ContentPage)
```

## Express middleware

Каррирование в Express позволяет параметризовать middleware:

```js
// Каррированный middleware: сначала конфигурация, потом (req, res, next)
const rateLimit = (maxRequests) => (windowMs) => {
  const requests = new Map()

  return (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowStart = now - windowMs

    // Очистка старых записей
    const hits = (requests.get(ip) || []).filter(t => t > windowStart)
    hits.push(now)
    requests.set(ip, hits)

    if (hits.length > maxRequests) {
      return res.status(429).json({ error: 'Слишком много запросов' })
    }
    next()
  }
}

// Разные лимиты для разных маршрутов
app.use('/api', rateLimit(100)(60_000))        // 100 запросов в минуту
app.use('/auth', rateLimit(5)(60_000))          // 5 запросов в минуту
app.use('/upload', rateLimit(10)(3_600_000))    // 10 запросов в час
```

## Каррированные валидаторы

```js
// Правило → функция валидации
const validate = rules => data => {
  const errors = {}

  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = rule(data[field])
      if (error) {
        errors[field] = errors[field] || []
        errors[field].push(error)
      }
    }
  }

  return Object.keys(errors).length ? errors : null
}

// Каррированные правила
const required = fieldName => value =>
  value ? null : `${fieldName} обязательно`

const minLength = min => fieldName => value =>
  value && value.length >= min ? null : `${fieldName}: минимум ${min} символов`

// Собираем валидатор
const validateUser = validate({
  name: [required('Имя'), minLength(2)('Имя')],
  email: [required('Email')],
})

validateUser({ name: 'А', email: '' })
// { name: ['Имя: минимум 2 символов'], email: ['Email обязательно'] }
```

## TypeScript и каррирование

Типизация каррированных функций — одна из самых сложных задач в TypeScript. Простые случаи работают без проблем:

```ts
// Простая типизация — TS выводит типы
const add = (a: number) => (b: number): number => a + b
// (a: number) => (b: number) => number — TS понимает

const multiply = (a: number) => (b: number) => (c: number): number => a * b * c
// Каждый уровень типизирован
```

Проблемы начинаются с универсальной функцией `curry`:

```ts
// Наивная типизация — теряем типы аргументов
function curry(fn: Function): Function {
  // ...
}
// Результат: Function — TS не знает, сколько аргументов и какого типа
```

<DeepDive>

Точная типизация `curry` в TypeScript требует рекурсивных условных типов. Идея: тип `Curry<F>` рекурсивно «снимает» первый аргумент и оборачивает остаток:

```ts
type Curry<F> = F extends (...args: infer A) => infer R
  ? A extends [infer First, ...infer Rest]
    ? Rest extends []
      ? (arg: First) => R
      : (arg: First) => Curry<(...args: Rest) => R>
    : R
  : never

declare function curry<F extends (...args: any[]) => any>(fn: F): Curry<F>

// Использование
const add = (a: number, b: number, c: number) => a + b + c
const curried = curry(add)
// Тип: (arg: number) => (arg: number) => (arg: number) => number
```

Эта типизация не поддерживает overloaded вызовы (`f(a, b)(c)`) — для них нужны ещё более сложные типы с кортежами переменной длины. Библиотеки вроде `ts-toolbelt` предоставляют готовые решения.

</DeepDive>

## Итого

| Где | Паттерн |
|-----|---------|
| Lodash | `_.curry` — overloaded + плейсхолдеры |
| Ramda | Все функции каррированы, data-last |
| Redux | `store => next => action` — middleware |
| React | `connect(config)(Component)` — HOC |
| Express | `(config) => (req, res, next)` — middleware |
| Валидация | `validate(rules)(data)` — отделение правил от данных |
| TypeScript | Простые случаи — нативно, универсальный `curry` — рекурсивные типы |
