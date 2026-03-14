import { describe, it, expect, vi, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

let on
let document

beforeAll(async () => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html><body>
      <ul id="list">
        <li class="item" data-id="1"><span>Элемент 1</span></li>
        <li class="item" data-id="2">Элемент 2</li>
        <li class="item" data-id="3">Элемент 3</li>
      </ul>
    </body></html>
  `)
  document = dom.window.document
  global.document = document
  const mod = await import('./01-easy-delegate.js')
  on = mod.on
})

describe('on (delegated handler)', () => {
  it('вызывает обработчик при клике на дочерний элемент', () => {
    const list = document.querySelector('#list')
    const handler = vi.fn()

    on(list, 'click', '.item', handler)

    const item = document.querySelector('.item')
    item.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('не вызывает обработчик для элементов не подходящих под selector', () => {
    const list = document.querySelector('#list')
    const handler = vi.fn()

    on(list, 'click', '.active', handler)

    const item = document.querySelector('.item')
    item.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('возвращает функцию отписки', () => {
    const list = document.querySelector('#list')
    const handler = vi.fn()

    const off = on(list, 'click', '.item', handler)

    // Отписываемся
    off()

    const item = document.querySelector('.item')
    item.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('работает с кликом на вложенный элемент (span внутри li)', () => {
    const list = document.querySelector('#list')
    const handler = vi.fn()

    on(list, 'click', '.item', handler)

    // Кликаем на span внутри li
    const span = document.querySelector('.item span')
    span.dispatchEvent(new document.defaultView.MouseEvent('click', { bubbles: true }))

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
