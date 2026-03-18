import { Callout } from '@book/ui'

# Производительность браузера

Производительность браузера — это понимание того, как браузер рендерит страницы и как JavaScript код влияет на отзывчивость интерфейса.

## Что вы узнаете

- Critical Rendering Path — как браузер строит страницу
- Что вызывает reflow и repaint, как их минимизировать
- requestAnimationFrame для анимаций, requestIdleCallback для фоновых задач
- Performance API для измерения производительности кода

<Callout type="info">
60 кадров в секунду (60 fps) — стандарт для плавных интерфейсов. Это означает, что каждый кадр должен обрабатываться за 16.6 мс. JavaScript, reflow и repaint делят это время.
</Callout>

## Подглавы

1. [Critical Rendering Path](/frontend/browser/ch30-performance/01-critical-rendering-path) — HTML/CSS парсинг, CSSOM, Layout, Paint
2. [Repaint и Reflow](/frontend/browser/ch30-performance/02-repaint-reflow) — что вызывает, batching, layout thrashing
3. [rAF и rIC](/frontend/browser/ch30-performance/03-raf-ric) — requestAnimationFrame, requestIdleCallback
4. [Профилирование](/frontend/browser/ch30-performance/04-profiling) — Performance API, marks, Long Tasks
