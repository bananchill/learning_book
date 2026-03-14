import { describe, it, expect, vi } from 'vitest'
import { createLazyLoader } from './03-medium-lazy-loader.js'

describe('createLazyLoader', () => {
  it('загружает модуль при первом вызове load()', async () => {
    const mockModule = { fn: () => 42 }
    const importFn = vi.fn(async () => mockModule)
    const loader = createLazyLoader(importFn)

    const result = await loader.load()
    expect(result).toBe(mockModule)
    expect(importFn).toHaveBeenCalledTimes(1)
  })

  it('возвращает закэшированный результат при повторных вызовах', async () => {
    const mockModule = { value: 'test' }
    const importFn = vi.fn(async () => mockModule)
    const loader = createLazyLoader(importFn)

    const result1 = await loader.load()
    const result2 = await loader.load()
    const result3 = await loader.load()

    expect(result1).toBe(mockModule)
    expect(result2).toBe(mockModule)
    expect(result3).toBe(mockModule)
    expect(importFn).toHaveBeenCalledTimes(1) // только один раз!
  })

  it('параллельные вызовы вызывают importFn только один раз', async () => {
    const mockModule = { data: [1, 2, 3] }
    const importFn = vi.fn(async () => {
      // Имитируем задержку загрузки
      await new Promise(resolve => setTimeout(resolve, 10))
      return mockModule
    })
    const loader = createLazyLoader(importFn)

    // Запускаем параллельно
    const [a, b, c] = await Promise.all([
      loader.load(),
      loader.load(),
      loader.load()
    ])

    expect(a).toBe(mockModule)
    expect(b).toBe(mockModule)
    expect(c).toBe(mockModule)
    expect(importFn).toHaveBeenCalledTimes(1) // НЕ три раза!
  })

  it('не загружает модуль при создании — только при load()', async () => {
    const importFn = vi.fn(async () => ({}))
    createLazyLoader(importFn) // создаём loader

    // importFn ещё не вызывался
    expect(importFn).not.toHaveBeenCalled()
  })

  it('разные loader-ы независимы', async () => {
    const importFn1 = vi.fn(async () => ({ type: 'A' }))
    const importFn2 = vi.fn(async () => ({ type: 'B' }))

    const loader1 = createLazyLoader(importFn1)
    const loader2 = createLazyLoader(importFn2)

    const r1 = await loader1.load()
    const r2 = await loader2.load()

    expect(r1.type).toBe('A')
    expect(r2.type).toBe('B')
    expect(r1).not.toBe(r2)
  })
})
