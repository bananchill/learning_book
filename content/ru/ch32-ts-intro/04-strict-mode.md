---
title: "Строгий режим и флаги компилятора"
parent: "ch32-ts-intro"
order: 4
---

## Зачем нужна строгость

TypeScript — это не переключатель «типы есть / типов нет». Это **шкала строгости**: чем выше вы её выкручиваете, тем больше ошибок находит компилятор.

По умолчанию TypeScript мягкий:
- Типы необязательны
- `null` и `undefined` можно присвоить любому типу
- Необъявленные типы становятся `any`

Для нового проекта рекомендуется **включать все строгие проверки сразу**. Для миграции с JavaScript — включать постепенно.

## Флаг strict

Флаг `strict` в `tsconfig.json` включает **все строгие проверки** одновременно:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Это эквивалентно включению каждого строгого флага по отдельности. Вы можете отключить отдельные проверки:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": false
  }
}
```

## noImplicitAny

Когда TypeScript не может определить тип, он использует `any` — тип, который отключает все проверки:

```ts
// Без noImplicitAny — нет ошибки, person: any
function greet(person) {
  console.log("Hello, " + person.name);
}
greet(42); // Нет ошибки компиляции, но рантайм: "Hello, undefined"
```

С `noImplicitAny` TypeScript требует явную аннотацию:

```ts
// С noImplicitAny — ошибка: Parameter 'person' implicitly has an 'any' type
function greet(person) {
  console.log("Hello, " + person.name);
}
```

Исправление:

```ts
function greet(person: { name: string }) {
  console.log("Hello, " + person.name);
}
greet(42); // Ошибка: Argument of type 'number' is not assignable
```

> `any` делает TypeScript бесполезным — вы теряете проверку типов и подсказки в IDE. Используйте `unknown` вместо `any`, если тип действительно неизвестен.

## strictNullChecks

По умолчанию `null` и `undefined` можно присвоить **любому типу**:

```ts
// Без strictNullChecks
let name: string = null; // OK
let age: number = undefined; // OK
```

Это причина огромного числа багов. Тони Хоар, автор `null`, назвал его [«ошибкой на миллиард долларов»](https://www.youtube.com/watch?v=ybrQvs4x0Ps).

С `strictNullChecks` нужно обрабатывать `null` и `undefined` явно:

```ts
// С strictNullChecks
let name: string = null; // Ошибка: Type 'null' is not assignable to type 'string'

// Если null допустим — укажите это:
let name: string | null = null; // OK
```

Это заставляет обрабатывать пограничные случаи:

```ts
function getUser(): User | null {
  // ...
}

const user = getUser();
// Ошибка: Object is possibly 'null'
console.log(user.name);

// Правильно — проверяем на null:
if (user) {
  console.log(user.name); // OK
}
```

## Другие строгие флаги

| Флаг | Что делает |
|------|-----------|
| `noImplicitAny` | Запрещает неявный `any` |
| `strictNullChecks` | `null`/`undefined` — отдельные типы |
| `strictFunctionTypes` | Строгая проверка типов параметров функций |
| `strictBindCallApply` | Строгая проверка `bind`, `call`, `apply` |
| `strictPropertyInitialization` | Свойства класса должны быть инициализированы |
| `noImplicitThis` | Запрещает `this` с неявным типом `any` |
| `alwaysStrict` | Добавляет `"use strict"` в каждый файл |
| `useUnknownInCatchVariables` | `catch(e)` — `e` имеет тип `unknown`, а не `any` |

## tsconfig.json — основы

Вместо передачи флагов в командную строку используйте файл `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "strict": true,
    "noEmitOnError": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

Создать шаблон:

```sh
tsc --init
```

Эта команда создаст `tsconfig.json` с комментариями ко всем опциям.

Подробный разбор всех опций — в [главе про tsconfig.json](/ch44-ts-config).

## Рекомендации

### Для нового проекта

```json
{
  "compilerOptions": {
    "strict": true,
    "noEmitOnError": true
  }
}
```

Включайте `strict: true` с самого начала. Исправить ошибки в новом коде проще, чем потом включать строгость в существующем.

### Для миграции с JavaScript

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

Включайте флаги по одному: сначала `strictNullChecks`, потом `noImplicitAny`, и так далее.

## Итоги

| Ситуация | Рекомендация |
|----------|-------------|
| Новый проект | `"strict": true` |
| Миграция с JS | `"strict": false`, включать по одному |
| Обязательные два флага | `noImplicitAny` + `strictNullChecks` |
| Создать tsconfig | `tsc --init` |

- `strict: true` включает все строгие проверки разом
- `noImplicitAny` запрещает неявный `any` — самый важный флаг
- `strictNullChecks` делает `null`/`undefined` отдельными типами
- Строгость — это шкала, а не переключатель
