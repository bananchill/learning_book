import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchWithTimeout } from './01-easy-fetch-timeout.js'

describe('fetchWithTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('возвращает Response для успешного запроса', async () => {
    const mockResponse = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

    global.fetch = vi.fn().mockResolvedValue(mockResponse)

    const promise = fetchWithTimeout('https://api.example.com/test', 5000)
    vi.runAllTimers()
    const result = await promise

    expect(result.ok).toBe(true)
  })

  it('бросает ошибку при таймауте', async () => {
    global.fetch = vi.fn().mockImplementation((_url, options) => {
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const error = new DOMException('Aborted', 'AbortError')
          reject(error)
        })
      })
    })

    const promise = fetchWithTimeout('https://slow.api.com', 1000)
    vi.advanceTimersByTime(1001)

    await expect(promise).rejects.toThrow('Timeout')
  })

  it('бросает ошибку при HTTP ошибке (404)', async () => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response('Not Found', { status: 404 })
    )

    const promise = fetchWithTimeout('https://api.example.com/missing')
    vi.runAllTimers()

    await expect(promise).rejects.toThrow('404')
  })

  it('не оставляет активный таймаут после успешного запроса', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
    global.fetch = vi.fn().mockResolvedValue(
      new Response('ok', { status: 200 })
    )

    const promise = fetchWithTimeout('https://api.example.com/fast')
    vi.runAllTimers()
    await promise

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})
