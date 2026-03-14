# Frontend JS — Полный план глав (с нуля)

Дата: 2026-03-14

---

## Раздел 0: Введение

### ch01-intro — Введение в JavaScript
- [ ] Что такое JavaScript, история, где работает (браузер, Node.js)
- [ ] Как подключить скрипт к странице
- [ ] Консоль браузера — первые шаги
- [ ] Строгий режим (`'use strict'`)

### ch02-devtools — Среда разработки
- [ ] VS Code, расширения, настройка
- [ ] DevTools браузера — Console, Sources, Network
- [ ] Node.js + npm/pnpm — запуск JS вне браузера
- [ ] ESLint, Prettier — базовая настройка

---

## Раздел 1: Основы JavaScript

### ch03-variables — Переменные и типы данных
- [ ] `var`, `let`, `const` — различия и правила
- [ ] Примитивы: string, number, boolean, null, undefined, symbol, bigint
- [ ] `typeof`, явное и неявное приведение типов
- [ ] Коерция: `==` vs `===`

### ch04-operators — Операторы и выражения
- [ ] Арифметические, строковые, логические операторы
- [ ] Операторы сравнения
- [ ] Тернарный оператор
- [ ] Nullish coalescing (`??`), optional chaining (`?.`)
- [ ] Деструктуризация массивов и объектов, spread/rest (`...`)

### ch05-conditions — Условные операторы
- [ ] `if / else if / else`
- [ ] `switch / case`
- [ ] Тернарный оператор в деталях
- [ ] Короткое замыкание логических операторов (`&&`, `||`)

### ch06-loops — Циклы
- [ ] `for`, `while`, `do...while`
- [ ] `for...of` — итерация по значениям
- [ ] `for...in` — итерация по ключам
- [ ] `break`, `continue`, метки
- [ ] Когда какой цикл использовать

### ch07-functions — Функции
- [ ] Объявление функции vs функциональное выражение
- [ ] Стрелочные функции (`=>`) и отличия от обычных
- [ ] Параметры по умолчанию, rest-параметры (`...args`)
- [ ] Возвращаемые значения, `void`
- [ ] Рекурсия — базовые примеры

### ch08-arrays — Массивы
- [ ] Создание, доступ к элементам, методы изменения (`push`, `pop`, `splice`...)
- [ ] Итерационные методы: `map`, `filter`, `reduce`, `forEach`, `find`, `some`, `every`
- [ ] `flat`, `flatMap`, `Array.from`
- [ ] Сортировка: `sort`, `toSorted`
- [ ] Деструктуризация и spread

### ch09-objects — Объекты
- [ ] Создание объектов, доступ к свойствам (dot vs bracket notation)
- [ ] Методы объекта, сокращённая запись
- [ ] `Object.keys`, `Object.values`, `Object.entries`, `Object.assign`
- [ ] Деструктуризация и spread объектов
- [ ] Вложенные объекты, ссылки vs значения

### ch10-strings — Строки
- [ ] Методы строк: `slice`, `indexOf`, `includes`, `split`, `replace`, `trim`...
- [ ] Шаблонные литералы (template literals)
- [ ] Tagged templates
- [ ] Регулярные выражения — базовый уровень

🏁 **Mini-project после раздела 1:** Консольная игра «Угадай число»

---

## Раздел 2: JavaScript Intermediate

### ch11-closures — Замыкания ✅ (переименовать / переосмыслить)
- Cross-links: ch07, ch09
- [ ] Лексическое окружение
- [ ] Замыкания — что запоминает функция
- [ ] Практические паттерны: счётчики, модули, фабрики
- [ ] Замыкания в циклах — ловушки и решения

### ch12-scope-hoisting — Scope, Hoisting, TDZ
- Cross-links: ch03, ch11
- [ ] Блочный и функциональный скоуп
- [ ] Hoisting функций и переменных
- [ ] Временная мёртвая зона (TDZ)
- [ ] `var` — почему он опасен

### ch13-prototypes — Прототипы и наследование
- Cross-links: ch09, ch11
- [ ] `__proto__`, `Object.create`, prototype chain
- [ ] Классы как синтаксический сахар (`class`, `extends`, `super`)
- [ ] Паттерны наследования
- [ ] Антипаттерны (изменение `Object.prototype`)

### ch14-this — this и контекст
- Cross-links: ch07, ch13
- [ ] Правила привязки `this` (implicit, explicit, new, arrow)
- [ ] `call`, `apply`, `bind`
- [ ] Стрелочные функции и `this`
- [ ] Потеря контекста и способы её избежать

### ch15-error-handling — Обработка ошибок
- Cross-links: ch07
- [ ] `try / catch / finally`
- [ ] Кастомные классы ошибок
- [ ] `throw` — что и когда бросать
- [ ] Глобальные обработчики (`window.onerror`, `unhandledRejection`)

### ch16-fp — Функциональное программирование
- Cross-links: ch08, ch11
- [ ] Pure functions и side effects
- [ ] Immutability
- [ ] `compose` / `pipe`
- [ ] Функторы и монады — упрощённо (Maybe, Either)

### ch17-currying — Каррирование ✅ (переосмыслить)
- Cross-links: ch07, ch16
- [ ] Частичное применение
- [ ] Каррирование вручную и через библиотеки
- [ ] Практические применения

### ch18-generators — Генераторы и итераторы
- Cross-links: ch06, ch17
- [ ] `Symbol.iterator`, протокол итерации
- [ ] `function*`, `yield`, `yield*`
- [ ] Асинхронные генераторы (`async function*`)
- [ ] Ленивые вычисления

### ch19-proxy — Proxy и Reflect
- Cross-links: ch13, ch14
- [ ] Proxy — перехват операций
- [ ] Reflect — зеркало стандартных операций
- [ ] Метапрограммирование
- [ ] Как работает реактивность Vue 3 (на примере)

### ch20-modules — Модули
- Cross-links: ch11
- [ ] ESM vs CommonJS
- [ ] Tree shaking
- [ ] Циклические зависимости
- [ ] Dynamic import / code splitting

### ch21-async — Асинхронность ✅ (переосмыслить)
- Cross-links: ch07, ch15, ch18
- [ ] Event Loop — как работает
- [ ] Callbacks → Promises → async/await
- [ ] `Promise.all`, `Promise.race`, `Promise.allSettled`
- [ ] Паттерны асинхронного кода

### ch22-parallelism — Параллелизм ✅ (переосмыслить)
- Cross-links: ch21
- [ ] Web Workers, SharedArrayBuffer
- [ ] Worker Threads в Node.js
- [ ] Паттерны параллельных вычислений

🏁 **Mini-project после раздела 2:** Реактивная библиотека управления состоянием

---

## Раздел 3: Internals

### ch23-v8 — Движок V8 ✅ (переосмыслить)
- Cross-links: ch12, ch13, ch21
- [ ] Архитектура V8 — Ignition, TurboFan
- [ ] JIT-компиляция и оптимизации
- [ ] Hidden classes
- [ ] Garbage collection
- [ ] Как писать оптимизируемый код

---

## Раздел 4: TypeScript

### ch24-ts-basics — Система типов TypeScript ✅ (переосмыслить)
- [ ] Зачем TypeScript, как настроить
- [ ] Базовые типы, аннотации
- [ ] Union, Intersection, Literal types
- [ ] Interfaces vs Types

### ch25-ts-generics — Дженерики
- Cross-links: ch24
- [ ] Type parameters, constraints (`extends`)
- [ ] Generic functions и классы
- [ ] `infer` в conditional types

### ch26-ts-advanced — Продвинутые типы
- Cross-links: ch24, ch25
- [ ] Mapped Types
- [ ] Conditional Types
- [ ] Template Literal Types
- [ ] Utility Types: `Partial`, `Pick`, `Omit`, `ReturnType`...

### ch27-ts-decorators — Декораторы
- Cross-links: ch13, ch24
- [ ] Декораторы классов, методов, свойств
- [ ] `reflect-metadata`
- [ ] Паттерн DI через декораторы

🏁 **Mini-project после раздела 4:** Type-safe API Client

---

## Раздел 5: DOM и браузер

### ch28-dom — DOM API
- Cross-links: ch09, ch13
- [ ] Дерево DOM, типы узлов
- [ ] `querySelector`, `createElement`, `append`...
- [ ] `DocumentFragment` и производительность
- [ ] Идея Virtual DOM

### ch29-events — События и делегирование
- Cross-links: ch21, ch28
- [ ] Event bubbling и capturing
- [ ] Делегирование событий
- [ ] Custom events
- [ ] Пассивные слушатели, `{ once: true }`

### ch30-performance — Производительность браузера
- Cross-links: ch23, ch28
- [ ] Critical Rendering Path
- [ ] Repaint / reflow
- [ ] `requestAnimationFrame`
- [ ] Профилирование в DevTools

### ch31-web-apis — Web APIs
- Cross-links: ch21, ch29
- [ ] Fetch API + AbortController
- [ ] WebSocket
- [ ] IntersectionObserver / ResizeObserver
- [ ] Web Storage, IndexedDB

---

## Сводка

| # | Глава | Раздел | Статус |
|---|-------|--------|--------|
| ch01 | Введение в JavaScript | Введение | [ ] |
| ch02 | Среда разработки | Введение | [ ] |
| ch03 | Переменные и типы данных | Основы | [ ] |
| ch04 | Операторы и выражения | Основы | [ ] |
| ch05 | Условные операторы | Основы | [ ] |
| ch06 | Циклы | Основы | [ ] |
| ch07 | Функции | Основы | [ ] |
| ch08 | Массивы | Основы | [ ] |
| ch09 | Объекты | Основы | [ ] |
| ch10 | Строки | Основы | [ ] |
| Mini-project #1 | Игра «Угадай число» | — | [ ] |
| ch11 | Замыкания | Intermediate | ✅ `ch01-closures` |
| ch12 | Scope, Hoisting, TDZ | Intermediate | [ ] |
| ch13 | Прототипы и наследование | Intermediate | [ ] |
| ch14 | this и контекст | Intermediate | [ ] |
| ch15 | Обработка ошибок | Intermediate | [ ] |
| ch16 | Функциональное программирование | Intermediate | [ ] |
| ch17 | Каррирование | Intermediate | ✅ `ch05-currying` |
| ch18 | Генераторы и итераторы | Intermediate | [ ] |
| ch19 | Proxy и Reflect | Intermediate | [ ] |
| ch20 | Модули | Intermediate | [ ] |
| ch21 | Асинхронность | Intermediate | ✅ `ch02-async` |
| ch22 | Параллелизм | Intermediate | ✅ `ch03-parallelism` |
| Mini-project #2 | Реактивная библиотека состояния | — | [ ] |
| ch23 | Движок V8 | Internals | ✅ `ch04-v8-engine` |
| ch24 | Система типов TypeScript | TypeScript | ✅ `ch06-ts-type-system` |
| ch25 | Дженерики | TypeScript | [ ] |
| ch26 | Продвинутые типы | TypeScript | [ ] |
| ch27 | Декораторы | TypeScript | [ ] |
| Mini-project #3 | Type-safe API Client | — | [ ] |
| ch28 | DOM API | Браузер | [ ] |
| ch29 | События и делегирование | Браузер | [ ] |
| ch30 | Производительность браузера | Браузер | [ ] |
| ch31 | Web APIs | Браузер | [ ] |

**Итого:** 31 глава + 3 мини-проекта

> ♻️ — глава уже частично написана, нужно переосмыслить в контексте новой структуры
