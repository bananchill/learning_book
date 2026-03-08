---
title: "Как работают замыкания под капотом"
parent: "ch01-closures"
order: 2
---

## Лексическое окружение (Lexical Environment)

При каждом вызове функции движок создаёт объект **Lexical Environment** с двумя частями:

1. **Environment Record** — все локальные переменные и параметры
2. **[[OuterEnv]]** — ссылка на окружение, в котором функция была **создана**

Поиск переменной идёт по цепочке: текущее окружение → `[[OuterEnv]]` → его `[[OuterEnv]]` → ... → глобальное. Не нашли нигде — `ReferenceError`.

```js
function outer() {
  let x = 10 // Environment Record: { x: 10 }

  function inner() {
    // [[OuterEnv]] → окружение outer
    console.log(x) // нет локально → ищет в [[OuterEnv]] → 10
  }

  return inner
}
```

Замыкание работает именно благодаря `[[OuterEnv]]` — внутренняя функция хранит указатель на окружение, в котором создана.

## Scope chain по шагам

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

1. Создаётся глобальное окружение: `{ greeting, createGreeter }`. `[[OuterEnv]]` = `null`
2. Вызов `createGreeter('Мир')` → новое окружение: `{ name: 'Мир', prefix: '>>> ' }`. `[[OuterEnv]]` → глобальное
3. Создаётся `greet` → запоминает окружение `createGreeter` в `[[Environment]]`
4. `createGreeter` завершается, но её окружение **не уничтожается** — на него ссылается `greet`
5. Вызов `fn()` → `greet` ищет `prefix` в окружении `createGreeter`, `greeting` в глобальном

Цепочка `greet → createGreeter → global` — это **scope chain**.

## var vs let в циклах

`var` создаёт одну переменную на всю функцию. `let` — новую на каждую итерацию:

```js
// var: одна переменная i на все итерации
for (var i = 0; i < 3; i++) { /* один i */ }
console.log(i) // 3 — i доступна за пределами цикла

// let: новая привязка i на каждую итерацию
for (let i = 0; i < 3; i++) { /* свой i */ }
// console.log(i) — ReferenceError
```

Все замыкания в цикле с `var` ссылаются на одну переменную → видят финальное значение. С `let` каждое замыкание получает свою копию. Подробный разбор — в [частых проблемах](/javascript/ch01-closures/03-common-problems).

## Вложенные замыкания

Цепочка окружений может быть произвольной глубины:

```js
function a() {
  let x = 1
  function b() {
    let y = 2
    function c() {
      console.log(x + y + 3) // c → b → a
    }
    return c
  }
  return b
}

a()()() // 6
```

## Когда окружение уничтожается

Пока есть хотя бы одна ссылка — окружение живёт. Нет ссылок — GC собирает:

```js
function create() {
  const bigData = new Array(1_000_000)
  return () => bigData.length
}

let fn = create() // окружение живёт
fn = null          // ссылок нет → GC собирает окружение и bigData
```

<DeepDive>

V8 при парсинге определяет, какие переменные внутренняя функция реально использует. Только они выделяются в объект `Context` в куче. Остальные остаются на стеке и освобождаются при выходе. Замыкание не утяжеляет память ненужными данными.

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| Lexical Environment | Переменные (Environment Record) + ссылка на внешнее окружение ([[OuterEnv]]) |
| Scope chain | Цепочка окружений от текущего к глобальному |
| var vs let | var — одна привязка на функцию, let — новая на каждый блок/итерацию |
| Время жизни | Пока есть ссылка → живёт. Нет ссылок → GC собирает |
