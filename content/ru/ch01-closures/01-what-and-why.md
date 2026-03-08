---
title: "Что такое замыкание и зачем оно нужно"
parent: "ch01-closures"
order: 1
---

## Что такое замыкание

Замыкание — это функция, которая запоминает переменные из места своего создания. Даже когда внешняя функция завершилась, внутренняя сохраняет доступ к её переменным через ссылку на лексическое окружение.

Это не синтаксис и не ключевое слово — это механизм языка. Любая функция, обращающаяся к переменной из внешней области видимости, является замыканием.

```js
function createGreeter(name) {
  return function () {
    console.log(`Привет, ${name}!`)
  }
}

const greetAlex = createGreeter('Алекс')
greetAlex() // "Привет, Алекс!"
// createGreeter завершилась, но name доступна через замыкание
```

## Зачем нужны замыкания

### Приватное состояние

Замыкание — способ скрыть переменную от внешнего кода. Доступ только через возвращённые методы:

```js
function createCounter() {
  let count = 0

  return {
    increment() { return ++count },
    getCount() { return count },
  }
}

const counter = createCounter()
counter.increment() // 1
counter.increment() // 2
// counter.count — undefined, count приватна
```

### Фабрики функций

Одна функция порождает семейство специализированных:

```js
function multiply(factor) {
  return (number) => number * factor
}

const double = multiply(2)
const triple = multiply(3)

double(5)  // 10
triple(5)  // 15
```

### Коллбэки

Каждый обработчик событий — замыкание. Создаётся в одном контексте, вызывается позже:

```js
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId)
  button.addEventListener('click', () => alert(message))
}

setupButton('btn-hello', 'Привет!')
setupButton('btn-bye', 'Пока!')
```

## Ссылка, а не копия

Замыкание хранит **ссылку** на переменную, не снимок значения. Изменение через одно замыкание видно в другом:

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
obj.getValue() // 42
```

Обе функции замкнулись на **одну и ту же** переменную `value`. Этот принцип объясняет классический баг с `var` в цикле — разберём в разделе про [частые проблемы](/javascript/ch01-closures/03-common-problems).

## Каждый вызов — новое замыкание

Каждый вызов внешней функции создаёт изолированное окружение:

```js
function createCounter() {
  let count = 0
  return () => ++count
}

const a = createCounter()
const b = createCounter()

a() // 1
a() // 2
b() // 1 — свой count
```

## Итого

| Факт | Описание |
|------|----------|
| Что это | Функция + ссылка на лексическое окружение из места создания |
| Что хранит | Ссылку на переменную, не копию значения |
| Зачем | Приватность, фабрики, коллбэки, инкапсуляция |
| Изоляция | Каждый вызов внешней функции — новое замыкание |
