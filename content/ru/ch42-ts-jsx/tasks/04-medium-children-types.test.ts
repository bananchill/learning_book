import { describe, it, expect } from 'vitest'
import {
  isTextChildren,
  isSingleElement,
  renderList,
} from './04-medium-children-types.ts'

describe('isTextChildren', () => {
  it('возвращает true для строки', () => {
    expect(isTextChildren('Привет')).toBe(true)
  })

  it('возвращает true для пустой строки', () => {
    expect(isTextChildren('')).toBe(true)
  })

  it('возвращает false для числа', () => {
    expect(isTextChildren(42)).toBe(false)
  })

  it('возвращает false для объекта', () => {
    expect(isTextChildren({ type: 'span', props: {} })).toBe(false)
  })

  it('возвращает false для null', () => {
    expect(isTextChildren(null)).toBe(false)
  })
})

describe('isSingleElement', () => {
  it('возвращает true для корректного SimpleElement', () => {
    expect(isSingleElement({ type: 'div', props: {} })).toBe(true)
  })

  it('возвращает true для элемента с пропсами', () => {
    expect(isSingleElement({ type: 'span', props: { className: 'bold' } })).toBe(true)
  })

  it('возвращает false для строки', () => {
    expect(isSingleElement('text')).toBe(false)
  })

  it('возвращает false для объекта без type', () => {
    expect(isSingleElement({ props: {} })).toBe(false)
  })

  it('возвращает false для объекта без props', () => {
    expect(isSingleElement({ type: 'div' })).toBe(false)
  })

  it('возвращает false для null', () => {
    expect(isSingleElement(null)).toBe(false)
  })

  it('возвращает false если type не строка', () => {
    expect(isSingleElement({ type: 123, props: {} })).toBe(false)
  })
})

describe('renderList', () => {
  it('рендерит список строк через render-prop', () => {
    const result = renderList({
      items: ['Алиса', 'Боб'],
      children: (name) => ({ type: 'li', props: { children: name } }),
    })
    expect(result).toEqual([
      { type: 'li', props: { children: 'Алиса' } },
      { type: 'li', props: { children: 'Боб' } },
    ])
  })

  it('рендерит список чисел', () => {
    const result = renderList({
      items: [1, 2, 3],
      children: (n) => ({ type: 'span', props: { children: n * 2 } }),
    })
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ type: 'span', props: { children: 2 } })
    expect(result[2]).toEqual({ type: 'span', props: { children: 6 } })
  })

  it('возвращает пустой массив для пустого списка', () => {
    const result = renderList({
      items: [],
      children: () => ({ type: 'div', props: {} }),
    })
    expect(result).toEqual([])
  })

  it('рендерит объекты через render-prop', () => {
    const users = [
      { id: 1, name: 'Алиса' },
      { id: 2, name: 'Боб' },
    ]
    const result = renderList({
      items: users,
      children: (user) => ({
        type: 'div',
        props: { key: user.id, children: user.name },
      }),
    })
    expect(result).toHaveLength(2)
    expect(result[0].props.children).toBe('Алиса')
    expect(result[1].props.key).toBe(2)
  })
})
