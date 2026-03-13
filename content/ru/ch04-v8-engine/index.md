---
title: "Движок V8"
description: "Архитектура V8, JIT-компиляция, hidden classes, context allocation и сборка мусора"
---

## О чём эта глава

V8 — движок JavaScript, на котором работают Chrome и Node.js. Понимание его внутренностей помогает писать быстрый код, находить утечки памяти и отвечать на сложные вопросы на собеседованиях.

Разберём V8 от архитектуры до сборщика мусора: как код превращается в машинные инструкции, что такое hidden classes и inline caches, как V8 оптимизирует замыкания и когда происходит деоптимизация.

## Содержание

1. [Архитектура V8: от исходного кода до машинного](/frontend/javascript/ch04-v8-engine/01-architecture)
2. [Память: стек, куча, объекты](/frontend/javascript/ch04-v8-engine/02-memory-model)
3. [JIT-компиляция и оптимизации](/frontend/javascript/ch04-v8-engine/03-jit-optimization)
4. [Context Allocation и замыкания в V8](/frontend/javascript/ch04-v8-engine/04-context-allocation)
5. [Сборка мусора](/frontend/javascript/ch04-v8-engine/05-garbage-collection)

## Что ты научишься делать

- Объяснять pipeline V8 от исходного кода до машинного
- Понимать, как hidden classes и inline caches ускоряют JavaScript
- Писать код, дружелюбный к JIT-компилятору
- Объяснять context allocation и как V8 оптимизирует замыкания
- Находить и предотвращать утечки памяти
- Использовать флаги V8 для дебага оптимизаций

## Связанные темы

- [Замыкания](/frontend/javascript/ch01-closures) — context allocation и замыкания в V8
- [Асинхронность](/frontend/javascript/ch02-async) — event loop и оптимизации асинхронного кода
- [Параллелизм](/frontend/javascript/ch03-parallelism) — V8 isolates и Web Workers

## Задания

[Перейти к заданиям](/frontend/javascript/ch04-v8-engine/tasks) — 3 easy, 2 medium, 3 hard

## Песочница

[Открыть песочницу](/frontend/javascript/ch04-v8-engine/playground)
