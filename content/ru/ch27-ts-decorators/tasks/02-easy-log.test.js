import { describe, it, expect, vi } from 'vitest'
import { log } from './02-easy-log.js'

describe('log decorator', () => {
  it('вызывает оригинальный метод и возвращает результат', () => {
    const descriptor = {
      value: (a, b) => a + b
    }

    const decorated = log('TEST')(null, 'add', descriptor)
    const result = (decorated?.value || descriptor.value)(2, 3)
    expect(result).toBe(5)
  })

  it('логирует вызов с аргументами', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const descriptor = {
      value: (x) => x * 2
    }

    log('PREFIX')(null, 'double', descriptor)
    descriptor.value(5)

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('double')
    )
    consoleSpy.mockRestore()
  })

  it('логирует результат вызова', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const descriptor = {
      value: () => 42
    }

    log('APP')(null, 'getValue', descriptor)
    descriptor.value()

    // Ожидаем что 42 был залогирован
    const calls = consoleSpy.mock.calls.flat().join(' ')
    expect(calls).toContain('42')
    consoleSpy.mockRestore()
  })

  it('использует prefix в логах', () => {
    const consoleSpy = vi.spyOn(console, 'log')

    const descriptor = { value: () => {} }
    log('MYPREFIX')(null, 'method', descriptor)
    descriptor.value()

    const calls = consoleSpy.mock.calls.flat().join(' ')
    expect(calls).toContain('MYPREFIX')
    consoleSpy.mockRestore()
  })
})
