import { describe, it, expect } from 'vitest'
import { getEventDescription, type MouseAppEvent, type KeyboardAppEvent, type NonMouseAppEvent } from './04-medium-exclude-extract'

describe('getEventDescription', () => {
  it('описывает событие click', () => {
    expect(getEventDescription({ type: 'click', x: 100, y: 200 }))
      .toBe('Клик в (100, 200)')
  })

  it('описывает событие mousemove', () => {
    expect(getEventDescription({ type: 'mousemove', x: 50, y: 75 }))
      .toBe('Движение мыши: (50, 75)')
  })

  it('описывает событие keydown', () => {
    expect(getEventDescription({ type: 'keydown', key: 'Enter', code: 'Enter' }))
      .toBe('Нажата клавиша: Enter')
  })

  it('описывает событие scroll', () => {
    expect(getEventDescription({ type: 'scroll', offset: 350 }))
      .toBe('Прокрутка: 350 px')
  })

  it('описывает событие resize', () => {
    expect(getEventDescription({ type: 'resize', width: 1920, height: 1080 }))
      .toBe('Размер окна: 1920 x 1080')
  })
})

// Проверка типов на уровне компиляции
describe('типы', () => {
  it('MouseAppEvent содержит только click и mousemove', () => {
    const mouseEvent: MouseAppEvent = { type: 'click', x: 0, y: 0 }
    expect(mouseEvent.x).toBe(0)
  })

  it('KeyboardAppEvent содержит только keydown', () => {
    const kbEvent: KeyboardAppEvent = { type: 'keydown', key: 'a', code: 'KeyA' }
    expect(kbEvent.key).toBe('a')
  })

  it('NonMouseAppEvent не содержит click и mousemove', () => {
    const event: NonMouseAppEvent = { type: 'scroll', offset: 100 }
    expect(event.type).toBe('scroll')
  })
})
