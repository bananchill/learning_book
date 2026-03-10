import { describe, it, expect } from 'vitest'
import { analyzeCaptures } from './08-hard-context-quiz'

describe('analyzeCaptures', () => {
  it('разделяет переменные на context и stack', () => {
    const result = analyzeCaptures(['x', 'y', 'z'], ['x', 'z'])
    expect(result.context).toEqual(['x', 'z'])
    expect(result.stack).toEqual(['y'])
  })

  it('все переменные захвачены → stack пуст', () => {
    const result = analyzeCaptures(['a', 'b'], ['a', 'b'])
    expect(result.context).toEqual(['a', 'b'])
    expect(result.stack).toEqual([])
  })

  it('ни одна переменная не захвачена → context пуст', () => {
    const result = analyzeCaptures(['a', 'b', 'c'], [])
    expect(result.context).toEqual([])
    expect(result.stack).toEqual(['a', 'b', 'c'])
  })

  it('inner использует переменную, которой нет в outer → игнорируется', () => {
    const result = analyzeCaptures(['x'], ['x', 'globalVar'])
    expect(result.context).toEqual(['x'])
    expect(result.stack).toEqual([])
  })

  it('пустые массивы → пустые результаты', () => {
    const result = analyzeCaptures([], [])
    expect(result.context).toEqual([])
    expect(result.stack).toEqual([])
  })

  it('сохраняет порядок переменных', () => {
    const result = analyzeCaptures(['d', 'c', 'b', 'a'], ['b', 'd'])
    expect(result.context).toEqual(['d', 'b'])
    expect(result.stack).toEqual(['c', 'a'])
  })
})
