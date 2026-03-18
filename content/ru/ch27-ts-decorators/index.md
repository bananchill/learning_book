import { Callout } from '@book/ui'

# Декораторы TypeScript

Декораторы — это специальный синтаксис для аннотирования и модификации классов, методов и свойств. Они широко используются в Angular, NestJS, TypeORM и других фреймворках.

## Что вы узнаете

- Синтаксис декораторов и порядок их применения
- Как писать декораторы для классов, методов и свойств
- Как использовать reflect-metadata для хранения метаданных
- Практические паттерны: @Log, @Validate, @Memoize, @Inject

<Callout type="warning">
В TypeScript 5.0+ вышли «новые декораторы» (Stage 3 proposal), отличающиеся от старых «experimentalDecorators». Эта глава рассматривает оба варианта.
</Callout>

## Подглавы

1. [Что такое декораторы](/frontend/typescript/ch27-ts-decorators/01-what-are-decorators) — синтаксис, порядок, experimentalDecorators
2. [Декораторы классов, методов, свойств](/frontend/typescript/ch27-ts-decorators/02-class-method-property) — фабрики, composition
3. [reflect-metadata](/frontend/typescript/ch27-ts-decorators/03-reflect-metadata) — метаданные типов, design:type
4. [Практика](/frontend/typescript/ch27-ts-decorators/04-practical-decorators) — @Log, @Validate, @Inject, @Memoize
