// Задание: создай DTO-типы с помощью Pick и Omit
//
// Дан интерфейс Article. Нужно:
// 1. Создать тип ArticlePreview — только id и title (используй Pick)
// 2. Создать тип CreateArticleDto — без id и createdAt (используй Omit)
// 3. Написать функцию toPreview, которая принимает Article и возвращает ArticlePreview
// 4. Написать функцию createArticle, которая принимает CreateArticleDto и возвращает Article

export interface Article {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
}

// Создай тип ArticlePreview с помощью Pick
export type ArticlePreview = Pick<Article, 'id' | 'title'>

// Создай тип CreateArticleDto с помощью Omit
export type CreateArticleDto = Omit<Article, 'id' | 'createdAt'>

let nextId = 1

export function toPreview(article: Article): ArticlePreview {
  // твой код здесь
  return { id: 0, title: '' }
}

export function createArticle(dto: CreateArticleDto): Article {
  // твой код здесь
  return { id: 0, title: '', content: '', author: '', createdAt: new Date() }
}
