---
title: "Параллелизм и конкурентность"
description: "Конкурентность vs параллелизм, Web Workers, SharedArrayBuffer, Atomics, worker_threads, паттерны многопоточности"
---

## О чём эта глава

В [предыдущей главе](/javascript/ch02-async) мы разобрали, как JavaScript обрабатывает тысячи асинхронных операций в одном потоке. Event loop — это конкурентность: один поток переключается между задачами. Но что делать, когда одного потока мало? Тяжёлые вычисления блокируют event loop, и никакой `async/await` не поможет.

Эта глава — про настоящий параллелизм: выполнение кода в нескольких потоках одновременно. Web Workers в браузере, `worker_threads` и `cluster` в Node.js, общая память через `SharedArrayBuffer`, атомарные операции и паттерны, которые делают многопоточный JavaScript управляемым.

## Содержание

1. [Конкурентность vs параллелизм](/javascript/ch03-parallelism/01-concepts)
2. [Web Workers](/javascript/ch03-parallelism/02-web-workers)
3. [SharedArrayBuffer и Atomics](/javascript/ch03-parallelism/03-shared-memory)
4. [Параллелизм в Node.js](/javascript/ch03-parallelism/04-node-parallelism)
5. [Паттерны и решения](/javascript/ch03-parallelism/05-patterns-and-decisions)

## Что ты научишься делать

- Объяснять разницу между конкурентностью и параллелизмом
- Создавать Web Workers и обмениваться данными через postMessage
- Использовать SharedArrayBuffer и Atomics для работы с общей памятью
- Выбирать между worker_threads, child_process и cluster в Node.js
- Реализовывать пул воркеров и другие паттерны многопоточности
- Принимать решение: нужен ли воркер для конкретной задачи

## Связанные темы

- [Замыкания](/javascript/ch01-closures) — замыкания не передаются через postMessage: функции нельзя клонировать
- [Асинхронность](/javascript/ch02-async) — event loop = concurrency, не parallelism; worker pool расширяет parallel limit

## Задания

[Перейти к заданиям](/javascript/ch03-parallelism/tasks) — 3 easy, 2 medium, 3 hard

## Песочница

[Открыть песочницу](/javascript/ch03-parallelism/playground) — экспериментируй с воркерами и общей памятью
