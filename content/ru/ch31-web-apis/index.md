import { Callout } from '@book/ui'

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

1. [Fetch API](/frontend/browser/ch31-web-apis/01-fetch-api) — fetch, Response, AbortController, таймауты
2. [WebSocket](/frontend/browser/ch31-web-apis/02-websocket) — создание, события, переподключение
3. [Observers](/frontend/browser/ch31-web-apis/03-observers) — IntersectionObserver, ResizeObserver
4. [Storage](/frontend/browser/ch31-web-apis/04-storage) — localStorage, sessionStorage, IndexedDB
