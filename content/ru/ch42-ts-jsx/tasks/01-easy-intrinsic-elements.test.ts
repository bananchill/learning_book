import { describe, it, expect } from 'vitest'
import { createAlertBox } from './01-easy-intrinsic-elements.tsx'

describe('createAlertBox', () => {
  it('создаёт alert-box с обязательным message', () => {
    const result = createAlertBox('Файл сохранён')
    expect(result.tag).toBe('alert-box')
    expect(result.message).toBe('Файл сохранён')
  })

  it('устанавливает severity по умолчанию в "info"', () => {
    const result = createAlertBox('Информация')
    expect(result.severity).toBe('info')
  })

  it('принимает severity "warning"', () => {
    const result = createAlertBox('Внимание!', 'warning')
    expect(result.severity).toBe('warning')
    expect(result.message).toBe('Внимание!')
  })

  it('принимает severity "error"', () => {
    const result = createAlertBox('Ошибка сервера', 'error')
    expect(result.severity).toBe('error')
  })

  it('всегда возвращает tag "alert-box"', () => {
    const r1 = createAlertBox('A')
    const r2 = createAlertBox('B', 'warning')
    const r3 = createAlertBox('C', 'error')
    expect(r1.tag).toBe('alert-box')
    expect(r2.tag).toBe('alert-box')
    expect(r3.tag).toBe('alert-box')
  })
})
