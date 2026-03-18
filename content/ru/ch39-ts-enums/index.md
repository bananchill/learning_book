# Перечисления (Enums)

Перечисления (enums) -- одна из немногих фич TypeScript, которая не является расширением типов JavaScript, а добавляет реальный код в рантайм. Enum позволяет определить набор именованных констант, делая код читаемее и защищённее от "магических" значений.

## Что вы узнаете

- Как работают числовые и строковые перечисления
- Чем `const enum` отличается от обычного enum
- Что такое вычисляемые и константные члены
- Как работает обратное отображение (reverse mapping)
- Когда стоит использовать enum, а когда -- `as const` объекты

## Структура главы

1. [Числовые и строковые перечисления](/frontend/typescript/ch39-ts-enums/01-numeric-string) -- базовый синтаксис, auto-increment, строковые enum, гетерогенные enum
2. [const enums и вычисляемые члены](/frontend/typescript/ch39-ts-enums/02-const-computed) -- константные и вычисляемые члены, `const enum`, ambient enums
3. [Паттерны использования и альтернативы](/frontend/typescript/ch39-ts-enums/03-patterns-alternatives) -- runtime-поведение, reverse mapping, объекты vs enum, паттерн `as const`

## Предварительные требования

- Базовое понимание системы типов TypeScript ([ch06-ts-type-system](/frontend/typescript/ch06-ts-type-system))
