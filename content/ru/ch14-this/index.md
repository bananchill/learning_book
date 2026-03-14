---
title: "this и контекст выполнения"
description: "Четыре правила привязки this, call/apply/bind, стрелочные функции и потеря контекста"
---

## О чём эта глава

`this` — одна из самых запутанных концепций JavaScript. В отличие от большинства языков, `this` определяется не там, где функция **написана**, а там, где она **вызвана**. Исключение — стрелочные функции, где `this` лексический.

Понимание четырёх правил привязки и умение диагностировать потерю контекста — обязательный навык.

## Содержание

1. [Четыре правила привязки this](/frontend/javascript/ch14-this/01-four-rules)
2. [call, apply, bind](/frontend/javascript/ch14-this/02-call-apply-bind)
3. [Стрелочные функции и this](/frontend/javascript/ch14-this/03-arrow-this)
4. [Потеря контекста и решения](/frontend/javascript/ch14-this/04-losing-context)

## Что ты научишься делать

- Определять `this` в любом контексте по четырём правилам
- Использовать `call`, `apply`, `bind` для явной привязки
- Понимать, когда стрелочные функции — правильный выбор
- Диагностировать и исправлять потерю контекста

## Связанные темы

- [Функции](/frontend/javascript/ch07-functions) — функции и их вызов
- [Прототипы](/frontend/javascript/ch13-prototypes) — методы в прототипе и this
- [Замыкания](/frontend/javascript/ch01-closures) — лексическое окружение

## Задания

[Перейти к заданиям](/frontend/javascript/ch14-this/tasks) — 2 easy, 1 medium

## Песочница

[Открыть песочницу](/frontend/javascript/ch14-this/playground)
