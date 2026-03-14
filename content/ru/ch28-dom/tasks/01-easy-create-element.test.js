import { describe, it, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

// Настраиваем JSDOM окружение
beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  global.document = dom.window.document
})

// Импорт после настройки глобалей
let createElement
beforeAll(async () => {
  const mod = await import('./01-easy-create-element.js')
  createElement = mod.createElement
})

describe('createElement', () => {
  it('создаёт элемент с правильным тегом', () => {
    const div = createElement('div')
    expect(div.tagName.toLowerCase()).toBe('div')
  })

  it('устанавливает атрибуты', () => {
    const btn = createElement('button', { type: 'submit', class: 'btn' })
    expect(btn.getAttribute('type')).toBe('submit')
    expect(btn.getAttribute('class')).toBe('btn')
  })

  it('принимает строку как children', () => {
    const p = createElement('p', {}, 'Текст абзаца')
    expect(p.textContent).toBe('Текст абзаца')
  })

  it('принимает массив строк как children', () => {
    const div = createElement('div', {}, ['Привет', ' ', 'мир'])
    expect(div.textContent).toBe('Привет мир')
  })

  it('принимает вложенные элементы', () => {
    const inner = createElement('span', {}, 'Внутренний')
    const outer = createElement('div', {}, [inner])
    expect(outer.querySelector('span')).toBeTruthy()
    expect(outer.querySelector('span').textContent).toBe('Внутренний')
  })

  it('работает без attrs и children', () => {
    expect(() => createElement('div')).not.toThrow()
  })
})
