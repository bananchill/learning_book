# JSX и TSX

JSX -- синтаксическое расширение, позволяющее писать XML-подобные выражения прямо в JavaScript-коде. TypeScript добавляет к JSX полноценную систему типов: проверку атрибутов, типизацию children, различение встроенных HTML-элементов и пользовательских компонентов. Всё это работает через файлы `.tsx` и пространство имён `JSX`.

## Что вы изучите

1. **Основы JSX в TypeScript** -- опция компилятора `jsx`, режимы `preserve`/`react`/`react-jsx`/`react-native`, оператор `as` вместо angle-bracket кастов, файлы `.tsx`.
2. **Intrinsic и value-based элементы** -- интерфейс `JSX.IntrinsicElements` для HTML-тегов, функциональные и классовые компоненты, правила разрешения типов.
3. **Типизация атрибутов и children** -- проверка пропсов через `JSX.IntrinsicElements`, spread-атрибуты, типизация `children`, результирующий тип `JSX.Element`.

## Предварительные знания

- [Объектные типы в TypeScript](/frontend/typescript/ch34-ts-object-types) -- интерфейсы, опциональные свойства, индексные сигнатуры
- [Функции в TypeScript](/frontend/typescript/ch33-ts-functions) -- типизация параметров и возвращаемых значений

## Подглавы

1. [Основы JSX в TypeScript](/frontend/typescript/ch42-ts-jsx/01-jsx-basics)
2. [Intrinsic и value-based элементы](/frontend/typescript/ch42-ts-jsx/02-elements)
3. [Типизация атрибутов и children](/frontend/typescript/ch42-ts-jsx/03-attributes-children)

## Почему это важно

JSX стал стандартом для описания UI в React, Preact, Solid и других фреймворках. Без понимания того, как TypeScript типизирует JSX, невозможно писать надёжные компоненты: ошибки в пропсах, неверные children и несовместимые элементы будут обнаруживаться только в рантайме. Знание механики `JSX.IntrinsicElements`, `JSX.Element` и правил разрешения компонентов позволяет полностью контролировать типобезопасность UI-слоя.
