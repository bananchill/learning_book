import { ref, computed } from 'vue'
import type { Quiz, QuizQuestion } from '@book/shared'
import { calculateScore, isAnswerCorrect, type QuizAnswer, type QuizScore } from '../lib/quizScoring'

export function useQuiz(quiz: Quiz) {
  const currentIndex = ref(0)
  const answers = ref<QuizAnswer[]>([])
  const isFinished = ref(false)
  const selectedAnswer = ref<number | number[] | boolean | null>(null)
  const isAnswered = ref(false)

  const currentQuestion = computed<QuizQuestion | null>(
    () => quiz.questions[currentIndex.value] ?? null,
  )

  const totalQuestions = computed(() => quiz.questions.length)

  const score = computed<QuizScore>(() => calculateScore(answers.value))

  const isLastQuestion = computed(
    () => currentIndex.value === quiz.questions.length - 1,
  )

  function submitAnswer() {
    if (selectedAnswer.value === null || isAnswered.value || !currentQuestion.value) return

    const correct = isAnswerCorrect(
      selectedAnswer.value,
      currentQuestion.value.correctAnswer,
    )

    answers.value = [
      ...answers.value,
      {
        questionId: currentQuestion.value.id,
        answer: selectedAnswer.value,
        correct,
      },
    ]

    isAnswered.value = true
  }

  function next() {
    if (!isAnswered.value) return

    if (isLastQuestion.value) {
      isFinished.value = true
    } else {
      currentIndex.value++
      selectedAnswer.value = null
      isAnswered.value = false
    }
  }

  function retry() {
    currentIndex.value = 0
    answers.value = []
    isFinished.value = false
    selectedAnswer.value = null
    isAnswered.value = false
  }

  return {
    currentIndex,
    currentQuestion,
    totalQuestions,
    answers,
    score,
    isFinished,
    isLastQuestion,
    selectedAnswer,
    isAnswered,
    submitAnswer,
    next,
    retry,
  }
}
