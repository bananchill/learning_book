import { describe, it, expect } from 'vitest'
import {
  resolvePath,
  matchesPattern,
  extractWildcard,
} from './03-medium-resolve-path'

describe('matchesPattern', () => {
  it('точное совпадение', () => {
    expect(matchesPattern('config', 'config')).toBe(true)
  })

  it('точное совпадение — не совпадает', () => {
    expect(matchesPattern('utils', 'config')).toBe(false)
  })

  it('паттерн с * — совпадает', () => {
    expect(matchesPattern('@utils/date', '@utils/*')).toBe(true)
  })

  it('паттерн с * — не совпадает (другой префикс)', () => {
    expect(matchesPattern('@shared/date', '@utils/*')).toBe(false)
  })

  it('паттерн @/* совпадает с любым путём после @/', () => {
    expect(matchesPattern('@/components/Button', '@/*')).toBe(true)
  })

  it('паттерн с * — вложенный путь', () => {
    expect(matchesPattern('@utils/date/format', '@utils/*')).toBe(true)
  })
})

describe('extractWildcard', () => {
  it('простой путь', () => {
    expect(extractWildcard('@utils/date', '@utils/*')).toBe('date')
  })

  it('вложенный путь', () => {
    expect(extractWildcard('@utils/date/format', '@utils/*')).toBe('date/format')
  })

  it('точное совпадение — пустая строка', () => {
    expect(extractWildcard('config', 'config')).toBe('')
  })

  it('@/ паттерн', () => {
    expect(extractWildcard('@/components/Button', '@/*')).toBe('components/Button')
  })
})

describe('resolvePath', () => {
  const paths = {
    'config': ['./src/config/index.ts'],
    '@/*': ['./src/*'],
    '@utils/*': ['./src/shared/utils/*'],
    '@ui/*': ['./src/shared/ui/*'],
  }

  it('точное совпадение', () => {
    const result = resolvePath('config', paths)
    expect(result).toEqual({
      resolved: './src/config/index.ts',
      pattern: 'config',
    })
  })

  it('паттерн @utils/*', () => {
    const result = resolvePath('@utils/date', paths)
    expect(result).toEqual({
      resolved: './src/shared/utils/date',
      pattern: '@utils/*',
    })
  })

  it('паттерн @ui/*', () => {
    const result = resolvePath('@ui/Button', paths)
    expect(result).toEqual({
      resolved: './src/shared/ui/Button',
      pattern: '@ui/*',
    })
  })

  it('более специфичный паттерн побеждает @/*', () => {
    // "@utils/date" подходит и под "@utils/*" и под "@/*"
    // "@utils/*" более специфичный (длиннее)
    const result = resolvePath('@utils/date', paths)
    expect(result!.pattern).toBe('@utils/*')
  })

  it('@/* для путей без более специфичного паттерна', () => {
    const result = resolvePath('@/components/Button', paths)
    expect(result).toEqual({
      resolved: './src/components/Button',
      pattern: '@/*',
    })
  })

  it('не найден — null', () => {
    const result = resolvePath('lodash', paths)
    expect(result).toBeNull()
  })

  it('вложенный путь', () => {
    const result = resolvePath('@utils/date/format', paths)
    expect(result).toEqual({
      resolved: './src/shared/utils/date/format',
      pattern: '@utils/*',
    })
  })
})
