import { Callout, CrossLink } from '@book/ui'

# Утилитарные типы

TypeScript предоставляет набор встроенных **утилитарных типов** (utility types), которые позволяют трансформировать существующие типы без написания ручных определений. Эти типы доступны глобально и покрывают большинство типичных задач: от создания частичных копий объектов до извлечения возвращаемого типа функции.

## Что вы узнаете

- Как трансформировать объектные типы с помощью `Partial`, `Required`, `Readonly`, `Record`, `Pick`, `Omit`
- Как манипулировать union-типами через `Exclude`, `Extract`, `NonNullable`, `NoInfer`
- Как извлекать типы из функций и классов: `Parameters`, `ReturnType`, `InstanceType` и другие
- Как работать с промисами и строковыми литералами: `Awaited`, `Uppercase`, `Capitalize`

<Callout type="info">
Все утилитарные типы — это обычные дженерики, реализованные через mapped types, conditional types и infer. Понимание их внутреннего устройства поможет вам создавать собственные утилиты.
</Callout>

## Подглавы

1. [Трансформация объектов](./01-object-transform) — Partial, Required, Readonly, Record, Pick, Omit
2. [Работа с union-типами](./02-union-manipulation) — Exclude, Extract, NonNullable, NoInfer
3. [Типы функций и классов](./03-function-class-types) — Parameters, ReturnType, InstanceType и другие
4. [Awaited и строковые типы](./04-awaited-string) — Awaited, Uppercase, Lowercase, Capitalize, Uncapitalize

<CrossLink chapter="ch25-ts-generics" title="Дженерики TypeScript" />
<CrossLink chapter="ch26-ts-advanced" title="Продвинутые типы TypeScript" />
