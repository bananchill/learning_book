import { ref, computed } from 'vue'
import type { Interview, InterviewQuestion, SelfAssessment } from '@book/shared'

export function useInterview(data: Interview) {
  const revealedIds = ref<Set<string>>(new Set())
  const assessments = ref<Record<string, SelfAssessment>>({})

  const questions = computed(() => data.questions)

  const reviewedCount = computed(() => revealedIds.value.size)
  const totalCount = computed(() => data.questions.length)

  function reveal(questionId: string) {
    revealedIds.value = new Set([...revealedIds.value, questionId])
  }

  function isRevealed(questionId: string) {
    return revealedIds.value.has(questionId)
  }

  function assess(questionId: string, assessment: SelfAssessment) {
    assessments.value = { ...assessments.value, [questionId]: assessment }
  }

  function getAssessment(questionId: string): SelfAssessment | null {
    return assessments.value[questionId] ?? null
  }

  function reset() {
    revealedIds.value = new Set()
    assessments.value = {}
  }

  return {
    questions,
    reviewedCount,
    totalCount,
    reveal,
    isRevealed,
    assess,
    getAssessment,
    reset,
  }
}
