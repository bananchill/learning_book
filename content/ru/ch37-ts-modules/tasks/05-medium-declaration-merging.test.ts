import { describe, it, expect } from 'vitest'
import { Color } from './05-medium-declaration-merging'

describe('Color class', () => {
  it('создаётся с r, g, b', () => {
    const color = new Color(255, 128, 0)
    expect(color.r).toBe(255)
    expect(color.g).toBe(128)
    expect(color.b).toBe(0)
  })

  it('toHex() возвращает hex-строку', () => {
    const color = new Color(255, 0, 0)
    expect(color.toHex()).toBe('#ff0000')
  })

  it('toHex() корректно форматирует малые значения', () => {
    const color = new Color(0, 15, 1)
    expect(color.toHex()).toBe('#000f01')
  })

  it('toString() возвращает rgb-строку', () => {
    const color = new Color(100, 200, 50)
    expect(color.toString()).toBe('rgb(100, 200, 50)')
  })
})

describe('Color namespace', () => {
  it('fromHex парсит строку с #', () => {
    const color = Color.fromHex('#ff8000')
    expect(color.r).toBe(255)
    expect(color.g).toBe(128)
    expect(color.b).toBe(0)
  })

  it('fromHex парсит строку без #', () => {
    const color = Color.fromHex('00ff00')
    expect(color.r).toBe(0)
    expect(color.g).toBe(255)
    expect(color.b).toBe(0)
  })

  it('RED — красный цвет', () => {
    expect(Color.RED.r).toBe(255)
    expect(Color.RED.g).toBe(0)
    expect(Color.RED.b).toBe(0)
  })

  it('GREEN — зелёный цвет', () => {
    expect(Color.GREEN.r).toBe(0)
    expect(Color.GREEN.g).toBe(255)
    expect(Color.GREEN.b).toBe(0)
  })

  it('BLUE — синий цвет', () => {
    expect(Color.BLUE.r).toBe(0)
    expect(Color.BLUE.g).toBe(0)
    expect(Color.BLUE.b).toBe(255)
  })

  it('RGB интерфейс работает', () => {
    const rgb: Color.RGB = { r: 10, g: 20, b: 30 }
    expect(rgb.r).toBe(10)
    expect(rgb.g).toBe(20)
    expect(rgb.b).toBe(30)
  })
})

describe('интеграция class + namespace', () => {
  it('fromHex возвращает экземпляр Color', () => {
    const color = Color.fromHex('#abcdef')
    expect(color).toBeInstanceOf(Color)
    expect(color.toHex()).toBe('#abcdef')
  })

  it('предопределённые константы — экземпляры Color', () => {
    expect(Color.RED).toBeInstanceOf(Color)
    expect(Color.RED.toHex()).toBe('#ff0000')
  })
})
