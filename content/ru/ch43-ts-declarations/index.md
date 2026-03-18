# Declaration Files

Файлы деклараций (`.d.ts`) -- мост между нетипизированным JavaScript-миром и строгой системой типов TypeScript. Они описывают форму (shape) существующих JS-библиотек, не содержа реализации -- только сигнатуры типов, интерфейсы и объявления. Благодаря `.d.ts` TypeScript может проверять типы при использовании jQuery, Lodash, Express и тысяч других библиотек, написанных на чистом JavaScript.

## Что вы изучите

1. **Что такое .d.ts и зачем они нужны** -- ambient-декларации, структуры библиотек (глобальные, модульные, UMD), как TypeScript находит типы.
2. **Написание declaration files** -- шаблоны для разных типов библиотек, `declare` keyword, do's and don'ts, экспорт типов.
3. **DefinitelyTyped, @types и публикация** -- экосистема `@types`, как устроен DefinitelyTyped, публикация собственных деклараций, бандлинг типов.
4. **Triple-Slash Directives и Module Augmentation** -- `/// <reference>`, расширение существующих модулей, глобальное дополнение, `declare module`.

## Предварительные знания

- [Модули и пространства имён](/frontend/typescript/ch37-ts-modules) -- ES-модули, стратегии разрешения, пространства имён

## Подглавы

1. [Что такое .d.ts и зачем они нужны](/frontend/typescript/ch43-ts-declarations/01-intro)
2. [Написание declaration files](/frontend/typescript/ch43-ts-declarations/02-writing)
3. [DefinitelyTyped, @types и публикация](/frontend/typescript/ch43-ts-declarations/03-definitely-typed)
4. [Triple-Slash Directives и Module Augmentation](/frontend/typescript/ch43-ts-declarations/04-triple-slash)

## Почему это важно

Большинство npm-пакетов написаны на JavaScript. Без declaration files TypeScript не знает ничего об их API -- каждый импорт превращается в `any`. Файлы `.d.ts` позволяют сохранить полную типобезопасность при работе с любыми библиотеками. Умение писать и публиковать декларации -- обязательный навык для разработчиков, создающих библиотеки или интегрирующих legacy-код.
