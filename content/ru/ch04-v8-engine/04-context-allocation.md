---
title: "Context Allocation и замыкания в V8"
parent: "ch04-v8-engine"
order: 4
---

## Как V8 решает: стек или куча

Когда функция объявляет переменные, V8 должен решить, где их хранить:

- **Стек** — быстрый доступ, автоматическая очистка при выходе из функции
- **Куча (Context)** — медленнее, но живёт после завершения функции

V8 использует **escape analysis** — статический анализ на этапе парсинга. Если переменная используется во вложенной функции (замыкании), она «убегает» из стека и должна жить в куче.

```js
function outer() {
  let x = 1    // используется в inner → куча (Context)
  let y = 2    // НЕ используется в inner → стек
  let z = 3    // НЕ используется в inner → стек

  function inner() {
    return x   // x «убегает» через замыкание
  }

  return inner
}
```

V8 анализирует это **до выполнения** — на этапе парсинга. Только `x` попадает в Context, `y` и `z` остаются на стеке и освобождаются при выходе из `outer`.

## Context Object

**Context** — объект в куче, хранящий переменные, захваченные замыканием. У каждой функции есть указатель на свой Context (или `null`, если замыкание не нужно).

```js
function makeAdder(base) {
  // base → Context { base: <value> }
  return (n) => base + n
}

const add5 = makeAdder(5)
// add5 хранит указатель на Context { base: 5 }
add5(3) // 8 — читает base из Context
```

Если несколько вложенных функций захватывают переменные, они разделяют один Context:

```js
function parent() {
  let shared = 0 // Context { shared: 0 }

  function inc() { shared++ }    // указатель → тот же Context
  function get() { return shared } // указатель → тот же Context

  return { inc, get }
}
```

## Scope Chain в терминах V8

Scope chain реализован как цепочка Context-объектов:

```js
function a() {
  let x = 1 // Context_A { x: 1 }

  function b() {
    let y = 2 // Context_B { y: 2, outer: Context_A }

    function c() {
      return x + y // c.context → Context_B → Context_A
    }
    return c
  }
  return b
}
```

Каждый Context хранит ссылку на внешний Context. Поиск переменной — обход цепочки. Чем глубже вложенность, тем длиннее поиск.

## Влияние eval и with

`eval` и `with` **полностью ломают** escape analysis:

```js
function dangerous() {
  let x = 1
  let y = 2
  let z = 3

  // eval может обратиться к ЛЮБОЙ переменной
  eval('console.log(y)')
  // V8 не может предсказать, какие переменные нужны
  // → ВСЕ переменные попадают в Context (куча)
}
```

С `eval` V8 не знает заранее, какие переменные будут использованы, поэтому сохраняет все в Context. Это замедляет код и увеличивает потребление памяти.

```js
// ❌ eval ломает оптимизации
function bad(code) {
  let cache = new Map()
  let data = loadBigData()
  eval(code) // ВСЕ переменные в Context
}

// ✅ Без eval — V8 оптимизирует
function good(fn) {
  let cache = new Map()
  let data = loadBigData()
  fn(cache, data) // только нужные переменные
}
```

`with` имеет такой же эффект и deprecated в strict mode.

## Практические советы

### 1. Не захватывай лишнее

```js
// ❌ heavyData попадает в Context, хотя нужен только length
function process(heavyData) {
  return () => heavyData.length
}

// ✅ Извлеки значение до замыкания
function process(heavyData) {
  const len = heavyData.length
  return () => len
}
```

### 2. Избегай eval в замыканиях

```js
// ❌ Все переменные в Context
function make() {
  let a = 1, b = 2, c = 3
  eval('')
  return () => a
}

// ✅ Если eval неизбежен — изолируй его
function make() {
  let a = 1, b = 2, c = 3
  ;(0, eval)('') // indirect eval — не видит локальные переменные
  return () => a
}
```

### 3. Минимизируй глубину scope chain

```js
// ❌ Три уровня Context
function a() {
  let x = 1
  return function b() {
    let y = 2
    return function c() {
      return x + y
    }
  }
}

// ✅ Передай как аргументы — одна функция, один Context
function createAdder(x, y) {
  return () => x + y
}
```

<DeepDive>

### --trace-opt и --trace-deopt

V8 предоставляет флаги для дебага оптимизаций:

```bash
# Показать, какие функции оптимизируются
node --trace-opt script.js

# Показать деоптимизации
node --trace-deopt script.js

# Показать байткод Ignition
node --print-bytecode script.js

# Показать причины деоптимизации
node --trace-deopt-verbose script.js
```

Пример вывода `--trace-opt`:
```
[marking 0x... <JSFunction add> for optimization to turbofan]
[compiling method 0x... <JSFunction add> using TurboFan]
[completed compiling 0x... <JSFunction add> using TurboFan]
```

Пример `--trace-deopt`:
```
[deoptimizing (DEOPT eager): ... @2, reason: not a Smi]
```

Эти флаги помогают находить узкие места: функции, которые постоянно деоптимизируются, нужно исследовать и исправить (стабилизировать типы, избегать полиморфизма).

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| Escape Analysis | Анализ на этапе парсинга: какие переменные «убегают» через замыкания |
| Context Object | Объект в куче, хранящий захваченные переменные |
| Scope Chain | Цепочка Context-объектов от внутренней функции к внешней |
| eval / with | Полностью ломают escape analysis — все переменные в Context |
| Оптимизация | Не захватывай лишнее, избегай eval, минимизируй вложенность |
