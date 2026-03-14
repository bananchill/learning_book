import { Callout, DeepDive } from '@book/ui'

# Оптимизация обработчиков событий

## { once: true } — одноразовый обработчик

```javascript
// Сработает один раз и автоматически удалится
btn.addEventListener('click', handleClick, { once: true })

// Эквивалент вручную:
function handleOnce(e) {
  handleClick(e)
  btn.removeEventListener('click', handleOnce)
}
btn.addEventListener('click', handleOnce)
```

## Passive listeners — улучшение производительности

```javascript
// НЕОПТИМАЛЬНО: браузер ждёт до вызова обработчика
// (вдруг там будет preventDefault?)
document.addEventListener('touchstart', handler)
document.addEventListener('scroll', handler)

// ОПТИМАЛЬНО: говорим браузеру, что preventDefault не будет
document.addEventListener('touchstart', handler, { passive: true })
document.addEventListener('scroll', handler, { passive: true })
// Браузер может сразу начать прокрутку, не ожидая JS
```

<Callout type="info">
Passive listeners особенно важны для `touchstart`, `touchmove`, `scroll`, `wheel`. Они устраняют задержку прокрутки — браузер не ждёт завершения обработчика перед скроллом.
</Callout>

## AbortController — управление несколькими обработчиками

```javascript
// Создаём контроллер
const controller = new AbortController()
const { signal } = controller

// Добавляем обработчики с signal
document.addEventListener('keydown', handleKey, { signal })
window.addEventListener('resize', handleResize, { signal })
document.addEventListener('click', handleClick, { signal })

// Удаляем ВСЕ одним вызовом!
controller.abort()
// Все три обработчика удалены

// Практично в компонентах:
class Modal {
  constructor() {
    this.controller = new AbortController()
    this.setupEvents()
  }

  setupEvents() {
    const { signal } = this.controller

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close()
    }, { signal })

    document.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close()
    }, { signal })
  }

  destroy() {
    this.controller.abort()  // убираем всё одной строкой
  }
}
```

## Снятие обработчиков при удалении элемента

```javascript
// Паттерн для компонентов: хранить ссылки на обработчики
class Dropdown {
  constructor(element) {
    this.element = element
    this.controller = new AbortController()

    const { signal } = this.controller

    element.addEventListener('click', this.toggle.bind(this), { signal })
    document.addEventListener('click', this.handleOutsideClick.bind(this), { signal })
  }

  toggle() { /* ... */ }
  handleOutsideClick(e) { /* ... */ }

  destroy() {
    this.controller.abort()
    this.element.remove()
  }
}
```

<DeepDive title="Event delegation vs отдельные обработчики — когда что использовать">

**Делегирование лучше если:**
- Много однотипных элементов (список, таблица)
- Элементы добавляются/удаляются динамически
- Нужно единообразно обрабатывать целую группу

**Отдельные обработчики лучше если:**
- Элемент один, логика сложная
- Нужна точная очистка при удалении (AbortController)
- Элемент статичный и изолированный

```javascript
// Гибридный подход: делегирование + AbortController
function setupList(listEl) {
  const ctrl = new AbortController()

  listEl.addEventListener('click', handleListClick, {
    signal: ctrl.signal
  })
  listEl.addEventListener('keydown', handleListKeydown, {
    signal: ctrl.signal
  })

  return () => ctrl.abort()  // функция очистки
}

const cleanup = setupList(document.querySelector('.list'))
// Позже:
cleanup()  // удаляет все обработчики
```
</DeepDive>
