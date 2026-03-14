import { Callout, DeepDive } from '@book/ui'

# IntersectionObserver и ResizeObserver

## IntersectionObserver — видимость элементов

IntersectionObserver отслеживает пересечение элементов с viewport или другим элементом:

```javascript
// Lazy loading изображений
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // загружаем реальное изображение
      img.removeAttribute('data-src')
      observer.unobserve(img)    // перестаём наблюдать после загрузки
    }
  })
}, {
  rootMargin: '50px'  // начать загрузку за 50px до появления в viewport
})

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img)
})
```

## Параметры IntersectionObserver

```javascript
const observer = new IntersectionObserver(callback, {
  root: null,           // null = viewport, или конкретный элемент
  rootMargin: '0px',   // отступ от root (как padding CSS)
  threshold: 0.5,      // 0..1 — какая часть должна быть видна
  // threshold: [0, 0.25, 0.5, 0.75, 1] — несколько порогов
})

// IntersectionObserverEntry
// entry.isIntersecting   — виден ли элемент
// entry.intersectionRatio — какая доля видна (0..1)
// entry.boundingClientRect — прямоугольник элемента
// entry.rootBounds       — прямоугольник root
// entry.target           — наблюдаемый элемент
```

<Callout type="info">
IntersectionObserver гораздо эффективнее `getBoundingClientRect()` в scroll обработчике. Он работает на другом потоке и не вызывает forced reflow.
</Callout>

## Анимации при появлении

```javascript
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in')
    } else {
      entry.target.classList.remove('animate-in')
    }
  })
}, {
  threshold: 0.1  // начать анимацию когда 10% элемента видно
})

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  animateObserver.observe(el)
})
```

## ResizeObserver — изменение размеров

```javascript
const resizeObserver = new ResizeObserver((entries) => {
  entries.forEach(entry => {
    const { width, height } = entry.contentRect

    console.log(`Элемент изменил размер: ${width}x${height}`)

    // Responsive компоненты
    if (width < 600) {
      entry.target.classList.add('compact')
      entry.target.classList.remove('expanded')
    } else {
      entry.target.classList.add('expanded')
      entry.target.classList.remove('compact')
    }
  })
})

// Наблюдаем за изменениями размера
resizeObserver.observe(document.querySelector('.container'))

// Прекращаем наблюдение
resizeObserver.unobserve(element)
resizeObserver.disconnect()  // прекратить все наблюдения
```

<DeepDive title="MutationObserver — наблюдение за DOM изменениями">

```javascript
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Добавлено:', mutation.addedNodes)
      console.log('Удалено:', mutation.removedNodes)
    }
    if (mutation.type === 'attributes') {
      console.log(`Атрибут ${mutation.attributeName} изменён`)
    }
  })
})

mutationObserver.observe(targetElement, {
  childList: true,        // наблюдать добавление/удаление детей
  subtree: true,          // наблюдать всё поддерево
  attributes: true,       // наблюдать изменения атрибутов
  characterData: true,    // наблюдать изменения текста
})
```
</DeepDive>
