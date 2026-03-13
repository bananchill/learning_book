import { describe, it, expect } from 'vitest'
import { isSuccess, isError, getDataOrDefault } from './05-medium-api-response'
import type { ApiResponse } from './05-medium-api-response'

describe('isSuccess', () => {
  it('возвращает true для успешного ответа', () => {
    const response: ApiResponse<string> = { status: 'success', data: 'hello' }
    expect(isSuccess(response)).toBe(true)
  })

  it('возвращает false для ошибки', () => {
    const response: ApiResponse<string> = { status: 'error', code: 404, message: 'Not found' }
    expect(isSuccess(response)).toBe(false)
  })

  it('возвращает false для загрузки', () => {
    const response: ApiResponse<string> = { status: 'loading' }
    expect(isSuccess(response)).toBe(false)
  })
})

describe('isError', () => {
  it('возвращает true для ошибки', () => {
    const response: ApiResponse<string> = { status: 'error', code: 500, message: 'Server error' }
    expect(isError(response)).toBe(true)
  })

  it('возвращает false для успешного ответа', () => {
    const response: ApiResponse<string> = { status: 'success', data: 'ok' }
    expect(isError(response)).toBe(false)
  })
})

describe('getDataOrDefault', () => {
  it('возвращает данные из успешного ответа', () => {
    const response: ApiResponse<number> = { status: 'success', data: 42 }
    expect(getDataOrDefault(response, 0)).toBe(42)
  })

  it('возвращает значение по умолчанию для ошибки', () => {
    const response: ApiResponse<number> = { status: 'error', code: 404, message: 'Not found' }
    expect(getDataOrDefault(response, 0)).toBe(0)
  })

  it('возвращает значение по умолчанию для загрузки', () => {
    const response: ApiResponse<string> = { status: 'loading' }
    expect(getDataOrDefault(response, 'default')).toBe('default')
  })

  it('работает с объектами', () => {
    type User = { name: string }
    const response: ApiResponse<User> = { status: 'success', data: { name: 'Алекс' } }
    expect(getDataOrDefault(response, { name: 'Аноним' })).toEqual({ name: 'Алекс' })
  })
})
