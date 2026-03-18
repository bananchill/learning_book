---
title: "Классы в TypeScript"
description: "Полное руководство по классам в TypeScript: поля, конструкторы, модификаторы доступа, наследование, абстрактные классы, статические члены, миксины и this-типы"
---

# Классы в TypeScript

TypeScript расширяет JavaScript-классы мощной системой типов: строгая типизация полей, модификаторы доступа, абстрактные классы и паттерн миксинов. В этой главе мы разберём, как TypeScript превращает классы из синтаксического сахара в полноценный инструмент объектно-ориентированного проектирования.

## Подглавы

1. [Поля, конструкторы и методы](/frontend/typescript/ch36-ts-classes/01-members) — объявление полей, `readonly`, конструкторы, методы, геттеры и сеттеры
2. [Модификаторы доступа и наследование](/frontend/typescript/ch36-ts-classes/02-visibility-heritage) — `public`, `protected`, `private`, `implements`, `extends`
3. [abstract-классы и static-члены](/frontend/typescript/ch36-ts-classes/03-abstract-static) — абстрактные классы, статические поля и методы, `static` блоки
4. [Mixins и this-типы](/frontend/typescript/ch36-ts-classes/04-mixins-this) — паттерн миксинов, this-типы, parameter properties

## Что вы узнаете

- Как TypeScript типизирует поля, методы и конструкторы классов
- Чем отличаются `public`, `protected` и `private` от рантайм `#private`
- Как использовать `implements` и `extends` с полной типобезопасностью
- Зачем нужны абстрактные классы и когда предпочесть интерфейс
- Как работают статические члены и `static` блоки инициализации
- Как реализовать паттерн миксинов в TypeScript
- Как `this`-типы помогают строить fluent API

## Предварительные знания

- [Прототипы в JavaScript](/frontend/javascript/ch13-prototypes) — прототипная цепочка и `class` как сахар
- [Система типов TypeScript](/frontend/typescript/ch06-ts-type-system) — базовые типы, интерфейсы, дженерики
