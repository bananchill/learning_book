import { describe, it, expect } from 'vitest'
import { myBind } from './02-easy-my-bind'

describe('myBind', () => {
  it('привязывает this', () => {
    function getName() { return this.name }
    const bound = myBind(getName, { name: 'Алиса' })
    expect(bound()).toBe('Алиса')
  })

  it('передаёт аргументы', () => {
    function add(a, b) { return a + b }
    const bound = myBind(add, null, 1)
    expect(bound(2)).toBe(3)
  })

  it('поддерживает частичное применение', () => {
    function greet(greeting, name) {
      return greeting + ', ' + name + '!'
    }
    const sayHello = myBind(greet, null, 'Привет')
    expect(sayHello('Мир')).toBe('Привет, Мир!')
  })

  it('объединяет preArgs и args', () => {
    function sum(a, b, c) { return a + b + c }
    const addTo10 = myBind(sum, null, 10)
    expect(addTo10(5, 3)).toBe(18)
  })

  it('this нельзя переопределить через call', () => {
    function getX() { return this.x }
    const bound = myBind(getX, { x: 1 })
    // call с другим контекстом — bound должен игнорировать его
    expect(bound.call({ x: 99 })).toBe(1)
  })
})
