import { describe, it, expect } from 'vitest'
import { canPerform, permissions, type Role, type Action } from './03-easy-record-map'

describe('permissions', () => {
  it('admin имеет все разрешения', () => {
    expect(permissions.admin).toEqual({ read: true, write: true, delete: true })
  })

  it('editor может читать и писать, но не удалять', () => {
    expect(permissions.editor).toEqual({ read: true, write: true, delete: false })
  })

  it('viewer может только читать', () => {
    expect(permissions.viewer).toEqual({ read: true, write: false, delete: false })
  })
})

describe('canPerform', () => {
  it('admin может выполнять любое действие', () => {
    expect(canPerform('admin', 'read')).toBe(true)
    expect(canPerform('admin', 'write')).toBe(true)
    expect(canPerform('admin', 'delete')).toBe(true)
  })

  it('editor может читать и писать', () => {
    expect(canPerform('editor', 'read')).toBe(true)
    expect(canPerform('editor', 'write')).toBe(true)
  })

  it('editor не может удалять', () => {
    expect(canPerform('editor', 'delete')).toBe(false)
  })

  it('viewer может только читать', () => {
    expect(canPerform('viewer', 'read')).toBe(true)
    expect(canPerform('viewer', 'write')).toBe(false)
    expect(canPerform('viewer', 'delete')).toBe(false)
  })
})
