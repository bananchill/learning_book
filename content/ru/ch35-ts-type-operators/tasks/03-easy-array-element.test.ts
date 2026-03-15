import { describe, it, expect } from 'vitest'
import { ROLES, isValidRole, formatRole } from './03-easy-array-element'

describe('ROLES', () => {
  it('содержит три роли', () => {
    expect(ROLES).toHaveLength(3)
  })

  it('содержит admin, editor, viewer', () => {
    expect(ROLES).toContain('admin')
    expect(ROLES).toContain('editor')
    expect(ROLES).toContain('viewer')
  })
})

describe('isValidRole', () => {
  it('возвращает true для валидных ролей', () => {
    expect(isValidRole('admin')).toBe(true)
    expect(isValidRole('editor')).toBe(true)
    expect(isValidRole('viewer')).toBe(true)
  })

  it('возвращает false для невалидных ролей', () => {
    expect(isValidRole('superadmin')).toBe(false)
    expect(isValidRole('moderator')).toBe(false)
    expect(isValidRole('')).toBe(false)
    expect(isValidRole('ADMIN')).toBe(false)
  })
})

describe('formatRole', () => {
  it('возвращает русское название для admin', () => {
    expect(formatRole('admin')).toBe('Администратор')
  })

  it('возвращает русское название для editor', () => {
    expect(formatRole('editor')).toBe('Редактор')
  })

  it('возвращает русское название для viewer', () => {
    expect(formatRole('viewer')).toBe('Читатель')
  })
})
