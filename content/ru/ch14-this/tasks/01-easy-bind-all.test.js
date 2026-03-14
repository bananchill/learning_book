import { describe, it, expect } from 'vitest'
import { bindAll } from './01-easy-bind-all'

describe('bindAll', () => {
  it('методы сохраняют this после деструктуризации', () => {
    const obj = {
      value: 42,
      getValue() { return this.value }
    }

    bindAll(obj)

    const { getValue } = obj
    expect(getValue()).toBe(42) // this сохранён
  })

  it('возвращает тот же объект', () => {
    const obj = { fn() {} }
    expect(bindAll(obj)).toBe(obj)
  })

  it('привязывает несколько методов', () => {
    const obj = {
      name: 'тест',
      a() { return this.name },
      b() { return this.name + '!' }
    }
    bindAll(obj)

    const { a, b } = obj
    expect(a()).toBe('тест')
    expect(b()).toBe('тест!')
  })

  it('не трогает не-методы', () => {
    const obj = {
      value: 99,
      method() { return this.value }
    }
    bindAll(obj)
    expect(obj.value).toBe(99)
  })

  it('методы работают с setTimeout (контекст сохранён)', () => {
    return new Promise(resolve => {
      const obj = {
        result: null,
        capture() { this.result = 'captured' }
      }
      bindAll(obj)
      setTimeout(obj.capture, 0)
      setTimeout(() => {
        expect(obj.result).toBe('captured')
        resolve(undefined)
      }, 10)
    })
  })
})
