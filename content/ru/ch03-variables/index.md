import { Callout } from '@book/ui'

# Переменные и типы данных

JavaScript — динамически типизированный язык: переменная не привязана к конкретному типу, а сам тип определяется во время выполнения. Это даёт гибкость, но требует понимания того, как типы работают "под капотом".

<Callout type="warning">
JavaScript молча преобразует типы в неожиданных местах. Понимание системы типов — фундамент предсказуемого кода.
</Callout>

## Что вы узнаете

- Разницу между `var`, `let` и `const`, и почему `var` устарел
- Все 7 примитивных типов JavaScript и их особенности
- Как работает `typeof` и почему `typeof null === 'object'`
- Явное и неявное приведение типов, `==` против `===`
- Разницу между копированием примитивов и объектов

## Подглавы

1. [var, let, const](/frontend/javascript/ch03-variables/01-var-let-const) — блочный vs функциональный скоуп, TDZ
2. [Примитивные типы](/frontend/javascript/ch03-variables/02-primitives) — string, number, boolean, null, undefined, symbol, bigint
3. [typeof и приведение типов](/frontend/javascript/ch03-variables/03-typeof-coercion) — явное/неявное приведение, truthy/falsy
4. [Работа со значениями](/frontend/javascript/ch03-variables/04-values) — присваивание, копирование, ссылки
