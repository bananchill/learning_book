import { Callout, DeepDive } from '@book/ui'

# Web Storage и IndexedDB

## localStorage и sessionStorage

```javascript
// localStorage — хранится до явного удаления
localStorage.setItem('theme', 'dark')
localStorage.getItem('theme')     // 'dark'
localStorage.removeItem('theme')
localStorage.clear()              // очистить всё

// sessionStorage — хранится до закрытия вкладки
sessionStorage.setItem('cart', JSON.stringify(cartData))
const cart = JSON.parse(sessionStorage.getItem('cart') || '[]')

// Перебор всех ключей
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  const value = localStorage.getItem(key)
  console.log(key, value)
}

// Реакция на изменения из другой вкладки
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    applyTheme(event.newValue)
  }
})
```

<Callout type="warning">
localStorage хранит только строки! Объекты нужно сериализовать через JSON. Максимальный размер — обычно 5-10 МБ. Не подходит для бинарных данных и больших объёмов.
</Callout>

## Когда что использовать

```
localStorage:
  - Настройки пользователя (тема, язык)
  - Токены аутентификации (но лучше httpOnly cookie!)
  - Кэш небольших данных

sessionStorage:
  - Данные формы (защита от случайного закрытия)
  - Временное состояние (шаги wizard)
  - Данные одной сессии

IndexedDB:
  - Большие объёмы данных (>5МБ)
  - Бинарные данные (файлы, изображения)
  - Сложные запросы, индексы
  - Работа оффлайн (Service Worker)
```

## IndexedDB через idb

```javascript
import { openDB } from 'idb'

// Открытие базы с migration
const db = await openDB('my-app', 1, {
  upgrade(db, oldVersion, newVersion) {
    if (oldVersion < 1) {
      const store = db.createObjectStore('notes', {
        keyPath: 'id',
        autoIncrement: true
      })
      store.createIndex('by-date', 'createdAt')
    }
  }
})

// CRUD операции
// Добавить
const id = await db.add('notes', {
  title: 'Заметка',
  content: 'Текст...',
  createdAt: new Date()
})

// Получить
const note = await db.get('notes', id)

// Обновить
await db.put('notes', { ...note, content: 'Обновлённый текст' })

// Удалить
await db.delete('notes', id)

// Получить все
const allNotes = await db.getAll('notes')

// Запрос по индексу
const recentNotes = await db.getAllFromIndex(
  'notes',
  'by-date',
  IDBKeyRange.lowerBound(new Date(Date.now() - 86400000))
)
```

<DeepDive title="Cache API для Service Worker">

```javascript
// Кэширование ресурсов (в Service Worker)
const CACHE_NAME = 'my-app-v1'

// Установка — кэшируем статику
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/index.html', '/app.js', '/styles.css'])
    )
  )
})

// Fetch — отдаём из кэша если есть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request)
    )
  )
})
```

Cache API идеально для Progressive Web Apps (PWA) — позволяет работать оффлайн.
</DeepDive>
