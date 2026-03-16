# Документация TypeScript — полное покрытие официального Handbook

**Источник:** ТОЛЬКО typescriptlang.org/docs/handbook + /docs/handbook/2/ + TSConfig Reference
**Статус:** Выполнено (12 глав, 2026-03-15)

---

## Маппинг: Handbook → Главы

Полная структура официальной документации и что уже покрыто / что нужно написать.

### Handbook (основной)

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| The Basics | ✅ | ch06-ts-type-system |
| Everyday Types | ✅ | ch06-ts-type-system |
| Narrowing | ✅ | ch06-ts-type-system |
| More on Functions | ❌ | → **ch33-ts-functions** |
| Object Types | ⚠️ частично в ch06 | → **ch34-ts-object-types** |

### Type Manipulation

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| Creating Types from Types (обзор) | ✅ | ch26-ts-advanced |
| Generics | ✅ | ch25-ts-generics |
| Keyof Type Operator | ⚠️ кратко в ch26 | → **ch35-ts-type-operators** |
| Typeof Type Operator | ⚠️ кратко в ch26 | → **ch35-ts-type-operators** |
| Indexed Access Types | ⚠️ кратко в ch26 | → **ch35-ts-type-operators** |
| Conditional Types | ✅ | ch26-ts-advanced |
| Mapped Types | ✅ | ch26-ts-advanced |
| Template Literal Types | ✅ | ch26-ts-advanced |

### Handbook (продолжение)

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| Classes | ❌ | → **ch36-ts-classes** |
| Modules | ❌ | → **ch37-ts-modules** |

### Reference

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| Utility Types | ⚠️ частично в ch26 | → **ch38-ts-utility-types** |
| Decorators | ✅ | ch27-ts-decorators |
| Enums | ❌ | → **ch39-ts-enums** |
| Declaration Merging | ❌ | → **ch37-ts-modules** (подглава) |
| Namespaces | ❌ | → **ch37-ts-modules** (подглава) |
| Namespaces and Modules | ❌ | → **ch37-ts-modules** (подглава) |
| Type Compatibility | ❌ | → **ch40-ts-type-inference** |
| Type Inference | ⚠️ кратко в ch06 | → **ch40-ts-type-inference** |
| Symbols | ❌ | → **ch41-ts-symbols-iterators** |
| Iterators and Generators | ❌ | → **ch41-ts-symbols-iterators** |
| JSX | ❌ | → **ch42-ts-jsx** |
| Mixins | ❌ | → **ch36-ts-classes** (подглава) |
| Triple-Slash Directives | ❌ | → **ch43-ts-declarations** |
| Variable Declaration | ✅ | ch03-variables + ch06 |

### Declaration Files

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| Introduction | ❌ | → **ch43-ts-declarations** |
| Declaration Reference | ❌ | → **ch43-ts-declarations** |
| Library Structures | ❌ | → **ch43-ts-declarations** |
| .d.ts Templates | ❌ | → **ch43-ts-declarations** |
| Do's and Don'ts | ❌ | → **ch43-ts-declarations** |
| Deep Dive | ❌ | → **ch43-ts-declarations** |
| Publishing | ❌ | → **ch43-ts-declarations** |
| Consumption | ❌ | → **ch43-ts-declarations** |

### Project Configuration

| Страница handbook | Покрытие | Глава |
|-------------------|----------|-------|
| tsconfig.json | ❌ | → **ch44-ts-config** |
| Compiler Options | ❌ | → **ch44-ts-config** |
| TSConfig Reference | ❌ | → **ch44-ts-config** |
| Project References | ❌ | → **ch44-ts-config** |
| Integrating with Build Tools | ❌ | → **ch44-ts-config** |

---

## Существующие главы (не трогаем)

| Глава | Покрывает из handbook | Статус |
|-------|----------------------|--------|
| ch06-ts-type-system | The Basics, Everyday Types, Narrowing, Variable Declaration | ✅ |
| ch25-ts-generics | Generics | ✅ |
| ch26-ts-advanced | Conditional Types, Mapped Types, Template Literal Types | ✅ |
| ch27-ts-decorators | Decorators | ✅ |

---

## Новые главы (12 штук)

### ch32-ts-intro — Введение в TypeScript (~25 мин)

**Handbook:** "The Basics" (вводная часть), "TS for JS Programmers", "TS Tooling in 5 min"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Что такое TypeScript и зачем он нужен | 01-what-is-ts.md | TS for New Programmers, TS for JS Programmers |
| 02 | Установка и первая программа | 02-installation.md | TS Tooling in 5 minutes |
| 03 | Как работает компилятор tsc | 03-compiler.md | The Basics → Static type-checking, tsc |
| 04 | Строгий режим и флаги компилятора | 04-strict-mode.md | The Basics → Strictness |

---

### ch33-ts-functions — Функции в TypeScript (~30 мин)

**Handbook:** "More on Functions"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Типы функций и сигнатуры вызова | 01-function-types.md | Function Type Expressions, Call Signatures, Construct Signatures |
| 02 | Перегрузки функций (overloads) | 02-overloads.md | Function Overloads, Writing Good Overloads |
| 03 | this-параметр и void | 03-this-void.md | Declaring this, Other types: void, object, unknown, never, Function |
| 04 | Rest-параметры и деструктуризация | 04-rest-destructuring.md | Rest Parameters, Rest Arguments, Parameter Destructuring |

---

### ch34-ts-object-types — Объектные типы (~30 мин)

**Handbook:** "Object Types"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Свойства: optional, readonly | 01-properties.md | Property Modifiers, Optional Properties, readonly Properties |
| 02 | Расширение и пересечение типов | 02-extending-intersection.md | Extending Types, Intersection Types |
| 03 | Generic-объекты и интерфейсы | 03-generic-objects.md | Generic Object Types, ReadonlyArray, The Array Type |
| 04 | Кортежи (Tuples) | 04-tuples.md | Tuple Types, readonly Tuple Types |

---

### ch35-ts-type-operators — Операторы типов (~25 мин)

**Handbook:** "Keyof Type Operator", "Typeof Type Operator", "Indexed Access Types"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | keyof — получение ключей типа | 01-keyof.md | The keyof type operator |
| 02 | typeof — получение типа из значения | 02-typeof.md | The typeof type operator, ReturnType |
| 03 | Индексные типы доступа (T[K]) | 03-indexed-access.md | Indexed Access Types |
| 04 | Комбинирование операторов | 04-combining.md | Практика: keyof + typeof + T[K] вместе |

---

### ch36-ts-classes — Классы в TypeScript (~35 мин)

**Handbook:** "Classes", Reference → "Mixins"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Поля, конструкторы и методы | 01-members.md | Class Members, Fields, readonly, Constructors, Methods, Getters/Setters |
| 02 | Модификаторы доступа и наследование | 02-visibility-heritage.md | Member Visibility (public/protected/private), implements, extends |
| 03 | abstract-классы и static-члены | 03-abstract-static.md | Abstract Classes, Static Members, static Blocks |
| 04 | Mixins и this-типы | 04-mixins-this.md | Reference → Mixins, this Types, this at Runtime in Classes, Parameter Properties |

---

### ch37-ts-modules — Модули и пространства имён (~30 мин)

**Handbook:** "Modules", Reference → "Namespaces", "Namespaces and Modules", "Declaration Merging"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Модули в TypeScript | 01-modules.md | Modules → ES Module Syntax, export/import, CommonJS, Module Resolution |
| 02 | Module Resolution | 02-module-resolution.md | Module Resolution strategies (node, bundler, classic) |
| 03 | Namespaces | 03-namespaces.md | Namespaces, Namespaces and Modules |
| 04 | Declaration Merging | 04-declaration-merging.md | Merging Interfaces, Merging Namespaces, Module Augmentation |

---

### ch38-ts-utility-types — Утилитарные типы (~35 мин)

**Handbook:** Reference → "Utility Types" (ПОЛНЫЙ список)

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Трансформация объектов | 01-object-transform.md | `Partial<T>`, `Required<T>`, `Readonly<T>`, `Record<K,T>`, `Pick<T,K>`, `Omit<T,K>` |
| 02 | Работа с union-типами | 02-union-manipulation.md | `Exclude<U,E>`, `Extract<T,U>`, `NonNullable<T>`, `NoInfer<T>` |
| 03 | Типы функций и классов | 03-function-class-types.md | `Parameters<T>`, `ConstructorParameters<T>`, `ReturnType<T>`, `InstanceType<T>`, `ThisParameterType<T>`, `OmitThisParameter<T>`, `ThisType<T>` |
| 04 | Awaited и строковые типы | 04-awaited-string.md | `Awaited<T>`, `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>` |

---

### ch39-ts-enums — Перечисления (~20 мин)

**Handbook:** Reference → "Enums"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Числовые и строковые перечисления | 01-numeric-string.md | Numeric enums, String enums, Heterogeneous enums |
| 02 | const enums и вычисляемые члены | 02-const-computed.md | Computed and constant members, const enums |
| 03 | Паттерны использования и альтернативы | 03-patterns-alternatives.md | Enums at runtime, Enums at compile time, Reverse mappings, Ambient enums, Objects vs Enums |

---

### ch40-ts-type-inference — Вывод типов и совместимость (~25 мин)

**Handbook:** Reference → "Type Inference", "Type Compatibility"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Как TypeScript выводит типы | 01-inference.md | Type Inference, Best common type, Contextual Typing |
| 02 | Совместимость типов | 02-compatibility.md | Type Compatibility, Structural subtyping, Comparing functions |
| 03 | Ковариантность и контравариантность | 03-variance.md | Function Parameter Bivariance, Enums compatibility, Classes compatibility |

---

### ch41-ts-symbols-iterators — Символы, итераторы и генераторы (~25 мин)

**Handbook:** Reference → "Symbols", "Iterators and Generators"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Символы в TypeScript | 01-symbols.md | unique symbol, Well-known Symbols (Symbol.hasInstance, Symbol.iterator, etc.) |
| 02 | Итераторы и for...of | 02-iterators.md | Iterables, Iterable interface, for..of vs for..in |
| 03 | Генераторы и типизация yield | 03-generators.md | Generator functions, Generator<T, TReturn, TNext> |

---

### ch42-ts-jsx — JSX и TSX (~25 мин)

**Handbook:** Reference → "JSX"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Основы JSX в TypeScript | 01-jsx-basics.md | Basic usage, The as operator, Type Checking, jsx compiler option |
| 02 | Intrinsic и value-based элементы | 02-elements.md | Intrinsic elements, Value-based elements, Function Component, Class Component |
| 03 | Типизация атрибутов и children | 03-attributes-children.md | Attribute type checking, Children Type Checking, JSX result type |

---

### ch43-ts-declarations — Declaration Files (~30 мин)

**Handbook:** "Declaration Files" (весь раздел), Reference → "Triple-Slash Directives"

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Что такое .d.ts и зачем они нужны | 01-intro.md | Introduction, Library Structures |
| 02 | Написание declaration files | 02-writing.md | Declaration Reference, .d.ts Templates, Do's and Don'ts |
| 03 | DefinitelyTyped, @types и публикация | 03-definitely-typed.md | Publishing, Consumption, Deep Dive |
| 04 | Triple-Slash Directives и Module Augmentation | 04-triple-slash.md | Triple-Slash Directives, Module Augmentation |

---

### ch44-ts-config — tsconfig.json и конфигурация (~25 мин)

**Handbook:** "Project Configuration" (весь раздел)

| # | Подглава | Файл | Handbook source |
|---|----------|------|-----------------|
| 01 | Структура tsconfig.json | 01-structure.md | What is a tsconfig.json, Using tsconfig.json |
| 02 | Ключевые опции компилятора | 02-compiler-options.md | strict, target, module, lib, esModuleInterop, moduleResolution, etc. |
| 03 | Paths, baseUrl и алиасы | 03-paths-aliases.md | Path mapping, baseUrl, rootDirs |
| 04 | Project References и монорепо | 04-project-references.md | Project References, Build Mode, Integrating with Build Tools |

---

## Сводка

### Полное покрытие handbook

| Раздел | Страниц в handbook | Покрыто (ch06,25-27) | Новые главы |
|--------|--------------------|-----------------------|-------------|
| Handbook основной | 5 | 3 (Basics, Everyday, Narrowing) | 2 (Functions, Object Types) |
| Type Manipulation | 8 | 4 (Generics, Cond, Mapped, Template) | 1 (Keyof/Typeof/Indexed) |
| Handbook продолжение | 2 | 0 | 2 (Classes, Modules) |
| Reference | 15 | 2 (Decorators, Variable Decl) | 5 (Utility, Enums, Inference, Symbols, JSX) |
| Declaration Files | 8 | 0 | 1 (Declarations) |
| Project Configuration | 5 | 0 | 1 (Config) |
| **Итого** | **43** | **9** | **12** |

### Все 16 глав TypeScript

| # | Глава | Статус | ~мин |
|---|-------|--------|------|
| ch06 | Система типов | ✅ Готово | 38 |
| ch25 | Дженерики | ✅ Готово | 45 |
| ch26 | Advanced Types | ✅ Готово | 50 |
| ch27 | Декораторы | ✅ Готово | 45 |
| ch32 | Введение в TypeScript | ❌ Писать | 25 |
| ch33 | Функции в TypeScript | ❌ Писать | 30 |
| ch34 | Объектные типы | ❌ Писать | 30 |
| ch35 | Операторы типов | ❌ Писать | 25 |
| ch36 | Классы | ❌ Писать | 35 |
| ch37 | Модули и Namespaces | ❌ Писать | 30 |
| ch38 | Утилитарные типы | ❌ Писать | 35 |
| ch39 | Enums | ❌ Писать | 20 |
| ch40 | Вывод типов и совместимость | ❌ Писать | 25 |
| ch41 | Символы, итераторы, генераторы | ❌ Писать | 25 |
| ch42 | JSX/TSX | ❌ Писать | 25 |
| ch43 | Declaration Files | ❌ Писать | 30 |
| ch44 | tsconfig.json | ❌ Писать | 25 |
| | **Итого новых** | | **~380 мин** |

## Артефакты для каждой новой главы

- `_meta.json` — метаданные
- `index.md` + подглавы (.md)
- `cheatsheet.md`
- `quiz.json` (5–6 вопросов)
- `interview.json` (4–5 вопросов)
- `tasks/` (3 easy + 2 medium + 1–2 hard + тесты)
- `code-review/` (1 упражнение)
- `resources.json`
- `walkthrough.json`

## Cross-links

| Глава | Связана с |
|-------|-----------|
| ch32 (intro) | ch06 (type system), ch44 (config) |
| ch33 (functions) | ch07 (JS functions), ch25 (generics), ch34 (object types) |
| ch34 (object types) | ch06 (type system), ch25 (generics), ch35 (type operators) |
| ch35 (type operators) | ch06 (type system), ch26 (advanced), ch34 (object types) |
| ch36 (classes) | ch13 (prototypes), ch06 (type system), ch34 (object types) |
| ch37 (modules) | ch20 (JS modules), ch43 (declarations), ch44 (config) |
| ch38 (utility types) | ch25 (generics), ch26 (advanced), ch35 (type operators) |
| ch39 (enums) | ch06 (type system), ch36 (classes) |
| ch40 (inference) | ch06 (type system), ch33 (functions) |
| ch41 (symbols/iterators) | ch18 (JS generators), ch25 (generics) |
| ch42 (JSX) | ch34 (object types), ch33 (functions) |
| ch43 (declarations) | ch37 (modules), ch44 (config) |
| ch44 (config) | ch32 (intro), ch37 (modules) |

## Порядок написания

```
ch32 → ch33 → ch34 → ch35 → ch36 → ch37 → ch38 → ch39 → ch40 → ch41 → ch42 → ch43 → ch44
```

## Принципы

- Источник — **только** typescriptlang.org/docs/handbook
- Никакие сторонние блоги, статьи, книги
- Все тексты на русском, код — английские имена
- Существующие главы (ch06, ch25–27) не трогаем
- Каждая страница handbook должна быть покрыта хотя бы одной подглавой
