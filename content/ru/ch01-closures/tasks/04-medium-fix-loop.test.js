import { describe, it, expect } from 'vitest'
import { fixWithLet, fixWithIIFE, fixWithHelper } from './04-medium-fix-loop'

describe('fix loop closure', () => {
  it('fixWithLet возвращает [0, 1, 2, 3, 4]', () => {
    expect(fixWithLet()).toEqual([0, 1, 2, 3, 4])
  })

  it('fixWithIIFE возвращает [0, 1, 2, 3, 4]', () => {
    expect(fixWithIIFE()).toEqual([0, 1, 2, 3, 4])
  })

  it('fixWithHelper возвращает [0, 1, 2, 3, 4]', () => {
    expect(fixWithHelper()).toEqual([0, 1, 2, 3, 4])
  })
})
