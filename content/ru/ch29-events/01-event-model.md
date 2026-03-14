import { Callout, DeepDive } from '@book/ui'

# Модель событий

## addEventListener

```javascript
const btn = document.querySelector('button')

// Базовый синтаксис
btn.addEventListener('click', function(event) {
  console.log('Клик!', event)
})

// Стрелочная функция
btn.addEventListener('click', (e) => {
  console.log(e.type)    // 'click'
  console.log(e.target)  // элемент, на который кликнули
})

// Удаление обработчика (нужна ссылка на ту же функцию!)
function handler(e) { console.log('клик') }
btn.addEventListener('click', handler)
btn.removeEventListener('click', handler)
```

## Event объект

```javascript
document.addEventListener('click', (event) => {
  // Тип события
  event.type           // 'click'

  // Элементы
  event.target         // элемент, на который кликнули
  event.currentTarget  // элемент, к которому привязан обработчик

  // Координаты (для мышиных событий)
  event.clientX        // X от viewport
  event.clientY        // Y от viewport
  event.pageX          // X от начала страницы
  event.pageY          // Y от начала страницы

  // Клавиши (для клавиатурных событий)
  event.key            // 'Enter', 'ArrowLeft', 'a'
  event.code           // 'KeyA', 'ArrowLeft'
  event.ctrlKey        // boolean
  event.shiftKey       // boolean
  event.altKey         // boolean

  // Управление
  event.preventDefault()         // отменить дефолтное действие
  event.stopPropagation()        // остановить всплытие
  event.stopImmediatePropagation() // остановить + другие обработчики на том же элементе
})
```

## Bubbling и Capturing

Большинство событий проходят три фазы:

```
1. Capturing (перехват): document → body → parent → target
2. Target: обработчики на target элементе
3. Bubbling (всплытие): target → parent → body → document
```

```javascript
// По умолчанию: обработчик в фазе bubbling
document.querySelector('.parent').addEventListener('click', (e) => {
  console.log('Bubbling — родитель')
})

// Третий параметр true / { capture: true } — фаза capturing
document.querySelector('.parent').addEventListener('click', (e) => {
  console.log('Capturing — родитель')
}, true)

// Порядок для клика на дочернем элементе:
// Capturing родитель → Handler дочернего → Bubbling родитель
```

<Callout type="info">
Bubbling — событие "всплывает" от дочернего к родительскому. Capturing — "тонет" от корня к цели. Большинство событий bubbable. Исключения: focus, blur, mouseenter, mouseleave.
</Callout>

<DeepDive title="stopPropagation vs stopImmediatePropagation">

```javascript
const btn = document.querySelector('button')

btn.addEventListener('click', (e) => {
  console.log('Обработчик 1')
  e.stopImmediatePropagation() // остановить ВСЕ обработчики на этом элементе
})

btn.addEventListener('click', (e) => {
  console.log('Обработчик 2') // НЕ ВЫПОЛНИТСЯ
})

document.addEventListener('click', () => {
  console.log('Документ') // НЕ ВЫПОЛНИТСЯ (всплытие остановлено)
})

// btn.addEventListener('click', e => e.stopPropagation())
// — остановит всплытие, но второй обработчик на btn всё равно выполнится
```

`stopPropagation` — останавливает всплытие, но другие обработчики на этом же элементе продолжают работать.
`stopImmediatePropagation` — останавливает всё.
</DeepDive>
