import { Callout } from '@book/ui'

# DOM API

DOM (Document Object Model) — это программный интерфейс для HTML и XML документов. Браузер строит дерево объектов из HTML, и JavaScript может взаимодействовать с ними.

## Что вы узнаете

- Структура DOM-дерева: типы узлов, traversal
- Поиск и создание элементов
- Работа с атрибутами, классами и стилями
- DocumentFragment для производительного обновления DOM

<Callout type="info">
DOM API — это не часть JavaScript! Это Web API, предоставляемый браузером. Node.js по умолчанию не имеет DOM.
</Callout>

## Подглавы

1. [DOM-дерево](/frontend/browser/ch28-dom/01-dom-tree) — что такое DOM, типы узлов, traversal
2. [Поиск и манипуляции](/frontend/browser/ch28-dom/02-query-manipulation) — querySelector, createElement, append/remove
3. [Атрибуты, классы, стили](/frontend/browser/ch28-dom/03-attributes-classes-styles) — getAttribute, classList, dataset
4. [DocumentFragment и производительность](/frontend/browser/ch28-dom/04-documentfragment-performance) — батчинг, reflow/repaint
