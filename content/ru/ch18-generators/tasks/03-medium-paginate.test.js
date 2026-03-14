import { describe, it, expect, vi } from 'vitest'
import { paginate } from './03-medium-paginate.js'

// Вспомогательная функция для сбора всех страниц
async function collectPages(gen) {
  const pages = []
  for await (const page of gen) {
    pages.push(page)
  }
  return pages
}

describe('paginate', () => {
  it('загружает все страницы пока fetchFn возвращает данные', async () => {
    const mockFetch = vi.fn(async (page, size) => {
      if (page > 3) return []
      return Array.from({ length: size }, (_, i) => (page - 1) * size + i + 1)
    })

    const pages = await collectPages(paginate(mockFetch, 5))
    expect(pages).toEqual([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15]
    ])
    expect(mockFetch).toHaveBeenCalledTimes(4) // 3 с данными + 1 пустая
  })

  it('останавливается сразу если первая страница пуста', async () => {
    const mockFetch = vi.fn(async () => [])
    const pages = await collectPages(paginate(mockFetch, 10))
    expect(pages).toEqual([])
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('останавливается когда страница содержит меньше элементов чем pageSize', async () => {
    const mockFetch = vi.fn(async (page, size) => {
      if (page === 1) return Array.from({ length: size }, (_, i) => i + 1)
      return [101] // неполная страница
    })

    const pages = await collectPages(paginate(mockFetch, 5))
    expect(pages).toHaveLength(2)
    expect(pages[1]).toEqual([101]) // неполная страница включается
  })

  it('передаёт правильный номер страницы и размер', async () => {
    const calls = []
    const mockFetch = vi.fn(async (page, size) => {
      calls.push({ page, size })
      if (page >= 2) return []
      return [1, 2, 3]
    })

    await collectPages(paginate(mockFetch, 3))
    expect(calls[0]).toEqual({ page: 1, size: 3 })
    expect(calls[1]).toEqual({ page: 2, size: 3 })
  })

  it('является async-генератором', async () => {
    const mockFetch = async (page) => page === 1 ? ['a', 'b'] : []
    const gen = paginate(mockFetch, 2)
    const first = await gen.next()
    expect(first).toEqual({ value: ['a', 'b'], done: false })
    const second = await gen.next()
    expect(second.done).toBe(true)
  })
})
