import { Callout } from '@book/ui'

# Шпаргалка: Производительность браузера

## Critical Rendering Path

```
HTML → DOM ──┐
              ├→ Render Tree → Layout → Paint → Composite
CSS  → CSSOM─┘
```

## Свойства по стоимости

| Свойства | Операции | Скорость |
|----------|----------|----------|
| transform, opacity | Composite only | Быстро (GPU) |
| color, background | Repaint | Средне |
| width, height, top, margin | Layout + Repaint | Медленно |

## Layout Thrashing — избегать

```javascript
// ПЛОХО
elements.forEach(el => {
  const h = el.offsetHeight  // reflow
  el.style.top = h + 'px'    // invalidate
})

// ХОРОШО
const heights = elements.map(el => el.offsetHeight) // все чтения
elements.forEach((el, i) => el.style.top = heights[i] + 'px') // все записи
```

## rAF vs rIC

```javascript
// Визуальные обновления → rAF
requestAnimationFrame(() => { el.style.transform = `...` })

// Фоновые задачи → rIC
requestIdleCallback(() => { analytics.send() }, { timeout: 2000 })
```

## Performance API

```javascript
performance.mark('start')
// ...работа...
performance.measure('task', 'start')
const [m] = performance.getEntriesByName('task')
console.log(m.duration + 'мс')
```

<Callout type="tip">
Золотое правило: сначала ИЗМЕРИТЬ, потом оптимизировать. Не оптимизируйте вслепую — используйте DevTools Performance.
</Callout>
