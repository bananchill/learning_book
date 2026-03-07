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

// Sandbox — результаты тестов и вывод консоли
export interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'error'
  expected?: unknown
  received?: unknown
  message?: string
  duration: number
}

export interface ConsoleEntry {
  level: 'log' | 'warn' | 'error'
  args: unknown[]
}

// Chat — контекст главы и сообщения
export interface ChapterContext {
  chapterId: string
  title: string
  topic: string
  subchapter?: string
  keyConcepts: string[]
  commonMistakes: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}
