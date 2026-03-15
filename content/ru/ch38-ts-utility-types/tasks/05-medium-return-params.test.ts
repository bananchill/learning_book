import { describe, it, expect, beforeEach } from 'vitest'
import { withLogging, getLogs, clearLogs } from './05-medium-return-params'

describe('withLogging', () => {
  beforeEach(() => {
    clearLogs()
  })

  it('вызывает оригинальную функцию и возвращает результат', () => {
    const add = (a: number, b: number) => a + b
    const loggedAdd = withLogging('add', add)

    expect(loggedAdd(2, 3)).toBe(5)
  })

  it('логирует вызов с аргументами', () => {
    const greet = (name: string) => `Привет, ${name}!`
    const loggedGreet = withLogging('greet', greet)

    loggedGreet('Алиса')

    const logs = getLogs()
    expect(logs[0]).toBe('Вызов greet с аргументами: Алиса')
  })

  it('логирует результат', () => {
    const multiply = (a: number, b: number) => a * b
    const loggedMultiply = withLogging('multiply', multiply)

    loggedMultiply(4, 5)

    const logs = getLogs()
    expect(logs[1]).toBe('Результат multiply: 20')
  })

  it('работает с функциями без аргументов', () => {
    const getTime = () => 42
    const loggedGetTime = withLogging('getTime', getTime)

    expect(loggedGetTime()).toBe(42)

    const logs = getLogs()
    expect(logs[0]).toBe('Вызов getTime с аргументами: ')
    expect(logs[1]).toBe('Результат getTime: 42')
  })

  it('clearLogs очищает логи', () => {
    const fn = () => 1
    const logged = withLogging('fn', fn)
    logged()
    expect(getLogs().length).toBe(2)

    clearLogs()
    expect(getLogs().length).toBe(0)
  })
})
