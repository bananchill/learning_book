---
title: "Система типов TypeScript"
description: "Что такое система типов, зачем нужны типы, structural vs nominal, примитивы, объектные типы и type narrowing"
---

## О чём эта глава

TypeScript — это не просто «JavaScript с типами». Это полноценная система типов, построенная на уникальных принципах: структурная совместимость, полное стирание типов при компиляции и сознательный отказ от абсолютной корректности ради продуктивности.

Разберём систему типов от базовых концепций до продвинутых паттернов: зачем нужны типы, как работает структурная типизация, какие типы есть в языке и как TypeScript сужает их в потоке кода.

## Содержание

1. [Что такое система типов и зачем она нужна](/frontend/typescript/ch06-ts-type-system/01-what-and-why)
2. [Структурная vs номинальная типизация](/frontend/typescript/ch06-ts-type-system/02-structural-vs-nominal)
3. [Примитивные типы, литералы и специальные типы](/frontend/typescript/ch06-ts-type-system/03-primitives-and-literals)
4. [Объектные типы: интерфейсы, type alias, классы](/frontend/typescript/ch06-ts-type-system/04-object-types)
5. [Сужение типов (Type Narrowing) и контроль потока](/frontend/typescript/ch06-ts-type-system/05-type-narrowing)

## Что ты научишься делать

- Понимать, почему TypeScript использует структурную типизацию и что это значит на практике
- Различать `any`, `unknown`, `never` и `void` — и выбирать правильный
- Использовать `interface` и `type` осознанно, а не наугад
- Писать type guards и discriminated unions
- Объяснить систему типов TypeScript на собеседовании

## Связанные темы

- [Замыкания](/frontend/javascript/ch01-closures) — типизация замыканий, потеря сужения типа в callback
- [Асинхронность](/frontend/javascript/ch02-async) — типизация Promise, async/await, unknown в catch
- [Движок V8](/frontend/javascript/ch04-v8-engine) — type erasure: типы стираются при компиляции, V8 их не видит
- [Каррирование](/frontend/javascript/ch05-currying) — дженерики для curry и compose
