---
title: "Функции в TypeScript"
description: "Типы функций, сигнатуры вызова, перегрузки, this-параметр, rest-параметры и деструктуризация"
---

## О чём эта глава

Функции -- основной строительный блок любого приложения. TypeScript расширяет возможности JavaScript-функций мощной системой типов: выражения типов функций, сигнатуры вызова и конструкторов, перегрузки, параметр `this`, rest-параметры и деструктуризация с типами.

Эта глава основана на официальном TypeScript Handbook -- раздел "More on Functions". Разберём все ключевые механизмы типизации функций: от базовых аннотаций до продвинутых сигнатур.

## Содержание

1. [Типы функций и сигнатуры вызова](/frontend/typescript/ch33-ts-functions/01-function-types)
2. [Перегрузки функций](/frontend/typescript/ch33-ts-functions/02-overloads)
3. [this-параметр и void](/frontend/typescript/ch33-ts-functions/03-this-void)
4. [Rest-параметры и деструктуризация](/frontend/typescript/ch33-ts-functions/04-rest-destructuring)

## Что ты научишься делать

- Описывать типы функций через Function Type Expressions
- Использовать Call Signatures и Construct Signatures для сложных объектов-функций
- Правильно писать перегрузки функций и избегать типичных ошибок
- Типизировать параметр `this` в коллбэках
- Различать `void`, `object`, `unknown`, `never` и `Function` в контексте функций
- Типизировать rest-параметры и деструктуризацию

## Связанные темы

- [Введение в TypeScript](/frontend/typescript/ch32-ts-intro) -- основы типов и компилятора
- [Функции в JavaScript](/frontend/javascript/ch07-functions) -- базовые концепции функций
- [Дженерики](/frontend/typescript/ch25-ts-generics) -- обобщённые типы в функциях
- [Продвинутые типы](/frontend/typescript/ch26-ts-advanced) -- условные типы и infer
