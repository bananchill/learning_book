---
title: "Объектные типы"
description: "Property modifiers (optional, readonly), index signatures, расширение и пересечение типов, generic-объекты, кортежи"
---

## О чём эта глава

В TypeScript объектные типы — основной способ описать форму данных. Мы уже видели, как использовать `interface` и `type` для описания объектов. Эта глава углубляется в возможности объектных типов: модификаторы свойств, расширение и пересечение, дженерик-объекты и кортежи.

Ты узнаешь, как сделать свойства необязательными или неизменяемыми, как строить сложные типы из простых, как создавать переиспользуемые обобщённые контейнеры и как работать с кортежами — массивами фиксированной длины с типизированными элементами.

## Содержание

1. [Свойства: optional, readonly, index signatures](/frontend/typescript/ch34-ts-object-types/01-properties)
2. [Расширение и пересечение типов](/frontend/typescript/ch34-ts-object-types/02-extending-intersection)
3. [Generic-объекты и интерфейсы](/frontend/typescript/ch34-ts-object-types/03-generic-objects)
4. [Кортежи](/frontend/typescript/ch34-ts-object-types/04-tuples)

## Что ты научишься делать

- Использовать `?` и `readonly` для точного описания формы объекта
- Описывать объекты с произвольными ключами через индексные сигнатуры
- Расширять интерфейсы через `extends` и пересекать типы через `&`
- Создавать обобщённые (generic) контейнерные типы
- Работать с `ReadonlyArray` и кортежами

## Связанные темы

- [Система типов TypeScript](/frontend/typescript/ch06-ts-type-system) — основы интерфейсов и type alias
- [Дженерики TypeScript](/frontend/typescript/ch25-ts-generics) — обобщённые функции и типы
- [Операторы типов TypeScript](/frontend/typescript/ch35-ts-type-operators) — keyof, typeof, условные типы

## Время чтения

~30 минут
