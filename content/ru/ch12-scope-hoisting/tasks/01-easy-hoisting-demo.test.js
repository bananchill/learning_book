import { describe, it, expect } from 'vitest'
import { hoistingDemo } from './01-easy-hoisting-demo'

describe('hoistingDemo', () => {
  it('возвращает массив из 4 элементов', () => {
    const result = hoistingDemo()
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(4)
  })

  it('[0] typeof var до объявления — "undefined"', () => {
    const result = hoistingDemo()
    expect(result[0]).toBe('undefined')
  })

  it('[1] функция доступна до объявления', () => {
    const result = hoistingDemo()
    expect(typeof result[1]).toBe('string')
    expect(result[1].length).toBeGreaterThan(0)
  })

  it('[2] var после объявления возвращает значение', () => {
    const result = hoistingDemo()
    expect(result[2]).not.toBeUndefined()
    expect(result[2]).not.toBe('undefined')
  })

  it('[3] обращение к let до объявления — "TDZ Error"', () => {
    const result = hoistingDemo()
    expect(result[3]).toBe('TDZ Error')
  })
})
