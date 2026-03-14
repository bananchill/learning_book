import { Callout } from '@book/ui'

# Делегирование событий

## Проблема: обработчик на каждый элемент

```javascript
// ПЛОХО: один обработчик на каждую кнопку
const buttons = document.querySelectorAll('.btn')
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})
// Проблемы:
// 1. N обработчиков в памяти
// 2. Новые кнопки не будут иметь обработчика
// 3. Нужно удалять обработчики при удалении элементов
```

## Решение: делегирование

```javascript
// ХОРОШО: один обработчик на родителя
const container = document.querySelector('.buttons-container')
container.addEventListener('click', (e) => {
  // event.target — элемент, на который кликнули
  // event.currentTarget — контейнер (к которому привязан обработчик)

  if (e.target.classList.contains('btn')) {
    handleClick(e)
  }
})

// Работает и для новых кнопок, добавленных позже!
container.appendChild(newButton) // автоматически получит обработку
```

## event.target vs event.currentTarget

```javascript
document.querySelector('.list').addEventListener('click', (e) => {
  // event.target — элемент, на который реально кликнули (может быть вложенным)
  console.log('target:', e.target.tagName)

  // event.currentTarget — элемент с обработчиком (.list)
  console.log('currentTarget:', e.currentTarget.tagName)
})

// Клик на <li> внутри <ul.list>:
// target: LI
// currentTarget: UL
```

## Метод closest() для точного делегирования

```javascript
const list = document.querySelector('ul')

list.addEventListener('click', (e) => {
  // closest() ищет ближайшего предка (включая сам элемент)
  const item = e.target.closest('li')
  if (!item) return  // клик мимо li

  const deleteBtn = e.target.closest('[data-action="delete"]')
  if (deleteBtn) {
    const id = item.dataset.id
    deleteItem(id)
    return
  }

  const editBtn = e.target.closest('[data-action="edit"]')
  if (editBtn) {
    const id = item.dataset.id
    editItem(id)
    return
  }
})
```

<Callout type="tip">
`closest(selector)` идёт вверх по DOM-дереву от элемента и возвращает первый найденный предок (включая сам элемент), который соответствует селектору. Возвращает `null` если не найден.
</Callout>

## Универсальная функция делегирования

```javascript
/**
 * Делегированный обработчик событий
 * @param {Element} el - родительский элемент
 * @param {string} event - тип события
 * @param {string} selector - CSS-селектор целевых элементов
 * @param {Function} handler - обработчик
 */
function delegate(el, event, selector, handler) {
  el.addEventListener(event, function(e) {
    const target = e.target.closest(selector)
    if (target && el.contains(target)) {
      handler.call(target, e)
    }
  })
}

// Использование
delegate(document.querySelector('table'), 'click', 'tr', function(e) {
  // this — нажатая строка таблицы
  console.log('Строка:', this.dataset.id)
})
```
