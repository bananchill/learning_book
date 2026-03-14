import { Callout } from '@book/ui'

# Профилирование производительности

## Performance API

```javascript
// Метки времени
performance.mark('fetchStart')
const data = await fetchData()
performance.mark('fetchEnd')

// Измерение между метками
performance.measure('fetchDuration', 'fetchStart', 'fetchEnd')

// Получение результатов
const [measure] = performance.getEntriesByName('fetchDuration')
console.log(`Загрузка заняла: ${measure.duration.toFixed(2)} мс`)

// Очистка
performance.clearMarks('fetchStart')
performance.clearMeasures('fetchDuration')

// Высокоточное время (float, мс от начала документа)
const start = performance.now()
heavyComputation()
console.log(`Вычисление: ${performance.now() - start} мс`)
```

## PerformanceObserver

```javascript
// Наблюдаем за Long Tasks (> 50 мс)
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn(`Long Task: ${entry.duration.toFixed(1)} мс`, entry)
  }
})

observer.observe({ entryTypes: ['longtask'] })

// Наблюдаем за ресурсами
const resourceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.initiatorType === 'fetch') {
      console.log(`Fetch ${entry.name}: ${entry.duration.toFixed(1)} мс`)
    }
  }
})

resourceObserver.observe({ entryTypes: ['resource'] })
```

## Web Vitals — метрики производительности

```javascript
// Largest Contentful Paint (LCP) — когда основной контент загружен
new PerformanceObserver((list) => {
  const entries = list.getEntries()
  const lcp = entries[entries.length - 1]
  console.log('LCP:', lcp.startTime, 'мс')
}).observe({ type: 'largest-contentful-paint', buffered: true })

// First Input Delay (FID) — задержка первого взаимодействия
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('FID:', entry.processingStart - entry.startTime, 'мс')
  }
}).observe({ type: 'first-input', buffered: true })

// Cumulative Layout Shift (CLS) — суммарный сдвиг раскладки
let cumulativeCLS = 0
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      cumulativeCLS += entry.value
    }
  }
}).observe({ type: 'layout-shift', buffered: true })
```

<Callout type="info">
Core Web Vitals — основные метрики Google для оценки UX: LCP < 2.5с (хорошо), FID < 100мс (хорошо), CLS < 0.1 (хорошо). Они влияют на SEO-ранжирование.
</Callout>

## Практические советы по профилированию

```javascript
// 1. Измеряйте реальный код, не предполагайте
console.time('sort')
bigArray.sort()
console.timeEnd('sort')

// 2. Используйте DevTools Performance вкладку
// Нажмите Record, выполните действие, Stop
// Анализируйте Flame Chart, Long Tasks

// 3. Профилируйте в production условиях
// - Включите CPU throttling (6x slowdown)
// - Включите Network throttling (Slow 3G)
// - Тестируйте на реальных мобильных устройствах

// 4. Утилита для измерения функции
function measure(name, fn) {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start
  console.log(`${name}: ${duration.toFixed(2)}мс`)
  return result
}
```
