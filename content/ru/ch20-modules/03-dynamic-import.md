# Динамический import()

`import()` — функция (не директива), возвращающая Promise с модулем. Позволяет загружать модули по требованию, условно или асинхронно.

import { Callout } from '@book/ui'

## Базовый синтаксис

```js
// Статический import — выполняется при загрузке модуля
import { heavyLib } from './heavy.js'  // загружается СРАЗУ

// Динамический import() — возвращает Promise
const module = await import('./heavy.js')
module.heavyLib()

// Деструктуризация
const { add, subtract } = await import('./math.js')
```

## Code splitting в React/Vue

Бандлеры (Vite, webpack) автоматически создают отдельные чанки для динамических импортов:

```js
// Vue Router — ленивая загрузка страниц
const routes = [
  {
    path: '/dashboard',
    // DashboardPage.vue загрузится только когда пользователь зайдёт на /dashboard
    component: () => import('./pages/DashboardPage.vue')
  },
  {
    path: '/admin',
    component: () => import('./pages/AdminPage.vue')
  }
]
```

## Условный импорт

```js
// Разные реализации для разных окружений
async function getStorage() {
  if (typeof window !== 'undefined') {
    const { localStorage } = await import('./storage/browser.js')
    return localStorage
  } else {
    const { fileStorage } = await import('./storage/node.js')
    return fileStorage
  }
}

// Загрузка по флагу
async function loadAnalytics() {
  if (!userConsented) return null
  return import('./analytics.js')
}
```

<Callout type="tip">
Динамический import() — ключевой инструмент оптимизации: разбивает приложение на чанки и загружает только нужное. В SPA-приложениях с Vue Router каждая страница должна быть динамическим импортом.
</Callout>

## import.meta

`import.meta` — объект с метаданными текущего модуля:

```js
// URL текущего модуля
console.log(import.meta.url)
// file:///path/to/my/module.js

// В Vite — переменные окружения
console.log(import.meta.env.MODE)      // 'development' | 'production'
console.log(import.meta.env.VITE_API_URL)

// Hot Module Replacement (только в разработке)
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // обработка HMR-обновления
  })
}
```
