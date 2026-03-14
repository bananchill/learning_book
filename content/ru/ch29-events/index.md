import { Callout, CrossLink } from '@book/ui'

# События и делегирование

События — это основной способ взаимодействия пользователя с веб-страницей. JavaScript позволяет подписываться на события, создавать кастомные события и делегировать обработку.

## Что вы узнаете

- Модель событий: bubbling, capturing, Event объект
- Делегирование событий для эффективной обработки
- Кастомные события через CustomEvent
- Оптимизация: passive listeners, { once }, AbortController

<Callout type="info">
Делегирование событий — один из фундаментальных паттернов в браузерном JavaScript. Вместо добавления обработчика к каждому дочернему элементу, добавляем один к родителю.
</Callout>

## Подглавы

1. [Модель событий](./01-event-model) — Event объект, bubbling, capturing
2. [Делегирование](./02-delegation) — паттерн, event.target vs currentTarget
3. [Кастомные события](./03-custom-events) — CustomEvent, dispatchEvent
4. [Оптимизация](./04-optimization) — passive, once, AbortController

<CrossLink chapter="ch28-dom" title="DOM API" />
<CrossLink chapter="ch31-web-apis" title="Web APIs" />
