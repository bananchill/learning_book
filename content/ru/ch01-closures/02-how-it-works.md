---
title: "Как работают замыкания под капотом"
parent: "ch01-closures"
order: 2
---

## Лексическое окружение (Lexical Environment)

Каждый раз, когда выполняется функция, движок создаёт **Lexical Environment** — объект, который хранит:
1. **Environment Record** — все локальные переменные и параметры
2. **[[OuterEnv]]** — ссылку на внешнее окружение (там, где функция была создана)

```js
function outer() {
  let x = 10 // Environment Record: { x: 10 }

  function inner() {
    // [[OuterEnv]] → окружение outer
    console.log(x) // ищет x: нет локально → ищет в [[OuterEnv]] → находит 10
  }

  return inner
}
```

## Scope chain по шагам

Рассмотрим пошагово, что происходит при выполнении:

```js
const greeting = 'Привет'

function createGreeter(name) {
  const prefix = '>>> '

  return function greet() {
    console.log(prefix + greeting + ', ' + name)
  }
}

const fn = createGreeter('Мир')
fn() // ">>> Привет, Мир"
```

**Шаг 1:** Создаётся глобальное окружение: `{ greeting: 'Привет', createGreeter: fn }`

**Шаг 2:** Вызов `createGreeter('Мир')` создаёт окружение:
- `{ name: 'Мир', prefix: '>>> ' }`
- `[[OuterEnv]]` → глобальное

**Шаг 3:** Функция `greet` создаётся, запоминает текущее окружение:
- `[[Environment]]` → окружение createGreeter

**Шаг 4:** `createGreeter` завершается, но её окружение **не удаляется** — на него есть ссылка из `greet`

**Шаг 5:** Вызов `fn()` → создаётся окружение `greet`:
- `{}`(пустое — нет локальных переменных)
- `[[OuterEnv]]` → окружение createGreeter

**Шаг 6:** Поиск `prefix`:
- Нет в `greet` → ищем в `[[OuterEnv]]` (createGreeter) → нашли `'>>> '`

**Шаг 7:** Поиск `greeting`:
- Нет в `greet` → нет в createGreeter → ищем в глобальном → нашли `'Привет'`

## let vs var: почему это важно

### var — одна переменная на весь вызов

```js
function testVar() {
  for (var i = 0; i < 3; i++) {
    // Один и тот же i для всех итераций
  }
  console.log(i) // 3 — i доступна за пределами цикла!
}
```

`var` создаёт переменную в **окружении функции**, не в блоке. Все итерации цикла видят одну и ту же `i`.

### let — новая переменная на каждую итерацию

```js
function testLet() {
  for (let i = 0; i < 3; i++) {
    // Каждая итерация получает свою копию i
  }
  // console.log(i) — ReferenceError!
}
```

`let` в цикле создаёт **новое окружение блока** на каждой итерации. Каждое замыкание захватывает свою копию `i`.

## Когда окружение уничтожается

Lexical Environment живёт, пока на него есть хотя бы одна ссылка:

```js
function create() {
  const bigData = new Array(1000000)
  return () => bigData.length
}

let fn = create() // Окружение create живёт — fn ссылается на него
fn() // 1000000
fn = null // Ссылок больше нет — GC может собрать окружение и bigData
```

## Цепочка окружений при вложенности

```js
function a() {
  let x = 1
  function b() {
    let y = 2
    function c() {
      let z = 3
      console.log(x + y + z) // ищет: c → b → a
    }
    return c
  }
  return b
}

a()()() // 6
```

Каждая функция хранит ссылку на окружение, где была создана. Цепочка `c → b → a → global` образует **scope chain**.

## Итого

| Концепция | Описание |
|-----------|----------|
| Lexical Environment | Объект: переменные + ссылка на внешнее окружение |
| Scope chain | Цепочка окружений от текущего к глобальному |
| var vs let | var — одна привязка на функцию, let — на каждый блок/итерацию |
| Время жизни | Окружение живёт, пока есть ссылки на него |
