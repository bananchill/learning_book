import { describe, it, expect } from 'vitest'
import { myPartial, myRequired } from './01-easy-partial-required.js'

describe('myPartial', () => {
  it('возвращает копию объекта', () => {
    const user = { name: 'Иван', age: 30 }
    const partial = myPartial(user)
    expect(partial).toEqual(user)
  })

  it('возвращает новый объект (не мутирует)', () => {
    const user = { name: 'Иван', age: 30 }
    const partial = myPartial(user)
    expect(partial).not.toBe(user)
  })

  it('работает с пустым объектом', () => {
    expect(myPartial({})).toEqual({})
  })
})

describe('myRequired', () => {
  it('возвращает объект если все поля определены', () => {
    const user = { name: 'Иван', age: 30 }
    expect(myRequired(user)).toEqual(user)
  })

  it('бросает ошибку если поле undefined', () => {
    const user = { name: 'Иван', age: undefined }
    expect(() => myRequired(user)).toThrow('age')
  })

  it('бросает ошибку для первого undefined поля', () => {
    const obj = { a: 1, b: undefined, c: undefined }
    expect(() => myRequired(obj)).toThrow('b')
  })

  it('null считается определённым значением', () => {
    const obj = { name: null }
    expect(() => myRequired(obj)).not.toThrow()
  })
})
