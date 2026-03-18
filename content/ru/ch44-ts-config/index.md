---
title: "tsconfig.json и конфигурация"
description: "Структура tsconfig.json, ключевые опции компилятора, пути и алиасы, Project References и монорепо"
---

## О чём эта глава

Файл `tsconfig.json` -- центральная точка конфигурации TypeScript-проекта. Он определяет, какие файлы компилировать, какие правила проверки применять и как генерировать выходной код. Правильная настройка `tsconfig.json` -- разница между проектом, где TypeScript ловит ошибки и помогает, и проектом, где он мешает.

В этой главе ты разберёшь структуру конфигурационного файла, научишься выбирать правильные опции компилятора для своего проекта, настраивать алиасы путей и работать с Project References в монорепозиториях.

## Содержание

1. [Структура tsconfig.json](/frontend/typescript/ch44-ts-config/01-structure)
2. [Ключевые опции компилятора](/frontend/typescript/ch44-ts-config/02-compiler-options)
3. [Paths, baseUrl и алиасы](/frontend/typescript/ch44-ts-config/03-paths-aliases)
4. [Project References и монорепо](/frontend/typescript/ch44-ts-config/04-project-references)

## Что ты научишься делать

- Создавать и структурировать `tsconfig.json` для разных типов проектов
- Выбирать правильные значения `target`, `module` и `moduleResolution`
- Настраивать строгий режим и понимать, что включает каждый флаг
- Использовать `paths` для алиасов и чистых импортов
- Организовывать конфигурацию монорепо через Project References

## Связанные темы

- [Введение в TypeScript](/frontend/typescript/ch32-ts-intro) -- основы TypeScript, первое знакомство с tsc
- [Модули и пространства имён](/frontend/typescript/ch37-ts-modules) -- модульная система, стратегии разрешения

## Время чтения

~25 минут
