import type { Difficulty } from './base'

/** Задание для практики */
export interface Task {
  /** Уникальный идентификатор (e.g., 01-easy-counter) */
  id: string
  /** Название задания */
  title: string
  /** Уровень сложности */
  difficulty: Difficulty
  /** Описание задания */
  description: string
  /** Путь к файлу с кодом */
  file: string
  /** Путь к файлу с тестами */
  testFile: string
  /** Концепции, которые тестирует задание */
  concepts: string[]
  /** Подсказки (3 уровня: направление → подход → решение) */
  hints: string[]
  /** Примерное время выполнения в минутах */
  estimatedMinutes: number
}
