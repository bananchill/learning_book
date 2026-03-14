import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Timer } from './03-medium-timer'

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('count начинается с 0', () => {
    const t = new Timer(() => {})
    expect(t.count).toBe(0)
  })

  it('start увеличивает count на каждый тик', () => {
    const t = new Timer(() => {})
    t.start()
    vi.advanceTimersByTime(300)
    expect(t.count).toBe(3)
    t.stop()
  })

  it('onTick вызывается с текущим count', () => {
    const ticks: number[] = []
    const t = new Timer((n: number) => ticks.push(n))
    t.start()
    vi.advanceTimersByTime(300)
    t.stop()
    expect(ticks).toEqual([1, 2, 3])
  })

  it('stop останавливает интервал', () => {
    const t = new Timer(() => {})
    t.start()
    vi.advanceTimersByTime(200)
    t.stop()
    vi.advanceTimersByTime(300)
    expect(t.count).toBe(2) // остановился после 200ms
  })

  it('reset сбрасывает count', () => {
    const t = new Timer(() => {})
    t.start()
    vi.advanceTimersByTime(300)
    t.reset()
    expect(t.count).toBe(0)
    // после reset интервал остановлен
    vi.advanceTimersByTime(200)
    expect(t.count).toBe(0)
  })
})
