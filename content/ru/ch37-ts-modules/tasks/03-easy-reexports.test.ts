import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isValidTitle,
  formatUserName,
  formatPostTitle,
  Validators,
} from './03-easy-reexports'
import type { User, Post } from './03-easy-reexports'

describe('экспорт типов', () => {
  it('User имеет нужные поля', () => {
    const user: User = { id: 1, name: 'Алиса', email: 'alice@example.com' }
    expect(user.id).toBe(1)
    expect(user.name).toBe('Алиса')
    expect(user.email).toBe('alice@example.com')
  })

  it('Post имеет нужные поля', () => {
    const post: Post = { id: 1, title: 'Привет', authorId: 1 }
    expect(post.id).toBe(1)
    expect(post.title).toBe('Привет')
    expect(post.authorId).toBe(1)
  })
})

describe('isValidEmail', () => {
  it('возвращает true для валидного email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('возвращает false для невалидного email', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })
})

describe('isValidTitle', () => {
  it('возвращает true для валидного заголовка', () => {
    expect(isValidTitle('Привет мир')).toBe(true)
  })

  it('возвращает false для слишком короткого заголовка', () => {
    expect(isValidTitle('AB')).toBe(false)
  })
})

describe('formatUserName', () => {
  it('форматирует имя пользователя', () => {
    const user: User = { id: 1, name: 'Алиса', email: 'alice@example.com' }
    expect(formatUserName(user)).toBe('Алиса <alice@example.com>')
  })
})

describe('formatPostTitle', () => {
  it('форматирует заголовок поста', () => {
    const post: Post = { id: 42, title: 'TypeScript', authorId: 1 }
    expect(formatPostTitle(post)).toBe('#42: TypeScript')
  })
})

describe('Validators namespace-объект', () => {
  it('содержит isValidEmail', () => {
    expect(Validators.isValidEmail('a@b.com')).toBe(true)
  })

  it('содержит isValidTitle', () => {
    expect(Validators.isValidTitle('Привет')).toBe(true)
  })
})
