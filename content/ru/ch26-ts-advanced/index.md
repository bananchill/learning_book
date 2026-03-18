import { Callout } from '@book/ui'

# Продвинутые типы TypeScript

Продвинутые типы TypeScript позволяют выражать сложные отношения между типами и создавать мощные type-level программы.

## Что вы узнаете

- Mapped Types — трансформация объектных типов
- Conditional Types — условная логика на уровне типов
- Template Literal Types — манипуляции со строковыми типами
- Utility Types — разбор стандартных утилит TypeScript

<Callout type="info">
Продвинутые типы — это «метапрограммирование» на уровне типов. TypeScript превращается в полноценный язык программирования, где программы выполняются во время компиляции.
</Callout>

## Подглавы

1. [Mapped Types](/frontend/typescript/ch26-ts-advanced/01-mapped-types) — `{ [K in keyof T]: ... }`, модификаторы readonly/?
2. [Conditional Types](/frontend/typescript/ch26-ts-advanced/02-conditional-types) — `T extends U ? X : Y`, дистрибутивность
3. [Template Literal Types](/frontend/typescript/ch26-ts-advanced/03-template-literal-types) — `` `${string}` ``, EventName
4. [Utility Types разбор](/frontend/typescript/ch26-ts-advanced/04-utility-types) — Pick, Omit, Record, Extract, Exclude
