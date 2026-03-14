import { Callout, DeepDive } from '@book/ui'

# requestAnimationFrame и requestIdleCallback

## requestAnimationFrame (rAF)

`requestAnimationFrame` запускает callback перед следующей перерисовкой браузера:

```javascript
// Анимация через rAF
function animate(timestamp) {
  // timestamp — время в мс от начала документа
  const progress = (timestamp - startTime) / duration

  if (progress < 1) {
    element.style.transform = `translateX(${progress * 200}px)`
    requestAnimationFrame(animate)  // следующий кадр
  } else {
    element.style.transform = 'translateX(200px)'  // финальное значение
  }
}

const startTime = performance.now()
const duration = 1000  // 1 секунда
requestAnimationFrame(animate)
```

<Callout type="info">
rAF вызывается 60 раз в секунду (каждые ~16.6 мс), синхронизируясь с частотой обновления экрана. Если вкладка неактивна — rAF не вызывается (экономит батарею).
</Callout>

## Отмена анимации

```javascript
let animationId = null

function startAnimation() {
  const start = performance.now()

  function frame(timestamp) {
    const elapsed = timestamp - start
    element.style.opacity = Math.min(elapsed / 500, 1)

    if (elapsed < 500) {
      animationId = requestAnimationFrame(frame)
    }
  }

  animationId = requestAnimationFrame(frame)
}

function stopAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
}
```

## requestIdleCallback (rIC)

`requestIdleCallback` запускает задачи во время простоя браузера:

```javascript
// Выполняем не срочную работу, когда браузер свободен
requestIdleCallback((deadline) => {
  console.log('Оставшееся время:', deadline.timeRemaining(), 'мс')
  console.log('Таймаут истёк:', deadline.didTimeout)

  // Обрабатываем элементы пока есть время
  while (deadline.timeRemaining() > 0 && items.length > 0) {
    processItem(items.shift())
  }

  // Если не закончили — продолжим в следующем idle
  if (items.length > 0) {
    requestIdleCallback(processQueue)
  }
}, { timeout: 2000 })  // выполнить максимум через 2 сек (даже если браузер занят)
```

## Когда использовать rAF vs rIC

```javascript
// requestAnimationFrame — для визуальных обновлений:
// - CSS анимации через JS
// - Обновление canvas
// - Любые изменения DOM, которые должны выглядеть плавно
requestAnimationFrame(() => {
  element.style.transform = `translateX(${x}px)`
})

// requestIdleCallback — для фоновых задач:
// - Предзагрузка данных
// - Аналитика
// - Сохранение в localStorage
// - Не срочная обработка данных
requestIdleCallback(() => {
  analytics.send('page_viewed')
  localStorage.setItem('draft', JSON.stringify(data))
})
```

<DeepDive title="Эмуляция requestIdleCallback через rAF">

`requestIdleCallback` не поддерживается в Safari (до iOS 16.4). Простая эмуляция:

```javascript
// Полифил для rIC
window.requestIdleCallback = window.requestIdleCallback || function(fn, options) {
  const start = Date.now()
  return setTimeout(function() {
    fn({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start))
      }
    })
  }, 1)
}
```

Настоящий rIC учитывает реальное состояние браузера. Полифил через setTimeout даёт 50 мс окна — достаточно для большинства задач.
</DeepDive>
