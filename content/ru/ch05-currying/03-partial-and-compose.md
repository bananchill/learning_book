---
title: "Частичное применение и compose/pipe"
parent: "ch05-currying"
order: 3
---

## Каррирование vs частичное применение

Эти термины часто путают. Разница принципиальная:

**Каррирование** — трансформация функции: `f(a, b, c)` → `f(a)(b)(c)`. Всегда создаёт цепочку унарных функций. Не передаёт аргументы.

**Частичное применение** — фиксация части аргументов: `f(a, b, c)` → `g(c)` где `a` и `b` уже заданы. Результат — функция с меньшим числом аргументов, но не обязательно унарная.

```js
// Каррирование: трансформация структуры
const curriedAdd = a => b => c => a + b + c
curriedAdd(1)(2)(3) // 6

// Частичное применение: фиксация аргументов
function add(a, b, c) { return a + b + c }
const add1 = add.bind(null, 1)     // фиксируем a = 1
add1(2, 3)                          // 6 — всё ещё принимает 2 аргумента
```

Каррирование **позволяет** частичное применение — каждый вызов в цепочке фиксирует один аргумент. Но частичное применение не требует каррирования.

## Реализация partial

```js
function partial(fn, ...fixedArgs) {
  return function (...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs)
  }
}

// Использование
function greet(greeting, punctuation, name) {
  return `${greeting}, ${name}${punctuation}`
}

const greetHello = partial(greet, 'Привет', '!')
greetHello('Алекс')  // "Привет, Алекс!"
greetHello('Мария')  // "Привет, Мария!"
```

`partial` — это `bind` без привязки `this`. Фиксирует аргументы слева, остальные дополняются при вызове.

## compose — справа налево

`compose` принимает набор функций и возвращает новую, которая выполняет их **справа налево**:

```js
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)
```

Каждая функция получает результат предыдущей. Читается как математическая нотация `f(g(h(x)))`:

```js
const toUpper = s => s.toUpperCase()
const exclaim = s => `${s}!`
const greet = s => `Привет, ${s}`

const welcome = compose(exclaim, greet, toUpper)

welcome('алекс') // "Привет, АЛЕКС!"
// Выполнение: toUpper('алекс') → greet('АЛЕКС') → exclaim('Привет, АЛЕКС')
```

## pipe — слева направо

`pipe` — то же, что `compose`, но в обратном порядке. Читается естественнее для левых-направо языков:

```js
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
```

```js
const welcome = pipe(toUpper, greet, exclaim)

welcome('алекс') // "Привет, АЛЕКС!"
// Выполнение: toUpper → greet → exclaim (слева направо)
```

`pipe` более популярен в JavaScript — порядок функций совпадает с порядком выполнения.

## Как каррирование помогает compose/pipe

`compose` и `pipe` работают с **унарными** функциями — каждая принимает один аргумент и возвращает один результат. Каррирование превращает любую функцию в унарную:

```js
// Без каррирования — не работает с pipe
const add = (a, b) => a + b         // бинарная
const multiply = (a, b) => a * b    // бинарная

// С каррированием — каждая функция унарная
const add = a => b => a + b
const multiply = a => b => a * b

const transform = pipe(
  add(10),       // x => x + 10
  multiply(2),   // x => x * 2
  add(-5)        // x => x - 5
)

transform(3)     // ((3 + 10) * 2) - 5 = 21
```

## Практический пайплайн

```js
// Вспомогательные каррированные функции
const prop = key => obj => obj[key]
const join = separator => arr => arr.join(separator)
const map = fn => arr => arr.map(fn)
const take = n => arr => arr.slice(0, n)
const toLower = s => s.toLowerCase()

// Пайплайн: извлечь имена пользователей, первые 3, lowercase, через запятую
const formatUsers = pipe(
  map(prop('name')),
  take(3),
  map(toLower),
  join(', ')
)

const users = [
  { name: 'АЛЕКС', age: 25 },
  { name: 'МАРИЯ', age: 30 },
  { name: 'ИВАН', age: 22 },
  { name: 'ОЛЬГА', age: 28 },
]

formatUsers(users) // "алекс, мария, иван"
```

Каждая строка в `pipe` — одно действие. Легко читать, легко тестировать по частям, легко добавлять и убирать шаги.

## Pointfree-стиль

Pointfree (бесточечный) — стиль, где функция описывается через композицию, без явного упоминания аргументов:

```js
// С аргументом (pointful)
const getNames = (users) => users.map(user => user.name)

// Без аргумента (pointfree)
const getNames = map(prop('name'))
```

Pointfree убирает «шум» промежуточных переменных. Но работает только с каррированными функциями — иначе не получится убрать аргумент.

> Pointfree — не самоцель. Если без аргумента код непонятнее — используйте аргумент.

## TC39 Partial Application Proposal

В JavaScript обсуждается (Stage 2) синтаксис частичного применения через `?` как плейсхолдер:

```js
// Предложение (ещё не в языке!)
const double = multiply(2, ?)  // (y) => multiply(2, y)
const greetHello = greet('Привет', ?, '!')  // (name) => greet('Привет', name, '!')
```

Это сделало бы `partial` и `bind` менее нужными. Пока предложение не принято, используем каррирование и `partial`.

## Итого

| Концепция | Описание |
|-----------|----------|
| Каррирование | Трансформация структуры: `f(a, b)` → `f(a)(b)` |
| Частичное применение | Фиксация части аргументов: `f(a, b)` → `g(b)` |
| `compose` | `(f, g, h)` → `x => f(g(h(x)))` — справа налево |
| `pipe` | `(f, g, h)` → `x => h(g(f(x)))` — слева направо |
| Pointfree | Описание функции без явных аргументов через композицию |
