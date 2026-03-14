import { Callout, DeepDive } from '@book/ui'

# DocumentFragment и производительность

## Проблема: многократные вставки в DOM

Каждая операция вставки в DOM потенциально вызывает reflow (пересчёт раскладки):

```javascript
const list = document.querySelector('ul')

// МЕДЛЕННО: 1000 reflow
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `Элемент ${i}`
  list.appendChild(li)  // reflow при каждой вставке
}
```

## DocumentFragment — батчинг вставок

```javascript
const list = document.querySelector('ul')

// БЫСТРО: 1 reflow
const fragment = document.createDocumentFragment()

for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `Элемент ${i}`
  fragment.appendChild(li)  // вставка во fragment — нет reflow!
}

list.appendChild(fragment)  // ОДИН reflow для всех элементов
```

<Callout type="info">
`DocumentFragment` — это «виртуальный» контейнер, который не является частью DOM. Добавление элементов в fragment не вызывает reflow. При вставке fragment в DOM все его дети переносятся в DOM за одну операцию.
</Callout>

## Что вызывает reflow и repaint

```javascript
// Чтение геометрических свойств вызывает forced reflow:
const height = el.offsetHeight    // reflow!
const width = el.getBoundingClientRect().width  // reflow!
const scrollTop = el.scrollTop    // reflow!

// Layout thrashing — чередование чтения и записи:
// ПЛОХО:
for (const el of elements) {
  const height = el.offsetHeight  // reflow (чтение)
  el.style.top = height + 'px'   // invalidate layout (запись)
}

// ХОРОШО: сначала все чтения, потом все записи
const heights = elements.map(el => el.offsetHeight)  // все чтения
elements.forEach((el, i) => {
  el.style.top = heights[i] + 'px'  // все записи
})
```

## requestAnimationFrame для батчинга

```javascript
// Все изменения в одном rAF происходят в одном кадре
function updatePositions(elements, positions) {
  requestAnimationFrame(() => {
    elements.forEach((el, i) => {
      el.style.transform = `translateX(${positions[i]}px)`
    })
  })
}

// Накапливаем изменения, применяем в rAF
class DOMBatcher {
  constructor() {
    this.pending = []
    this.scheduled = false
  }

  write(fn) {
    this.pending.push(fn)
    if (!this.scheduled) {
      this.scheduled = true
      requestAnimationFrame(() => {
        this.pending.forEach(f => f())
        this.pending = []
        this.scheduled = false
      })
    }
  }
}

const batcher = new DOMBatcher()
batcher.write(() => div.style.left = '100px')
batcher.write(() => div.style.top = '50px')
// Оба изменения применятся в одном кадре
```

<DeepDive title="Идея виртуального DOM">

React, Vue и другие фреймворки используют «виртуальный DOM» (vDOM) для минимизации реальных DOM-операций:

1. Создают JS-объект, описывающий желаемое состояние DOM
2. После изменений состояния создают новый vDOM
3. Сравнивают (diffing) старый и новый vDOM
4. Находят минимальный набор изменений
5. Применяют только эти изменения к реальному DOM

```javascript
// Упрощённый пример vDOM
const vdom = {
  tag: 'div',
  props: { className: 'container' },
  children: [
    { tag: 'h1', props: {}, children: ['Заголовок'] },
    { tag: 'p', props: {}, children: ['Текст'] }
  ]
}

// При обновлении — только измененные узлы
```

DocumentFragment — это более простое решение той же проблемы: собрать все изменения, потом применить одним разом.
</DeepDive>
