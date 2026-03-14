import { Callout } from '@book/ui'

# Шпаргалка: События и делегирование

## addEventListener

```javascript
el.addEventListener('click', handler)
el.addEventListener('click', handler, { once: true })
el.addEventListener('scroll', handler, { passive: true })
el.addEventListener('click', handler, { signal: controller.signal })
el.removeEventListener('click', handler)
```

## Event объект

```javascript
e.type           // 'click'
e.target         // куда кликнули
e.currentTarget  // элемент с обработчиком
e.preventDefault()
e.stopPropagation()
e.stopImmediatePropagation()
```

## Делегирование

```javascript
parent.addEventListener('click', (e) => {
  const target = e.target.closest('.item')
  if (!target || !parent.contains(target)) return
  // обрабатываем
})
```

## Кастомные события

```javascript
el.dispatchEvent(new CustomEvent('my-event', {
  bubbles: true,
  detail: { data: 'value' }
}))

el.addEventListener('my-event', (e) => e.detail)
```

## AbortController

```javascript
const ctrl = new AbortController()
el.addEventListener('click', fn, { signal: ctrl.signal })
el.addEventListener('keydown', fn, { signal: ctrl.signal })
ctrl.abort() // удаляет оба обработчика
```

<Callout type="tip">
Используйте { passive: true } для scroll/touch обработчиков, { once: true } для одноразовой логики, AbortController для очистки компонентов.
</Callout>
