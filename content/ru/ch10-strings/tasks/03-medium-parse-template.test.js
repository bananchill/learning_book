import { describe, it, expect } from 'vitest'
import { parseTemplate } from './03-medium-parse-template.js'

describe('parseTemplate', () => {
  it('заменяет один плейсхолдер', () => {
    expect(parseTemplate('Привет, {{name}}!', { name: 'Иван' }))
      .toBe('Привет, Иван!')
  })

  it('заменяет несколько плейсхолдеров', () => {
    expect(parseTemplate('{{a}} + {{b}} = {{sum}}', { a: 1, b: 2, sum: 3 }))
      .toBe('1 + 2 = 3')
  })

  it('оставляет неизвестный плейсхолдер как есть', () => {
    expect(parseTemplate('{{a}} + {{b}} = {{c}}', { a: 1, b: 2 }))
      .toBe('1 + 2 = {{c}}')
  })

  it('работает с числовыми значениями', () => {
    expect(parseTemplate('Возраст: {{age}}', { age: 25 }))
      .toBe('Возраст: 25')
  })

  it('шаблон без плейсхолдеров — возвращает как есть', () => {
    expect(parseTemplate('Привет, мир!', { name: 'Иван' }))
      .toBe('Привет, мир!')
  })

  it('поддерживает вложенные ключи через точку', () => {
    expect(parseTemplate('Привет, {{user.name}}!', { user: { name: 'Мария' } }))
      .toBe('Привет, Мария!')
  })

  it('вложенный ключ не найден — оставляет плейсхолдер', () => {
    expect(parseTemplate('{{user.age}}', { user: {} }))
      .toBe('{{user.age}}')
  })

  it('пустая строка', () => {
    expect(parseTemplate('', { name: 'Иван' })).toBe('')
  })
})
