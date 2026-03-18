---
title: "Модули и пространства имён"
description: "ES-модули в TypeScript, стратегии разрешения модулей, пространства имён и слияние деклараций"
---

## О чём эта глава

TypeScript полностью поддерживает стандартные ES-модули и добавляет к ним собственные возможности: специальный синтаксис для взаимодействия с CommonJS, гибкие стратегии разрешения путей и систему слияния деклараций. Кроме того, в языке есть пространства имён (namespaces) — унаследованный механизм организации кода, который всё ещё встречается в библиотеках и `.d.ts`-файлах.

В этой главе мы разберём, как TypeScript работает с модулями, как настроить разрешение импортов для Node.js и бандлеров, когда использовать пространства имён, и как работает слияние деклараций — механизм расширения существующих типов.

## Содержание

1. [Модули в TypeScript](/frontend/typescript/ch37-ts-modules/01-modules) — ES Module Syntax, export/import, CommonJS interop, re-exports
2. [Module Resolution](/frontend/typescript/ch37-ts-modules/02-module-resolution) — стратегии node, bundler, classic; paths и baseUrl
3. [Namespaces](/frontend/typescript/ch37-ts-modules/03-namespaces) — ключевое слово namespace, многофайловые пространства имён, сравнение с модулями
4. [Declaration Merging](/frontend/typescript/ch37-ts-modules/04-declaration-merging) — слияние интерфейсов, пространств имён, расширение модулей и глобальной области

## Что ты научишься делать

- Использовать все формы import/export в TypeScript, включая `import type`
- Настраивать `moduleResolution` и `paths` в tsconfig.json
- Понимать, когда пространства имён уместны, а когда нет
- Расширять типы сторонних библиотек через declaration merging и module augmentation

## Связанные темы

- [Модульная система JavaScript](/frontend/javascript/ch20-modules) — ESM vs CommonJS, основы модулей в JS
- [Введение в TypeScript](/frontend/typescript/ch32-ts-intro) — основы языка, компилятор tsc

## Время чтения

~30 минут
