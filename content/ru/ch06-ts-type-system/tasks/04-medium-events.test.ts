import { describe, it, expect } from 'vitest'
import { handleEvent } from './04-medium-events'
import type { ClickEvent, HoverEvent, KeyPressEvent, ScrollEvent } from './04-medium-events'

describe('handleEvent', () => {
  it('обрабатывает click событие', () => {
    const event: ClickEvent = { type: 'click', x: 10, y: 20, button: 'left' }
    expect(handleEvent(event)).toBe('click at (10, 20) left')
  })

  it('обрабатывает click с правой кнопкой', () => {
    const event: ClickEvent = { type: 'click', x: 5, y: 5, button: 'right' }
    expect(handleEvent(event)).toBe('click at (5, 5) right')
  })

  it('обрабатывает hover событие', () => {
    const event: HoverEvent = { type: 'hover', x: 100, y: 200 }
    expect(handleEvent(event)).toBe('hover at (100, 200)')
  })

  it('обрабатывает keypress событие', () => {
    const event: KeyPressEvent = { type: 'keypress', key: 'Enter', ctrlKey: false }
    expect(handleEvent(event)).toBe('keypress: Enter')
  })

  it('обрабатывает keypress с Ctrl', () => {
    const event: KeyPressEvent = { type: 'keypress', key: 'c', ctrlKey: true }
    expect(handleEvent(event)).toBe('keypress: Ctrl+c')
  })

  it('обрабатывает scroll событие', () => {
    const event: ScrollEvent = { type: 'scroll', deltaY: 100, direction: 'down' }
    expect(handleEvent(event)).toBe('scroll down 100')
  })

  it('обрабатывает scroll up', () => {
    const event: ScrollEvent = { type: 'scroll', deltaY: 50, direction: 'up' }
    expect(handleEvent(event)).toBe('scroll up 50')
  })
})
