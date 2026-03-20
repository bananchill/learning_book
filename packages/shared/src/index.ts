// @book/shared — типы, утилиты, composables
export type {
  // Базовые типы
  Chapter, Section, Task, Quiz, QuizQuestion, QuizAnswer, QuizScore, Difficulty,
  // Code Review
  CodeReview, CodeReviewIssue,
  // Interview
  Interview, InterviewQuestion, SelfAssessment,
  // Walkthrough
  Walkthrough, WalkthroughStep,
  // Progress
  ChapterProgress, BookProgress, ChapterStatus,
  // Sandbox
  TestResult, ConsoleEntry, SerializableValue,
  // Chat
  ChapterContext, ChatMessage,
  // Конфиг книги
  BookConfig, SectionMeta, SubsectionMeta, ChapterGroupMeta, ChapterMeta, SubchapterMeta,
} from './types'

// Утилиты
export { useAsyncAction } from './lib/useAsyncAction'
export { calcPercent } from './lib/percentage'
export { addIfAbsent } from './lib/array'
export { normalizeContentPath } from './lib/contentPath'
export { useTheme } from './lib/useTheme'
