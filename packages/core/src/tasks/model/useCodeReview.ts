import { ref, computed } from 'vue'
import type { CodeReviewIssue } from '@book/shared'

export function useCodeReview(issues: CodeReviewIssue[]) {
  const markedLines = ref<Set<number>>(new Set())
  const isSubmitted = ref(false)

  const foundIssues = computed(() =>
    issues.filter((issue) => markedLines.value.has(issue.line)),
  )

  const missedIssues = computed(() =>
    issues.filter((issue) => !markedLines.value.has(issue.line)),
  )

  const falsePositives = computed(() =>
    [...markedLines.value].filter(
      (line) => !issues.some((issue) => issue.line === line),
    ),
  )

  const score = computed(() => ({
    found: foundIssues.value.length,
    total: issues.length,
  }))

  function toggleLine(line: number) {
    if (isSubmitted.value) return
    const next = new Set(markedLines.value)
    if (next.has(line)) {
      next.delete(line)
    } else {
      next.add(line)
    }
    markedLines.value = next
  }

  function submit() {
    isSubmitted.value = true
  }

  function reset() {
    markedLines.value = new Set()
    isSubmitted.value = false
  }

  return {
    markedLines,
    isSubmitted,
    foundIssues,
    missedIssues,
    falsePositives,
    score,
    toggleLine,
    submit,
    reset,
  }
}
