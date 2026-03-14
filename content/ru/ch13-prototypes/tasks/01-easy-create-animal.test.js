import { describe, it, expect, vi } from 'vitest'
import { createAnimal } from './01-easy-create-animal'

describe('createAnimal', () => {
  it('возвращает объект с правильными свойствами', () => {
    const cat = createAnimal('Мурка', 'Мяу')
    expect(cat.name).toBe('Мурка')
    expect(cat.sound).toBe('Мяу')
  })

  it('speak выводит правильную строку', () => {
    const spy = vi.spyOn(console, 'log')
    const dog = createAnimal('Рекс', 'Гав')
    dog.speak()
    expect(spy).toHaveBeenCalledWith('Рекс говорит: Гав')
    spy.mockRestore()
  })

  it('speak находится в прототипе, а не в самом объекте', () => {
    const cat = createAnimal('Мурка', 'Мяу')
    // speak не должен быть собственным свойством
    expect(Object.hasOwn(cat, 'speak')).toBe(false)
    // но должен быть доступен через прототипную цепочку
    expect(typeof cat.speak).toBe('function')
  })

  it('все животные используют один метод speak из прототипа', () => {
    const cat = createAnimal('Мурка', 'Мяу')
    const dog = createAnimal('Рекс', 'Гав')
    // один и тот же объект функции в прототипе
    expect(Object.getPrototypeOf(cat).speak).toBe(Object.getPrototypeOf(dog).speak)
  })
})
