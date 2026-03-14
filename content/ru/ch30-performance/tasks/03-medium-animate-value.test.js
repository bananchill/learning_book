import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { animateValue } from './03-medium-animate-value.js'

let document
let rafCallbacks = []

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body><span id="counter">0</span></body></html>')
  document = dom.window.document
  global.document = document

  // Мок requestAnimationFrame
  let rafId = 0
  global.requestAnimationFrame = (cb) => {
    rafCallbacks.push(cb)
    return ++rafId
  }
  global.cancelAnimationFrame = vi.fn()
  global.performance = { now: vi.fn(() => Date.now()) }
})

beforeEach(() => {
  rafCallbacks = []
})

function runFrames(count = 1, timePerFrame = 16) {
  let time = Date.now()
  for (let i = 0; i < count; i++) {
    time += timePerFrame
    const cbs = [...rafCallbacks]
    rafCallbacks = []
    cbs.forEach(cb => cb(time))
  }
}

describe('animateValue', () => {
  it('устанавливает начальное значение немедленно', () => {
    const el = document.querySelector('#counter')
    animateValue(el, 0, 100, 1000)
    // После первого кадра значение должно начать обновляться
    runFrames(1, 0)
    expect(parseInt(el.textContent)).toBeGreaterThanOrEqual(0)
  })

  it('устанавливает конечное значение после завершения', () => {
    const el = document.querySelector('#counter')
    el.textContent = '0'
    animateValue(el, 0, 100, 100)
    runFrames(20, 10) // 20 кадров по 10мс = 200мс > 100мс
    expect(el.textContent).toBe('100')
  })

  it('возвращает функцию отмены', () => {
    const el = document.querySelector('#counter')
    const cancel = animateValue(el, 0, 200, 1000)
    expect(typeof cancel).toBe('function')
    expect(() => cancel()).not.toThrow()
  })

  it('значения округляются до целых', () => {
    const el = document.querySelector('#counter')
    animateValue(el, 0, 100, 1000)
    runFrames(5, 20)
    expect(el.textContent).toMatch(/^\d+$/)  // только цифры
  })
})
