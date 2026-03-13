---
title: "Асинхронность"
description: "Event loop, промисы, async/await и продвинутые асинхронные паттерны"
---

## О чём эта глава

JavaScript — однопоточный язык, но при этом способен обрабатывать тысячи операций без блокировки: сетевые запросы, таймеры, пользовательские события. Как это возможно? Ответ — в асинхронной модели, построенной на event loop.

В этой главе мы разберём, как работает асинхронность от фундамента (event loop, call stack, очереди задач) до практических паттернов (retry, debounce, отмена запросов). Ты поймёшь, почему `setTimeout(fn, 0)` не выполняется мгновенно, чем `Promise.all` отличается от `Promise.allSettled`, и как не попасть в ловушки `async/await`.

## Содержание

1. [Синхронный vs асинхронный код](/frontend/javascript/ch02-async/01-what-and-why)
2. [Event Loop: как JavaScript управляет асинхронностью](/frontend/javascript/ch02-async/02-event-loop)
3. [Promises: от callback hell к цепочкам](/frontend/javascript/ch02-async/03-promises)
4. [Async/Await: синтаксический сахар и подводные камни](/frontend/javascript/ch02-async/04-async-await)
5. [Паттерны и реальные задачи](/frontend/javascript/ch02-async/05-patterns)

## Что ты научишься делать

- Объяснять event loop и порядок выполнения microtask/macrotask на собеседовании
- Писать корректный асинхронный код без race conditions и утечек
- Выбирать между `Promise.all`, `Promise.allSettled`, `Promise.race` и `Promise.any`
- Обрабатывать ошибки в async/await правильно
- Реализовывать retry, timeout, debounce и другие продвинутые паттерны
- Отменять асинхронные операции через AbortController

## Связанные темы

- [Замыкания](/frontend/javascript/ch01-closures) — замыкания лежат в основе callbacks и async-функций

## Задания

[Перейти к заданиям](/frontend/javascript/ch02-async/tasks) — 3 easy, 2 medium, 3 hard

## Песочница

[Открыть песочницу](/frontend/javascript/ch02-async/playground) — экспериментируй с промисами и event loop
