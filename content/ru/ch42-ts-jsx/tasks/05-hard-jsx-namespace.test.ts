import { describe, it, expect } from 'vitest'
import {
  createElement,
  isVNode,
  countNodes,
  type VNode,
  type FunctionComponent,
} from './05-hard-jsx-namespace.ts'

describe('createElement', () => {
  it('создаёт VNode для intrinsic-элемента без пропсов', () => {
    const node = createElement('div', null)
    expect(node.type).toBe('div')
    expect(node.props).toEqual({})
    expect(node.children).toEqual([])
  })

  it('создаёт VNode с пропсами', () => {
    const node = createElement('button', { disabled: true, className: 'btn' })
    expect(node.type).toBe('button')
    expect(node.props.disabled).toBe(true)
    expect(node.props.className).toBe('btn')
  })

  it('создаёт VNode с children', () => {
    const child = createElement('span', null, 'внутри')
    const node = createElement('div', { className: 'box' }, child, 'текст')
    expect(node.children).toHaveLength(2)
    expect(node.children[0]).toEqual(child)
    expect(node.children[1]).toBe('текст')
  })

  it('вызывает функциональный компонент', () => {
    const Greeting: FunctionComponent<{ name: string }> = (props) => {
      return createElement('span', null, `Привет, ${props.name}!`)
    }

    const node = createElement(Greeting, { name: 'Алиса' })
    expect(node.type).toBe('span')
    expect(node.children).toContain('Привет, Алиса!')
  })

  it('передаёт children в функциональный компонент', () => {
    const Container: FunctionComponent = (props) => {
      return createElement('div', { className: 'container' }, ...(props.children || []))
    }

    const child = createElement('p', null, 'контент')
    const node = createElement(Container, null, child)
    expect(node.type).toBe('div')
    expect(node.children).toContainEqual(child)
  })

  it('обрабатывает null children', () => {
    const node = createElement('div', null, null, 'текст', null)
    expect(node.children).toEqual([null, 'текст', null])
  })

  it('обрабатывает числовые children', () => {
    const node = createElement('span', null, 42)
    expect(node.children).toEqual([42])
  })
})

describe('isVNode', () => {
  it('возвращает true для VNode', () => {
    const node = createElement('div', null)
    expect(isVNode(node)).toBe(true)
  })

  it('возвращает true для VNode от компонента', () => {
    const Comp: FunctionComponent = () => createElement('span', null)
    const node = createElement(Comp, null)
    expect(isVNode(node)).toBe(true)
  })

  it('возвращает false для строки', () => {
    expect(isVNode('text')).toBe(false)
  })

  it('возвращает false для числа', () => {
    expect(isVNode(42)).toBe(false)
  })

  it('возвращает false для null', () => {
    expect(isVNode(null)).toBe(false)
  })

  it('возвращает false для объекта без type', () => {
    expect(isVNode({ props: {}, children: [] })).toBe(false)
  })
})

describe('countNodes', () => {
  it('считает один узел', () => {
    const node = createElement('div', null)
    expect(countNodes(node)).toBe(1)
  })

  it('считает узел с текстовыми children (не VNode)', () => {
    const node = createElement('p', null, 'текст', 42)
    expect(countNodes(node)).toBe(1) // только сам p, строки и числа не считаются
  })

  it('считает вложенные VNode', () => {
    const child1 = createElement('span', null, 'A')
    const child2 = createElement('span', null, 'B')
    const parent = createElement('div', null, child1, child2)
    expect(countNodes(parent)).toBe(3) // div + 2 span
  })

  it('считает глубоко вложенные узлы', () => {
    const leaf = createElement('b', null, 'жирный')
    const mid = createElement('span', null, leaf)
    const root = createElement('div', null, mid)
    expect(countNodes(root)).toBe(3) // div + span + b
  })

  it('игнорирует null children при подсчёте', () => {
    const child = createElement('span', null)
    const node = createElement('div', null, null, child, null)
    expect(countNodes(node)).toBe(2) // div + span
  })
})
