import { Callout } from '@book/ui'

# Коллекции: Map, Set, WeakMap, WeakSet

Обычные объекты и массивы покрывают большинство задач, но у них есть ограничения. Map, Set и их «слабые» версии решают конкретные проблемы: произвольные ключи, уникальность значений, автоматическая очистка памяти.

## Что вы узнаете

- Map — хранение пар ключ-значение с любым типом ключа
- Set — коллекция уникальных значений для фильтрации дубликатов
- WeakMap и WeakSet — слабые ссылки и автоматическая сборка мусора
- Когда использовать Map вместо Object, а Set вместо Array
- Практические паттерны: кеширование, приватные данные, дедупликация



## Подглавы

1. [Map — ассоциативный массив](/frontend/javascript/ch11-collections/01-map) — new Map, set/get/has/delete, итерация, объекты как ключи
2. [Set — множество уникальных значений](/frontend/javascript/ch11-collections/02-set) — add/has/delete, удаление дубликатов, операции множеств
3. [WeakMap и WeakSet](/frontend/javascript/ch11-collections/03-weak-collections) — слабые ссылки, приватные данные, кеширование
4. [Когда что использовать](/frontend/javascript/ch11-collections/04-comparison) — Object vs Map, Array vs Set, практические рекомендации
