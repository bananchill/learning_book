import { describe, it, expect } from 'vitest'
import { validateProps, createPropsValidator } from './03-medium-component-props.ts'

describe('validateProps', () => {
  it('возвращает valid: true когда все ключи присутствуют', () => {
    const result = validateProps(
      { name: 'Алиса', age: 25 },
      ['name', 'age']
    )
    expect(result.valid).toBe(true)
    if (result.valid) {
      expect(result.props).toEqual({ name: 'Алиса', age: 25 })
    }
  })

  it('возвращает valid: false с отсутствующими ключами', () => {
    const result = validateProps(
      { name: 'Алиса' },
      ['name', 'age', 'email']
    )
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.missing).toContain('age')
      expect(result.missing).toContain('email')
      expect(result.missing).not.toContain('name')
    }
  })

  it('возвращает valid: true для пустого списка обязательных ключей', () => {
    const result = validateProps({ any: 'thing' }, [])
    expect(result.valid).toBe(true)
  })

  it('возвращает valid: false для пустого объекта с обязательными ключами', () => {
    const result = validateProps({}, ['id'])
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.missing).toEqual(['id'])
    }
  })

  it('учитывает ключи со значением undefined как отсутствующие', () => {
    const result = validateProps(
      { name: 'Алиса', age: undefined },
      ['name', 'age']
    )
    expect(result.valid).toBe(false)
    if (!result.valid) {
      expect(result.missing).toContain('age')
    }
  })
})

describe('createPropsValidator', () => {
  it('создаёт валидатор с указанными обязательными ключами', () => {
    const validate = createPropsValidator<{ title: string; count: number }>(['title', 'count'])

    const valid = validate({ title: 'Test', count: 5 })
    expect(valid.valid).toBe(true)

    const invalid = validate({ title: 'Test' })
    expect(invalid.valid).toBe(false)
    if (!invalid.valid) {
      expect(invalid.missing).toEqual(['count'])
    }
  })

  it('повторно использует валидатор для разных объектов', () => {
    const validate = createPropsValidator<{ id: number }>(['id'])

    expect(validate({ id: 1 }).valid).toBe(true)
    expect(validate({ id: 2 }).valid).toBe(true)
    expect(validate({}).valid).toBe(false)
  })
})
