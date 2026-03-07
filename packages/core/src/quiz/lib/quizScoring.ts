// Подсчёт результатов квиза

export interface QuizAnswer {
  questionId: string
  answer: number | number[] | boolean
  correct: boolean
}

export interface QuizScore {
  total: number
  correct: number
  percentage: number
}

export function calculateScore(answers: QuizAnswer[]): QuizScore {
  const total = answers.length
  const correct = answers.filter((a) => a.correct).length
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
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
