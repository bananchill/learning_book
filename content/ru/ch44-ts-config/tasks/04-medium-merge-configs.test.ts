import { describe, it, expect } from 'vitest'
import { mergeConfigs, mergeChain } from './04-medium-merge-configs'

describe('mergeConfigs', () => {
  it('compilerOptions мержатся', () => {
    const base = { compilerOptions: { strict: true, target: 'ES5' } }
    const child = { compilerOptions: { target: 'ES2022' } }
    const result = mergeConfigs(base, child)
    expect(result.compilerOptions).toEqual({ strict: true, target: 'ES2022' })
  })

  it('дочерний добавляет новые опции', () => {
    const base = { compilerOptions: { strict: true } }
    const child = { compilerOptions: { noEmit: true } }
    const result = mergeConfigs(base, child)
    expect(result.compilerOptions).toEqual({ strict: true, noEmit: true })
  })

  it('include заменяется целиком', () => {
    const base = { include: ['src/**/*'] }
    const child = { include: ['lib/**/*'] }
    const result = mergeConfigs(base, child)
    expect(result.include).toEqual(['lib/**/*'])
  })

  it('include из базы сохраняется, если дочерний не указал', () => {
    const base = { include: ['src/**/*'] }
    const child = { compilerOptions: { strict: true } }
    const result = mergeConfigs(base, child)
    expect(result.include).toEqual(['src/**/*'])
  })

  it('files заменяется целиком', () => {
    const base = { files: ['a.ts', 'b.ts'] }
    const child = { files: ['c.ts'] }
    const result = mergeConfigs(base, child)
    expect(result.files).toEqual(['c.ts'])
  })

  it('exclude заменяется целиком', () => {
    const base = { exclude: ['node_modules'] }
    const child = { exclude: ['dist', 'coverage'] }
    const result = mergeConfigs(base, child)
    expect(result.exclude).toEqual(['dist', 'coverage'])
  })

  it('пустой дочерний — сохраняет базовый', () => {
    const base = {
      compilerOptions: { strict: true },
      include: ['src'],
      files: ['index.ts'],
      exclude: ['dist'],
    }
    const result = mergeConfigs(base, {})
    expect(result.compilerOptions).toEqual({ strict: true })
    expect(result.include).toEqual(['src'])
    expect(result.files).toEqual(['index.ts'])
    expect(result.exclude).toEqual(['dist'])
  })

  it('пустой базовый — берёт дочерний', () => {
    const child = {
      compilerOptions: { target: 'ES2022' },
      include: ['lib'],
    }
    const result = mergeConfigs({}, child)
    expect(result.compilerOptions).toEqual({ target: 'ES2022' })
    expect(result.include).toEqual(['lib'])
  })

  it('не мутирует исходные объекты', () => {
    const base = { compilerOptions: { strict: true } }
    const child = { compilerOptions: { target: 'ES2022' } }
    mergeConfigs(base, child)
    expect(base.compilerOptions).toEqual({ strict: true })
    expect(child.compilerOptions).toEqual({ target: 'ES2022' })
  })
})

describe('mergeChain', () => {
  it('один конфиг — возвращает его', () => {
    const config = { compilerOptions: { strict: true } }
    const result = mergeChain([config])
    expect(result.compilerOptions).toEqual({ strict: true })
  })

  it('цепочка из трёх конфигов', () => {
    const root = {
      compilerOptions: { strict: true, target: 'ES5' },
      include: ['src'],
    }
    const mid = {
      compilerOptions: { target: 'ES2020' },
    }
    const leaf = {
      compilerOptions: { target: 'ES2022', noEmit: true },
      include: ['lib'],
    }
    const result = mergeChain([root, mid, leaf])
    expect(result.compilerOptions).toEqual({
      strict: true,
      target: 'ES2022',
      noEmit: true,
    })
    expect(result.include).toEqual(['lib'])
  })

  it('пустой массив — пустой конфиг', () => {
    const result = mergeChain([])
    expect(result).toEqual({})
  })
})
