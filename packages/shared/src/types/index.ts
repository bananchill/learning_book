// Базовые типы
export type { Difficulty, Chapter, Section } from './base'

// Задания
export type { Task } from './task'

// Квиз
export type { Quiz, QuizQuestion, QuizAnswer, QuizScore } from './quiz'

// Code Review
export type { CodeReview, CodeReviewIssue } from './code-review'

// Собеседование
export type { Interview, InterviewQuestion, SelfAssessment } from './interview'

// Пошаговый разбор
export type { Walkthrough, WalkthroughStep } from './walkthrough'

// Прогресс
export type { ChapterProgress, BookProgress, ChapterStatus } from './progress'

// Sandbox
export type { TestResult, ConsoleEntry, SerializableValue } from './sandbox'

// Chat
export type { ChapterContext, ChatMessage } from './chat'

// Конфиг книги
export type {
  BookConfig,
  SectionMeta,
  SubsectionMeta,
  ChapterGroupMeta,
  ChapterMeta,
  SubchapterMeta,
} from './book-config'
