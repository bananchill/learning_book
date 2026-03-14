import { Callout } from '@book/ui'

# Кастомные события

## CustomEvent

```javascript
// Создание кастомного события
const event = new CustomEvent('user-login', {
  bubbles: true,        // всплывает ли событие
  cancelable: true,     // можно ли отменить через preventDefault()
  detail: {            // данные события
    userId: 42,
    username: 'Иван',
    timestamp: Date.now()
  }
})

// Отправка события
document.dispatchEvent(event)

// Или на конкретном элементе
const btn = document.querySelector('#login-btn')
btn.dispatchEvent(new CustomEvent('clicked', { bubbles: true }))
```

## Подписка на кастомные события

```javascript
// Слушаем кастомное событие
document.addEventListener('user-login', (e) => {
  const { userId, username } = e.detail
  console.log(`Вошёл пользователь: ${username} (ID: ${userId})`)
  updateUI(username)
})

// Кастомные события всплывают если bubbles: true
document.querySelector('.modal').addEventListener('user-login', (e) => {
  // поймает событие, отправленное из дочернего элемента
})
```

## Паттерн: компонентное взаимодействие

```javascript
// Компонент Cart отправляет событие при добавлении товара
class Cart {
  constructor(element) {
    this.element = element
    this.items = []
  }

  addItem(product) {
    this.items.push(product)

    // Уведомляем другие части приложения
    this.element.dispatchEvent(new CustomEvent('cart:item-added', {
      bubbles: true,
      detail: {
        product,
        total: this.items.length
      }
    }))
  }
}

// Компонент Badge слушает и обновляет счётчик
class CartBadge {
  constructor(element, cart) {
    this.element = element

    // Подписываемся на событие из Cart
    cart.element.addEventListener('cart:item-added', (e) => {
      this.update(e.detail.total)
    })
  }

  update(count) {
    this.element.textContent = count
  }
}
```

<Callout type="tip">
Соглашение по именованию кастомных событий: `namespace:action` (например, `cart:item-added`, `modal:close`, `form:submit`). Это предотвращает конфликты с нативными событиями.
</Callout>

## Event Hub — центральная шина событий

```javascript
// Простой event bus через EventTarget
class EventBus extends EventTarget {
  emit(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail }))
  }
}

const bus = new EventBus()

// Подписка в одном компоненте
bus.addEventListener('theme-changed', (e) => {
  applyTheme(e.detail.theme)
})

// Отправка из другого
bus.emit('theme-changed', { theme: 'dark' })
```
