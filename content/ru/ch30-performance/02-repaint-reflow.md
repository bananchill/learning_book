import { Callout } from '@book/ui'

# Repaint и Reflow

## Что такое Reflow (Layout)

Reflow — пересчёт геометрии страницы. Запускается при изменениях:
- Размеров элементов (width, height, font-size)
- Позиционирования (top, left, margin, padding)
- Добавлении/удалении DOM-элементов
- Изменении display, visibility
- Изменении шрифтов, текста

## Что вызывает Forced Reflow

Браузер обычно откладывает пересчёт layout до конца текущей задачи. Но если JavaScript запрашивает актуальные геометрические данные сразу после модификации DOM, браузер вынужден выполнить reflow немедленно — это называется **forced reflow** (принудительный пересчёт). Чтение следующих свойств после изменений DOM запускает этот процесс:

```javascript
// Чтение следующих свойств ПОСЛЕ изменений DOM
// вызывает принудительный reflow:
el.offsetWidth / el.offsetHeight
el.offsetTop / el.offsetLeft
el.scrollTop / el.scrollLeft / el.scrollWidth
el.clientWidth / el.clientHeight
el.getBoundingClientRect()
window.getComputedStyle(el)
```

## Layout Thrashing — главный враг производительности

```javascript
// ПЛОХО: чередуем чтение и запись — N forced reflows
elements.forEach(el => {
  const height = el.offsetHeight   // forced reflow (чтение)
  el.style.height = height * 2 + 'px'  // изменение (запись)
  // на следующей итерации чтение снова вызовет reflow!
})

// ХОРОШО: разделяем чтение и запись
const heights = Array.from(elements, el => el.offsetHeight)  // все чтения
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2 + 'px'  // все записи
})
```

## Техники минимизации

Главная идея оптимизации — свести количество reflow к минимуму. Для этого нужно группировать операции: сначала все чтения, затем все записи. Если необходимо внести множество изменений в один элемент, лучше временно убрать его из потока рендеринга или работать с клоном:

```javascript
// 1. Скрыть → изменить → показать
el.style.display = 'none'      // убрать из rendering
el.style.width = '200px'       // N изменений — нет reflow
el.style.height = '100px'
el.style.margin = '10px'
el.style.display = 'block'     // показать — один reflow

// 2. Клонировать → изменить → заменить
const clone = el.cloneNode(true)
clone.style.width = '200px'    // изменения на клоне
clone.style.height = '100px'
el.parentNode.replaceChild(clone, el)  // один reflow

// 3. CSS классы вместо прямых стилей
el.classList.add('expanded')   // добавить весь набор стилей за один reflow
// вместо:
el.style.width = '300px'
el.style.height = '200px'
el.style.padding = '20px'
```

<Callout type="tip">
Правило: сначала все операции ЧТЕНИЯ, потом все операции ЗАПИСИ. Никогда не чередуйте. Используйте `fastdom` или `requestAnimationFrame` для правильного планирования.
</Callout>

## Repaint (без Reflow)

Repaint запускается когда меняются визуальные свойства без изменения геометрии:

```javascript
// Только repaint (без reflow):
el.style.color = 'red'
el.style.backgroundColor = '#fff'
el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
el.style.outline = '2px solid blue'

// Без repaint и reflow (только composite):
el.style.transform = 'scale(1.1)'
el.style.opacity = '0.5'
```
