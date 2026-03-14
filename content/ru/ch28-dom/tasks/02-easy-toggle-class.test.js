import { describe, it, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

let toggleClass
let document

beforeAll(async () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body><div id="test"></div></body></html>')
  document = dom.window.document
  global.document = document
  const mod = await import('./02-easy-toggle-class.js')
  toggleClass = mod.toggleClass
})

function makeEl(classes = '') {
  const el = document.createElement('div')
  if (classes) el.className = classes
  return el
}

describe('toggleClass', () => {
  it('добавляет класс если его нет', () => {
    const el = makeEl()
    toggleClass(el, 'active')
    expect(el.classList.contains('active')).toBe(true)
  })

  it('удаляет класс если он есть', () => {
    const el = makeEl('active')
    toggleClass(el, 'active')
    expect(el.classList.contains('active')).toBe(false)
  })

  it('возвращает true при добавлении', () => {
    const el = makeEl()
    expect(toggleClass(el, 'active')).toBe(true)
  })

  it('возвращает false при удалении', () => {
    const el = makeEl('active')
    expect(toggleClass(el, 'active')).toBe(false)
  })

  it('force=true только добавляет', () => {
    const el = makeEl('active')
    toggleClass(el, 'active', true)
    expect(el.classList.contains('active')).toBe(true)
  })

  it('force=false только удаляет', () => {
    const el = makeEl()
    toggleClass(el, 'active', false)
    expect(el.classList.contains('active')).toBe(false)
  })

  it('не затрагивает другие классы', () => {
    const el = makeEl('btn primary')
    toggleClass(el, 'active')
    expect(el.classList.contains('btn')).toBe(true)
    expect(el.classList.contains('primary')).toBe(true)
  })
})
