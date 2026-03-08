import { describe, it, expect } from 'vitest'
import { createInlineWorker } from './01-easy-create-worker'

describe('createInlineWorker', () => {
  it('создаёт Worker из строки кода', () => {
    const worker = createInlineWorker('self.onmessage = () => {}')
    expect(worker).toBeInstanceOf(Worker)
    worker.terminate()
  })

  it('воркер выполняет переданный код', async () => {
    const worker = createInlineWorker(`
      self.onmessage = (e) => {
        self.postMessage(e.data * 2)
      }
    `)
    const result = await new Promise((resolve) => {
      worker.onmessage = (e) => resolve(e.data)
      worker.postMessage(21)
    })
    expect(result).toBe(42)
    worker.terminate()
  })

  it('воркер может обрабатывать несколько сообщений', async () => {
    const worker = createInlineWorker(`
      self.onmessage = (e) => {
        self.postMessage(e.data + '!')
      }
    `)
    const results = []
    worker.onmessage = (e) => results.push(e.data)

    worker.postMessage('hello')
    worker.postMessage('world')

    await new Promise((r) => setTimeout(r, 50))
    expect(results).toEqual(['hello!', 'world!'])
    worker.terminate()
  })
})
