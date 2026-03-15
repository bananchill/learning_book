import { describe, it, expect } from 'vitest'
import { findUser, getUserEmail, greetUser } from './05-medium-strict-null'

describe('findUser', () => {
  it('находит существующего пользователя', () => {
    const user = findUser(1)
    expect(user).not.toBeNull()
    expect(user!.name).toBe('Алиса')
  })

  it('возвращает null для несуществующего id', () => {
    expect(findUser(999)).toBeNull()
  })
})

describe('getUserEmail', () => {
  it('возвращает email существующего пользователя', () => {
    expect(getUserEmail(1)).toBe('alice@example.com')
  })

  it('возвращает сообщение для несуществующего', () => {
    expect(getUserEmail(999)).toBe('Пользователь не найден')
  })
})

describe('greetUser', () => {
  it('использует переданное приветствие', () => {
    expect(greetUser('Алиса', 'Здравствуй')).toBe('Здравствуй, Алиса!')
  })

  it('использует "Привет" по умолчанию', () => {
    expect(greetUser('Боб')).toBe('Привет, Боб!')
  })
})
