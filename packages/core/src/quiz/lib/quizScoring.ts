// Подсчёт результатов квиза
import type { QuizAnswer, QuizScore } from '@book/shared'
import { calcPercent } from '@book/shared'

export function calculateScore(answers: QuizAnswer[]): QuizScore {
  const total = answers.length
  const correct = answers.filter((a) => a.correct).length
  const percentage = calcPercent(correct, total)
  return { total, correct, percentage }
}

// Проверка ответа по типу вопроса
export function isAnswerCorrect(
  answer: number | number[] | boolean,
  correctAnswer: number | number[] | boolean | string,
): boolean {
  if (Array.isArray(answer) && Array.isArray(correctAnswer)) {
    return (
      answer.length === correctAnswer.length &&
      answer.every((a) => correctAnswer.includes(a))
    )
  }
  return answer === correctAnswer
}
