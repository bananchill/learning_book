# ❓ Agent: QuizAgent

You build the interactive quiz widget that tests understanding after reading a chapter.

## What You Build

A quiz component supporting multiple question types:
- **Multiple choice** — select one answer
- **True / False** — binary choice
- **Code output** — "what does this code print?" with code block + options
- **Multi-select** — select all correct answers

Each question has an explanation shown after answering. Final score with option to retry.

## FSD Placement

```
src/
  features/
    take-quiz/
      ui/Quiz.vue                 # Main quiz widget
      ui/QuizQuestion.vue         # Single question renderer (delegates by type)
      ui/MultipleChoice.vue       # Multiple choice question
      ui/TrueFalse.vue            # True/false question
      ui/CodeOutput.vue           # Code output question (with syntax-highlighted code)
      ui/MultiSelect.vue          # Multi-select question
      ui/QuizResults.vue          # Final results: score, review, retry
      ui/QuizExplanation.vue      # Explanation shown after answering
      model/useQuiz.ts            # Composable: quiz state, scoring, progress
      lib/quizScoring.ts          # Pure function: calculate score
      index.ts
  entities/
    quiz-question/
      model/types.ts              # QuizQuestion, QuizData interfaces
      index.ts
```

## Component API

```vue
<Quiz
  :data="quizData"
  @complete="handleQuizComplete"
/>
```

### QuizData type (loaded from quiz.json)
```ts
interface QuizData {
  chapter: string
  questions: QuizQuestion[]
}

type QuizQuestion =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | CodeOutputQuestion
  | MultiSelectQuestion

interface MultipleChoiceQuestion {
  id: string
  type: 'multiple_choice'
  question: string
  options: string[]
  correct: number           // index
  explanation: string
}

interface TrueFalseQuestion {
  id: string
  type: 'true_false'
  question: string
  correct: boolean
  explanation: string
}

interface CodeOutputQuestion {
  id: string
  type: 'code_output'
  question: string
  code: string              // syntax-highlighted code block
  options: string[]
  correct: number
  explanation: string
}

interface MultiSelectQuestion {
  id: string
  type: 'multi_select'
  question: string
  options: string[]
  correct: number[]         // array of correct indices
  explanation: string
}
```

## Behavior

1. Questions shown one at a time
2. User selects answer → immediate feedback (correct/incorrect + explanation)
3. Can't change answer after submitting
4. Progress bar at top (question 3 of 5)
5. Final screen: score (e.g., "4 из 5"), review all answers, retry button
6. Correct answers highlighted green, incorrect red, with explanation for each

## Rules
- Output NOTHING except the JSON with files
- ALL text in Russian, through i18n
- Code blocks in CodeOutput questions must be syntax-highlighted (use shared highlight utility or `<pre><code>`)
- Animations on answer reveal (subtle — green/red fade)
- Score saved to progress store
- Accessible: keyboard navigation, focus management
