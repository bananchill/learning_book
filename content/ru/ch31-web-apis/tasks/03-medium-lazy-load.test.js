import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'

let document
let observedElements
let intersectCallback

beforeAll(() => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html><body>
      <img id="img1" data-src="image1.jpg" src="">
      <img id="img2" data-src="image2.jpg" src="">
      <img id="img3" src="loaded.jpg">
    </body></html>
  `)
  document = dom.window.document
  global.document = document
  global.window = dom.window
})

beforeEach(() => {
  observedElements = []

  // Мок IntersectionObserver
  global.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback
      this.options = options
      intersectCallback = callback
    }
    observe(el) { observedElements.push(el) }
    unobserve(el) { observedElements = observedElements.filter(e => e !== el) }
    disconnect() { observedElements = [] }
  }
})

describe('lazyLoad', () => {
  it('наблюдает за всеми img[data-src]', async () => {
    const { lazyLoad } = await import('./03-medium-lazy-load.js')

    // Сбрасываем src перед тестом
    document.querySelector('#img1').src = ''
    document.querySelector('#img2').src = ''

    lazyLoad('img[data-src]')
    expect(observedElements.length).toBe(2)
  })

  it('загружает изображение когда оно появляется в viewport', async () => {
    const { lazyLoad } = await import('./03-medium-lazy-load.js')

    const img1 = document.querySelector('#img1')
    img1.setAttribute('data-src', 'image1.jpg')
    img1.src = ''

    lazyLoad('img[data-src]')

    // Имитируем появление в viewport
    intersectCallback([
      { isIntersecting: true, target: img1 }
    ])

    expect(img1.src).toContain('image1.jpg')
    expect(img1.hasAttribute('data-src')).toBe(false)
  })

  it('не загружает пока элемент не виден', async () => {
    const { lazyLoad } = await import('./03-medium-lazy-load.js')

    const img2 = document.querySelector('#img2')
    img2.setAttribute('data-src', 'image2.jpg')
    img2.src = ''

    lazyLoad('img[data-src]')

    // Элемент не виден
    intersectCallback([
      { isIntersecting: false, target: img2 }
    ])

    expect(img2.src).not.toContain('image2.jpg')
    expect(img2.hasAttribute('data-src')).toBe(true)
  })

  it('возвращает функцию disconnect', async () => {
    const { lazyLoad } = await import('./03-medium-lazy-load.js')
    const disconnect = lazyLoad()
    expect(typeof disconnect).toBe('function')
    expect(() => disconnect()).not.toThrow()
  })
})
