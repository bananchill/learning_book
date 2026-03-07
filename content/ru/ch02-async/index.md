---
title: "Асинхронность, параллелизм и конкурентность"
description: "Event loop, промисы, async/await и продвинутые асинхронные паттерны"
---

## О чём эта глава

JavaScript — однопоточный язык, но при этом способен обрабатывать тысячи операций одновременно: сетевые запросы, таймеры, пользовательские события. Как это возможно? Ответ — в модели конкурентности, построенной на event loop.

В этой главе мы разберём, как работает асинхронность от фундамента (event loop, call stack, очереди задач) до практических паттернов (retry, parallel limit, debounce). Ты поймёшь, почему `setTimeout(fn, 0)` не выполняется мгновенно, чем `Promise.all` отличается от `Promise.allSettled`, и как не попасть в ловушки `async/await`.

## Содержание

1. [Синхронный vs асинхронный код](/javascript/ch02-async/01-what-and-why)
2. [Event Loop: как JavaScript управляет асинхронностью](/javascript/ch02-async/02-event-loop)
3. [Promises: от callback hell к цепочкам](/javascript/ch02-async/03-promises)
4. [Async/Await: синтаксический сахар и подводные камни](/javascript/ch02-async/04-async-await)
5. [Паттерны и реальные задачи](/javascript/ch02-async/05-patterns)

## Что ты научишься делать

- Объяснять event loop и порядок выполнения microtask/macrotask на собеседовании
- Писать корректный асинхронный код без race conditions и утечек
- Выбирать между `Promise.all`, `Promise.allSettled`, `Promise.race` и `Promise.any`
- Обрабатывать ошибки в async/await правильно
- Реализовывать retry, parallel limit, debounce и другие продвинутые паттерны
- Отменять асинхронные операции через AbortController

## Задания

[Перейти к заданиям](/javascript/ch02-async/tasks) — 3 easy, 2 medium, 3 hard

## Песочница

[Открыть песочницу](/javascript/ch02-async/playground) — экспериментируй с промисами и event loop
