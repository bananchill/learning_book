# Символы, итераторы и генераторы

Символы (`Symbol`) -- один из примитивных типов JavaScript, добавленный в ES2015. TypeScript расширяет их поддержку типом `unique symbol`, обеспечивая строгую типизацию уникальных идентификаторов. Вместе с протоколом итерации и генераторами символы формируют мощную систему абстракций для работы с последовательностями данных.

## Что вы изучите

1. **Символы в TypeScript** -- `unique symbol`, well-known символы (`Symbol.iterator`, `Symbol.hasInstance`, `Symbol.toPrimitive`), использование символов как ключей объектов.
2. **Итераторы и `for...of`** -- интерфейсы `Iterable` и `Iterator`, протокол `Symbol.iterator`, отличия `for...of` от `for...in`, создание пользовательских итерируемых объектов.
3. **Генераторы и типизация `yield`** -- функции-генераторы, тип `Generator<T, TReturn, TNext>`, делегирование через `yield*`, асинхронные генераторы.

## Предварительные знания

- [Генераторы в JavaScript](/frontend/javascript/ch18-generators) -- базовый синтаксис `function*` и `yield`
- [Дженерики в TypeScript](/frontend/typescript/ch25-ts-generics) -- параметризованные типы

## Подглавы

1. [Символы в TypeScript](/frontend/typescript/ch41-ts-symbols-iterators/01-symbols)
2. [Итераторы и for...of](/frontend/typescript/ch41-ts-symbols-iterators/02-iterators)
3. [Генераторы и типизация yield](/frontend/typescript/ch41-ts-symbols-iterators/03-generators)

## Почему это важно

Протокол итерации пронизывает весь современный JavaScript: деструктуризация массивов, spread-оператор, `for...of`, `Array.from`, `Promise.all` -- все они опираются на `Symbol.iterator`. Понимание этих механизмов позволяет создавать элегантные абстракции для работы с потоками данных, ленивыми коллекциями и асинхронными последовательностями. TypeScript добавляет к этому строгую типизацию, делая код безопаснее и выразительнее.
