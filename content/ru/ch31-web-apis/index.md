import { Callout, CrossLink } from '@book/ui'

# Web APIs

Браузер предоставляет богатый набор Web APIs — интерфейсов для работы с сетью, хранилищем, наблюдения за элементами и многого другого.

## Что вы узнаете

- Fetch API — HTTP запросы с правильной обработкой ошибок
- WebSocket — двунаправленная связь в реальном времени
- IntersectionObserver и ResizeObserver — эффективные наблюдатели
- Web Storage и IndexedDB — клиентское хранилище данных

<Callout type="info">
Web APIs — это не JavaScript. Это интерфейсы, предоставляемые браузером. Они вызываются из JS, но реализованы в самом браузере (на C++).
</Callout>

## Подглавы

1. [Fetch API](./01-fetch-api) — fetch, Response, AbortController, таймауты
2. [WebSocket](./02-websocket) — создание, события, переподключение
3. [Observers](./03-observers) — IntersectionObserver, ResizeObserver
4. [Storage](./04-storage) — localStorage, sessionStorage, IndexedDB

<CrossLink chapter="ch02-async" title="Асинхронность" />
<CrossLink chapter="ch29-events" title="События и делегирование" />
