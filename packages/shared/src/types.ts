export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Chapter {
  id: string
  title: string
  description: string
  section: string
  order: number
}

export interface Section {
  id: string
  title: string
  chapters: Chapter[]
}

export interface Task {
  id: string
  title: string
  difficulty: Difficulty
  description: string
  file: string
  testFile: string
  concepts: string[]
  hints: string[]
  estimatedMinutes: number
}

export interface Quiz {
  chapter: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple-choice' | 'true-false' | 'code-output'
  options?: string[]
  correctAnswer: string | number
  explanation: string
}
