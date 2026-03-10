import { describe, it, expect } from 'vitest'
import { createLeakDetector } from './06-hard-memory-leak'

describe('createLeakDetector', () => {
  it('track и check — отслеживает живые объекты', () => {
    const detector = createLeakDetector()
    const obj1 = { data: 'one' }
    const obj2 = { data: 'two' }

    detector.track('obj1', obj1)
    detector.track('obj2', obj2)

    // Объекты ещё живы
    const alive = detector.check()
    expect(alive).toContain('obj1')
    expect(alive).toContain('obj2')
  })

  it('getLeaked — изначально пустой (ничего не собрано)', () => {
    const detector = createLeakDetector()
    const obj = { data: 'test' }
    detector.track('test', obj)

    // Объект жив — ничего не leaked
    expect(detector.getLeaked()).toEqual([])
  })

  it('перезапись ключа обновляет ссылку', () => {
    const detector = createLeakDetector()
    const obj1 = { data: 'first' }
    const obj2 = { data: 'second' }

    detector.track('key', obj1)
    detector.track('key', obj2)

    const alive = detector.check()
    expect(alive).toContain('key')
    expect(alive.filter(k => k === 'key')).toHaveLength(1)
  })

  it('возвращает массивы', () => {
    const detector = createLeakDetector()
    expect(Array.isArray(detector.check())).toBe(true)
    expect(Array.isArray(detector.getLeaked())).toBe(true)
  })

  it('пустой детектор — пустые массивы', () => {
    const detector = createLeakDetector()
    expect(detector.check()).toEqual([])
    expect(detector.getLeaked()).toEqual([])
  })
})
