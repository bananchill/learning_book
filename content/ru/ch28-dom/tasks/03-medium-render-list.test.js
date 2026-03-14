import { describe, it, expect, vi, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

let renderList
let document

beforeAll(async () => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  document = dom.window.document
  global.document = dom.window.document
  const mod = await import('./03-medium-render-list.js')
  renderList = mod.renderList
})

describe('renderList', () => {
  it('отрисовывает элементы в контейнер', () => {
    const container = document.createElement('ul')
    const items = ['яблоко', 'груша', 'банан']

    renderList(container, items, item => {
      const li = document.createElement('li')
      li.textContent = item
      return li
    })

    expect(container.children.length).toBe(3)
    expect(container.children[0].textContent).toBe('яблоко')
    expect(container.children[2].textContent).toBe('банан')
  })

  it('очищает контейнер перед вставкой', () => {
    const container = document.createElement('div')
    container.innerHTML = '<span>старый контент</span>'

    renderList(container, [1, 2], item => {
      const div = document.createElement('div')
      div.textContent = String(item)
      return div
    })

    expect(container.children.length).toBe(2)
    expect(container.querySelector('span')).toBeNull()
  })

  it('работает с пустым массивом', () => {
    const container = document.createElement('div')
    container.innerHTML = '<p>что-то</p>'

    renderList(container, [], () => document.createElement('div'))
    expect(container.children.length).toBe(0)
  })

  it('вызывает renderItem для каждого элемента', () => {
    const container = document.createElement('div')
    const renderItem = vi.fn(item => {
      const el = document.createElement('div')
      el.textContent = String(item)
      return el
    })

    renderList(container, [1, 2, 3], renderItem)
    expect(renderItem).toHaveBeenCalledTimes(3)
    expect(renderItem).toHaveBeenCalledWith(1)
    expect(renderItem).toHaveBeenCalledWith(2)
  })
})
