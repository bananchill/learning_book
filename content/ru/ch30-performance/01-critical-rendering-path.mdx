import { Callout, DeepDive } from '@book/ui'

# Critical Rendering Path

## Этапы построения страницы

Когда браузер получает HTML, он проходит следующие этапы:

```
HTML → DOM → ┐
              ├─ Render Tree → Layout → Paint → Composite
CSS → CSSOM → ┘
```

**1. Parsing HTML → DOM**: браузер токенизирует HTML и строит дерево DOM-узлов.

**2. Parsing CSS → CSSOM**: все CSS правила компилируются в дерево CSSOM (CSS Object Model).

**3. Render Tree**: DOM + CSSOM объединяются. Исключаются `display: none` элементы и `<head>`.

**4. Layout (Reflow)**: браузер вычисляет геометрию — размеры и позиции всех элементов.

**5. Paint**: браузер рисует пиксели — цвета, тексты, изображения.

**6. Composite**: браузер объединяет слои (layers) в финальное изображение.

## Что блокирует рендеринг

```html
<!-- CSS блокирует рендеринг — браузер ждёт загрузки -->
<link rel="stylesheet" href="styles.css">

<!-- JS по умолчанию блокирует парсинг HTML -->
<script src="app.js"></script>

<!-- НЕ блокирует парсинг HTML -->
<script src="app.js" defer></script>
<script src="app.js" async></script>

<!-- Не блокирует рендеринг (только медиа нужного типа) -->
<link rel="stylesheet" href="print.css" media="print">
```

<Callout type="info">
`defer` — скрипт загружается параллельно, выполняется после парсинга DOM, в порядке в документе. `async` — загружается параллельно, выполняется немедленно после загрузки (порядок не гарантирован). Используйте `defer` для большинства скриптов.
</Callout>

## Compositor Layers — быстрые анимации

Некоторые свойства CSS анимируются без Layout и Paint — только Composite:

```css
/* Эти свойства — только Composite (GPU, быстро): */
transform: translate/scale/rotate
opacity

/* Эти свойства — вызывают Paint (медленнее): */
color, background, box-shadow, border

/* Эти свойства — вызывают Layout + Paint (самые медленные): */
width, height, top, left, margin, padding
```

```javascript
// МЕДЛЕННО: вызывает layout
element.style.left = position + 'px'

// БЫСТРО: только composite (GPU)
element.style.transform = `translateX(${position}px)`
```

<DeepDive title="will-change и создание compositor layers">

```css
/* Создаём отдельный layer заранее (GPU) */
.animated-element {
  will-change: transform; /* браузер заранее создаёт layer */
}

/* Осторожно! Каждый layer — дополнительная память GPU */
/* Не применяйте will-change ко всем элементам */
```

Также: `transform: translateZ(0)` или `transform: translate3d(0,0,0)` — старый хак для создания GPU layer (но `will-change` предпочтительнее).
</DeepDive>
