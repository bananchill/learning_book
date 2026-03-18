import { Callout } from '@book/ui'

# Дженерики TypeScript

Дженерики — один из самых мощных инструментов TypeScript. Они позволяют писать **обобщённый код**, который работает с разными типами, сохраняя при этом полную типобезопасность.

## Что вы узнаете

- Что такое параметры типов и зачем они нужны
- Как писать generic функции и классы
- Как работают `infer` и условные типы
- Реальные паттерны: `Repository<T>`, `Result<T,E>`, `DeepReadonly<T>`

<Callout type="info">
Дженерики — это «переменные для типов». Так же как обычные переменные хранят значения, параметры типов хранят информацию о типах.
</Callout>

## Подглавы

1. [Что такое дженерики](/frontend/typescript/ch25-ts-generics/01-what-are-generics) — параметры типов, Array&lt;T&gt;, Promise&lt;T&gt;
2. [Generic функции и классы](/frontend/typescript/ch25-ts-generics/02-generic-functions-classes) — синтаксис, вывод типов, constraints
3. [infer и условные типы](/frontend/typescript/ch25-ts-generics/03-infer-conditional) — ReturnType, Parameters, infer
4. [Реальные паттерны](/frontend/typescript/ch25-ts-generics/04-real-patterns) — Repository&lt;T&gt;, Result&lt;T,E&gt;, DeepReadonly&lt;T&gt;
