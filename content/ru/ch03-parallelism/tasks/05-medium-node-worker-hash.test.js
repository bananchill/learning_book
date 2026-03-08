import { describe, it, expect } from 'vitest'
import crypto from 'node:crypto'
import { hashInWorker } from './05-medium-node-worker-hash'

describe('hashInWorker', () => {
  it('вычисляет SHA-256 хеш', async () => {
    const text = 'hello world'
    const expected = crypto.createHash('sha256').update(text).digest('hex')
    const result = await hashInWorker(text, 'sha256')
    expect(result).toBe(expected)
  })

  it('вычисляет MD5 хеш', async () => {
    const text = 'test string'
    const expected = crypto.createHash('md5').update(text).digest('hex')
    const result = await hashInWorker(text, 'md5')
    expect(result).toBe(expected)
  })

  it('возвращает промис', () => {
    const result = hashInWorker('data')
    expect(result).toBeInstanceOf(Promise)
  })

  it('по умолчанию использует sha256', async () => {
    const text = 'default algo'
    const expected = crypto.createHash('sha256').update(text).digest('hex')
    const result = await hashInWorker(text)
    expect(result).toBe(expected)
  })
})
