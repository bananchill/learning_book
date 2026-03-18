# Генераторы и итераторы

Генераторы — это функции, которые умеют «ставить себя на паузу» и возобновлять выполнение. Они реализуют протокол итерации и открывают целый класс паттернов: бесконечные последовательности, ленивые вычисления, конечные автоматы и асинхронные потоки данных.

import { Callout } from '@book/ui'

<Callout type="concept">
Генератор — это функция, объявленная с `function*`, которая возвращает объект-итератор. Каждый вызов `yield` «замораживает» выполнение и возвращает значение наружу. Вызов `.next()` размораживает его с того же места.
</Callout>

## Что изучим

- **[Протокол итерации](/frontend/javascript/ch18-generators/01-iterator-protocol)** — `Symbol.iterator`, `for...of`, spread и деструктуризация
- **[Генераторы: синтаксис и поведение](/frontend/javascript/ch18-generators/02-generators-syntax)** — `function*`, `yield`, передача значений обратно
- **[Практические применения](/frontend/javascript/ch18-generators/03-practical-generators)** — бесконечные диапазоны, ленивый map/filter, конечные автоматы
- **[Async-генераторы](/frontend/javascript/ch18-generators/04-async-generators)** — `async function*`, `for await...of`, постраничная загрузка
