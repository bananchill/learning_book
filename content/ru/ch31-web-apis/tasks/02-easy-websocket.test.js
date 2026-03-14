import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWebSocket } from './02-easy-websocket.js'

// Мок WebSocket
class MockWebSocket {
  static instances = []

  constructor(url) {
    this.url = url
    this.readyState = 1 // OPEN
    this.handlers = {}
    MockWebSocket.instances.push(this)
  }

  addEventListener(event, handler) {
    this.handlers[event] = handler
  }

  set onopen(fn) { this._onopen = fn }
  set onmessage(fn) { this._onmessage = fn }
  set onclose(fn) { this._onclose = fn }
  set onerror(fn) { this._onerror = fn }

  send(data) { this.lastSent = data }
  close(code, reason) {
    this._onclose?.({ wasClean: code === 1000, code, reason })
  }

  // Имитация получения сообщения
  receiveMessage(data) {
    this._onmessage?.({ data: JSON.stringify(data) })
  }
}

beforeEach(() => {
  MockWebSocket.instances = []
  global.WebSocket = MockWebSocket
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('createWebSocket', () => {
  it('создаёт WebSocket соединение', () => {
    createWebSocket('ws://localhost:8080', () => {})
    expect(MockWebSocket.instances.length).toBe(1)
    expect(MockWebSocket.instances[0].url).toBe('ws://localhost:8080')
  })

  it('вызывает onMessage при получении сообщения', () => {
    const onMessage = vi.fn()
    createWebSocket('ws://localhost:8080', onMessage)

    const ws = MockWebSocket.instances[0]
    ws.receiveMessage({ type: 'hello', text: 'привет' })

    expect(onMessage).toHaveBeenCalledWith({ type: 'hello', text: 'привет' })
  })

  it('send отправляет сообщение', () => {
    const { send } = createWebSocket('ws://localhost:8080', () => {})
    const ws = MockWebSocket.instances[0]

    send({ type: 'message', text: 'текст' })
    expect(ws.lastSent).toBeTruthy()
  })

  it('переподключается при неожиданном закрытии', () => {
    createWebSocket('ws://localhost:8080', () => {})
    const ws = MockWebSocket.instances[0]

    // Неожиданное закрытие (wasClean = false)
    ws._onclose?.({ wasClean: false, code: 1006 })

    vi.advanceTimersByTime(1000)
    expect(MockWebSocket.instances.length).toBe(2)
  })

  it('не переподключается при намеренном close()', () => {
    const { close } = createWebSocket('ws://localhost:8080', () => {})

    close()
    vi.advanceTimersByTime(2000)

    expect(MockWebSocket.instances.length).toBe(1)
  })
})
