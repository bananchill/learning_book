---
title: "Что такое замыкание и зачем оно нужно"
parent: "ch01-closures"
order: 1
---

## Определение в одну строку

**Замыкание** — это функция, которая запоминает переменные из места, где была создана, даже когда вызывается в другом месте.

> Формальное определение из [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures): «A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment)».

## Самый простой пример

```js
function createGreeter(name) {
  // name — переменная внешней функции
  return function () {
    console.log(`Привет, ${name}!`)
  }
}

const greetAlex = createGreeter('Алекс')
greetAlex() // "Привет, Алекс!"
// createGreeter уже завершилась, но name всё ещё доступна
```

Функция `greetAlex` «помнит» переменную `name`, хотя `createGreeter` давно завершила выполнение. Это и есть замыкание.

## Аналогия с рюкзаком

Представь, что функция — это человек, а переменные внешнего окружения — это вещи. Когда функция создаётся внутри другой функции, она берёт «рюкзак» со ссылками на внешние переменные. Куда бы функция ни отправилась — рюкзак всегда с ней.

> **Важно:** в рюкзаке не копии вещей, а ссылки. Если кто-то изменит оригинал — функция увидит изменения.

## Зачем нужны замыкания

### 1. Приватное состояние

```js
function createCounter() {
  let count = 0 // Эта переменная недоступна снаружи

  return {
    increment() { return ++count },
    getCount() { return count },
  }
}

const counter = createCounter()
counter.increment() // 1
counter.increment() // 2
counter.getCount()  // 2
// counter.count — undefined, переменная приватна!
```

### 2. Фабрики функций

```js
function multiply(factor) {
  return (number) => number * factor
}

const double = multiply(2)
const triple = multiply(3)

double(5)  // 10
triple(5)  // 15
```

### 3. Коллбэки и обработчики событий

```js
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId)
  // Коллбэк — замыкание, запоминает message
  button.addEventListener('click', () => {
    alert(message)
  })
}
```

## Ссылка, а не копия

Это **ключевой** момент, который подробно разбирает Кайл Симпсон в [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/scope-closures). Замыкание хранит ссылку на переменную, а не её значение в момент создания:

```js
function createFunctions() {
  let value = 1

  function getValue() { return value }
  function setValue(v) { value = v }

  return { getValue, setValue }
}

const obj = createFunctions()
obj.getValue() // 1
obj.setValue(42)
obj.getValue() // 42 — значение изменилось!
```

Обе функции замкнулись на **одну и ту же** переменную `value`. Изменение через `setValue` видно в `getValue`.

## Каждый вызов — новое замыкание

```js
function createCounter() {
  let count = 0
  return () => ++count
}

const a = createCounter()
const b = createCounter()

a() // 1
a() // 2
b() // 1 — свой собственный count!
```

Каждый вызов `createCounter()` создаёт **новое** лексическое окружение с **новой** переменной `count`.

## Итого

| Факт | Описание |
|------|----------|
| Что это | Функция + ссылка на внешние переменные |
| Когда создаётся | При создании любой функции (но заметно, когда переменные используются) |
| Что хранит | Ссылку, не копию значения |
| Зачем | Приватность, фабрики, коллбэки, инкапсуляция |
