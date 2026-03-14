import { Callout } from '@book/ui'

# Шпаргалка: Web APIs

## Fetch API

```javascript
// С обработкой ошибок
const res = await fetch('/api/data')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const data = await res.json()

// С таймаутом
const ctrl = new AbortController()
setTimeout(() => ctrl.abort(), 5000)
const res = await fetch(url, { signal: ctrl.signal })
```

## WebSocket

```javascript
const ws = new WebSocket('wss://example.com')
ws.onopen = () => ws.send(JSON.stringify({ type: 'hello' }))
ws.onmessage = (e) => console.log(JSON.parse(e.data))
ws.onclose = (e) => { if (!e.wasClean) reconnect() }
```

## IntersectionObserver

```javascript
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) loadImage(e.target)
  })
}, { rootMargin: '50px' })

imgs.forEach(img => io.observe(img))
```

## ResizeObserver

```javascript
const ro = new ResizeObserver((entries) => {
  entries.forEach(e => {
    const { width } = e.contentRect
    e.target.classList.toggle('compact', width < 600)
  })
})
ro.observe(container)
```

## Storage

```javascript
localStorage.setItem('key', JSON.stringify(data))
JSON.parse(localStorage.getItem('key') || 'null')
localStorage.removeItem('key')
```

<Callout type="info">
fetch не выбрасывает исключение при HTTP ошибках (404, 500). Всегда проверяйте `response.ok`!
</Callout>
