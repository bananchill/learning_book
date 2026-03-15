import { describe, it, expect } from 'vitest'
import {
  normalizeTsConfig,
  getIncludedPatterns,
  isFileExcluded,
} from './01-easy-fix-tsconfig'

describe('normalizeTsConfig', () => {
  it('пустой ввод — дефолтные значения', () => {
    const result = normalizeTsConfig({})
    expect(result.files).toBeNull()
    expect(result.include).toEqual(['**/*'])
    expect(result.exclude).toEqual(['node_modules', 'dist'])
    expect(result.compilerOptions).toEqual({})
  })

  it('files указан — include пуст', () => {
    const result = normalizeTsConfig({
      files: ['src/index.ts', 'src/globals.d.ts'],
    })
    expect(result.files).toEqual(['src/index.ts', 'src/globals.d.ts'])
    expect(result.include).toEqual([])
  })

  it('пустой files — как будто не указан', () => {
    const result = normalizeTsConfig({ files: [] })
    expect(result.files).toBeNull()
    expect(result.include).toEqual(['**/*'])
  })

  it('include указан — используется как есть', () => {
    const result = normalizeTsConfig({ include: ['src/**/*'] })
    expect(result.include).toEqual(['src/**/*'])
  })

  it('exclude указан — используется как есть', () => {
    const result = normalizeTsConfig({ exclude: ['tests/', '**/*.spec.ts'] })
    expect(result.exclude).toEqual(['tests/', '**/*.spec.ts'])
  })

  it('compilerOptions сохраняются', () => {
    const result = normalizeTsConfig({
      compilerOptions: { strict: true, target: 'ES2022' },
    })
    expect(result.compilerOptions).toEqual({ strict: true, target: 'ES2022' })
  })
})

describe('getIncludedPatterns', () => {
  it('files указан — возвращает files', () => {
    const config = {
      files: ['src/index.ts'],
      include: [],
      exclude: [],
      compilerOptions: {},
    }
    expect(getIncludedPatterns(config)).toEqual(['src/index.ts'])
  })

  it('files null — возвращает include', () => {
    const config = {
      files: null,
      include: ['src/**/*'],
      exclude: [],
      compilerOptions: {},
    }
    expect(getIncludedPatterns(config)).toEqual(['src/**/*'])
  })
})

describe('isFileExcluded', () => {
  it('файл в node_modules — исключён', () => {
    expect(isFileExcluded('node_modules/lodash/index.ts', ['node_modules'])).toBe(true)
  })

  it('файл в dist — исключён', () => {
    expect(isFileExcluded('dist/index.js', ['dist'])).toBe(true)
  })

  it('файл в src — не исключён', () => {
    expect(isFileExcluded('src/index.ts', ['node_modules', 'dist'])).toBe(false)
  })

  it('пустой exclude — ничего не исключено', () => {
    expect(isFileExcluded('node_modules/x.ts', [])).toBe(false)
  })
})
