import { describe, it, expect, vi, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

let once
let document

beforeAll(async () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body><button id="btn">Click</button></body></html>')
  document = dom.window.document
  global.document = document
  const mod = await import('./02-easy-once.js')
  once = mod.once
})

describe('once', () => {
  it('вызывает обработчик при первом событии', () => {
    const btn = document.querySelector('#btn')
    const handler = vi.fn()

    once(btn, 'click', handler)
    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('не вызывает обработчик повторно', () => {
    const btn = document.querySelector('#btn')
    const handler = vi.fn()

    once(btn, 'click', handler)

    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))
    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))
    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('передаёт event объект в обработчик', () => {
    const btn = document.querySelector('#btn')
    let receivedEvent = null

    once(btn, 'click', (e) => { receivedEvent = e })
    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(receivedEvent).toBeTruthy()
    expect(receivedEvent.type).toBe('click')
  })

  it('принудительная отписка до срабатывания', () => {
    const btn = document.querySelector('#btn')
    const handler = vi.fn()

    const off = once(btn, 'click', handler)
    off() // отписываемся до первого клика

    btn.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))
    expect(handler).not.toHaveBeenCalled()
  })
})
