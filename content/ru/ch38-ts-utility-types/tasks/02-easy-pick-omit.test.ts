import { describe, it, expect } from 'vitest'
import { toPreview, createArticle, type Article, type ArticlePreview, type CreateArticleDto } from './02-easy-pick-omit'

describe('toPreview', () => {
  it('возвращает только id и title', () => {
    const article: Article = {
      id: 1,
      title: 'TypeScript утилиты',
      content: 'Длинный текст...',
      author: 'Алиса',
      createdAt: new Date('2024-01-01')
    }

    const preview = toPreview(article)
    expect(preview).toEqual({ id: 1, title: 'TypeScript утилиты' })
    expect(Object.keys(preview)).toEqual(['id', 'title'])
  })
})

describe('createArticle', () => {
  it('создаёт Article из DTO с id и createdAt', () => {
    const dto: CreateArticleDto = {
      title: 'Новая статья',
      content: 'Содержание статьи',
      author: 'Боб'
    }

    const article = createArticle(dto)
    expect(article.title).toBe('Новая статья')
    expect(article.content).toBe('Содержание статьи')
    expect(article.author).toBe('Боб')
    expect(typeof article.id).toBe('number')
    expect(article.createdAt).toBeInstanceOf(Date)
  })

  it('генерирует уникальные id', () => {
    const dto: CreateArticleDto = {
      title: 'Статья',
      content: 'Текст',
      author: 'Автор'
    }

    const a1 = createArticle(dto)
    const a2 = createArticle(dto)
    expect(a1.id).not.toBe(a2.id)
  })
})
