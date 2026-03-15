---
title: "Операторы типов"
description: "keyof, typeof в контексте типов и индексные типы доступа T[K] — три ключевых оператора для работы с типами в TypeScript"
---

## О чём эта глава

TypeScript предоставляет специальные операторы, которые работают на уровне типов. Они позволяют извлекать информацию из существующих типов и строить новые типы на их основе. В этой главе разберём три ключевых оператора: `keyof`, `typeof` (в контексте типов) и индексные типы доступа `T[K]`.

Эта глава основана на официальном TypeScript Handbook — разделы "Keyof Type Operator", "Typeof Type Operator" и "Indexed Access Types".

## Содержание

1. [keyof: получение ключей типа](/frontend/typescript/ch35-ts-type-operators/01-keyof)
2. [typeof: получение типа из значения](/frontend/typescript/ch35-ts-type-operators/02-typeof)
3. [Индексные типы доступа T[K]](/frontend/typescript/ch35-ts-type-operators/03-indexed-access)
4. [Комбинирование операторов](/frontend/typescript/ch35-ts-type-operators/04-combining)

## Что ты научишься делать

- Получать union-тип ключей объекта через `keyof`
- Понимать, как `keyof` работает с индексными сигнатурами
- Использовать `typeof` в контексте типов для получения типа из значения
- Комбинировать `typeof` с `ReturnType` и другими утилитными типами
- Обращаться к типу конкретного свойства через `T[K]`
- Получать тип элемента массива через индексацию `number`
- Комбинировать `keyof`, `typeof` и `T[K]` для построения сложных типов

## Связанные темы

- [Система типов TypeScript](/frontend/typescript/ch06-ts-type-system) -- основы типов
- [Дженерики](/frontend/typescript/ch25-ts-generics) -- обобщённые типы и ограничения
- [Продвинутые типы](/frontend/typescript/ch26-ts-advanced) -- условные типы, mapped types, infer

## Задания

[Перейти к заданиям](/frontend/typescript/ch35-ts-type-operators/tasks) -- 3 easy, 2 medium, 1 hard

## Песочница

[Открыть песочницу](/frontend/typescript/ch35-ts-type-operators/playground)
