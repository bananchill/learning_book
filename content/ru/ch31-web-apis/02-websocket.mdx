import { Callout, DeepDive } from '@book/ui'

# WebSocket

## Базовый WebSocket

```javascript
// Создание соединения
const ws = new WebSocket('wss://ws.example.com/chat')
// wss:// — защищённый WebSocket (аналог https://)
// ws://  — незащищённый (только для localhost!)

// События
ws.onopen = (event) => {
  console.log('Соединение установлено')
  ws.send('Привет, сервер!')
}

ws.onmessage = (event) => {
  console.log('Получено:', event.data)
  const message = JSON.parse(event.data)
}

ws.onerror = (error) => {
  console.error('Ошибка WebSocket:', error)
}

ws.onclose = (event) => {
  console.log(`Соединение закрыто: ${event.code} — ${event.reason}`)
  // event.wasClean — было ли закрытие нормальным
}
```

## Отправка данных

```javascript
// Текст
ws.send('Привет!')

// JSON
ws.send(JSON.stringify({ type: 'message', text: 'Привет!' }))

// Бинарные данные
ws.send(arrayBuffer)
ws.send(blob)

// Состояние соединения
ws.readyState
// WebSocket.CONNECTING = 0
// WebSocket.OPEN = 1
// WebSocket.CLOSING = 2
// WebSocket.CLOSED = 3

// Безопасная отправка только если соединение открыто
function safeSend(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(typeof data === 'string' ? data : JSON.stringify(data))
  }
}
```

## Автоматическое переподключение

```javascript
class ReconnectingWebSocket {
  constructor(url, options = {}) {
    this.url = url
    this.maxRetries = options.maxRetries ?? 5
    this.retryDelay = options.retryDelay ?? 1000
    this.retryCount = 0
    this.handlers = {}
    this.connect()
  }

  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = (e) => {
      this.retryCount = 0  // сбрасываем счётчик
      this.handlers.open?.(e)
    }

    this.ws.onmessage = (e) => {
      this.handlers.message?.(e)
    }

    this.ws.onclose = (e) => {
      this.handlers.close?.(e)
      if (!e.wasClean && this.retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, this.retryCount) // exponential backoff
        this.retryCount++
        console.log(`Переподключение через ${delay}мс (попытка ${this.retryCount})`)
        setTimeout(() => this.connect(), delay)
      }
    }

    this.ws.onerror = (e) => {
      this.handlers.error?.(e)
    }
  }

  on(event, handler) {
    this.handlers[event] = handler
    return this
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  close() {
    this.maxRetries = 0  // отключаем автоматическое переподключение
    this.ws.close(1000, 'Нормальное закрытие')
  }
}
```

<Callout type="info">
Exponential backoff — задержка удваивается при каждой попытке: 1с, 2с, 4с, 8с... Это предотвращает перегрузку сервера при массовых переподключениях.
</Callout>
