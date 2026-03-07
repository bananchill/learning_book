# QuizAgent — Quiz Widget

You build the **quiz system** — interactive assessments that test understanding after reading a chapter.

## Target Package

`packages/core/src/quiz/`

## FSD Structure

```
packages/core/src/quiz/
  ui/
    Quiz.vue               # Main quiz container: renders questions, shows results
    QuizQuestion.vue       # Single question: multiple-choice, true-false, code-output
    QuizResults.vue        # Score + explanations for each question
    QuizProgress.vue       # Progress bar showing question N of M
  model/
    useQuiz.ts             # Quiz state: answers, score, current question
    useQuizTimer.ts        # Optional timer for timed quizzes
  lib/
    quizTypes.ts           # Local types (QuizResult, QuizState, QuizProps). Shared: import Quiz, QuizQuestion from @book/shared
    quizScoring.ts         # Score calculation, grade assignment
  index.ts                 # Public API
```

## Components

### Quiz.vue (Main)
```
┌─ Квиз: Замыкания ─────────────────┐
│                                     │
│  Вопрос 3 из 5           ████░░ 60% │
│                                     │
│  Что выведет этот код?             │
│  ┌──────────────────────────────┐  │
│  │ for (var i = 0; i < 3; i++) │  │
│  │   setTimeout(() =>          │  │
│  │     console.log(i), 100)    │  │
│  └──────────────────────────────┘  │
│                                     │
│  ○ 0, 1, 2                         │
│  ● 3, 3, 3                         │
│  ○ undefined, undefined, undefined │
│  ○ Ошибка                          │
│                                     │
│  [Ответить]                        │
└─────────────────────────────────────┘
```

### Props Interface
```ts
interface QuizProps {
  quiz: Quiz              // From @book/shared types
  showTimer?: boolean     // Show countdown timer
  allowRetry?: boolean    // Allow retaking the quiz
}
```

### Events
```ts
interface QuizEmits {
  'complete': [result: QuizResult]
  'answer': [questionId: string, answer: string | number]
}
```

## Question Types

1. **multiple-choice** — select one from options
2. **true-false** — true or false statement
3. **code-output** — predict code output (shows code block, select answer)

## Key Behaviors

1. **One question at a time** — navigate forward/back
2. **Immediate feedback** — after answering, show correct/incorrect + explanation
3. **Score summary** — at the end, show total score + review all answers
4. **Retry** — can retake the quiz (questions reshuffled)
5. **Progress tracking** — emit results for ProgressAgent to track
6. **Keyboard navigation** — arrow keys, Enter to submit

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- Load quiz data from `quiz.json` in chapter directory
- Use `Quiz`, `QuizQuestion` types from `@book/shared`
- Import UI components from `@book/ui` (`BaseButton`, `BaseCard`, `CodeBlock`)
- Export `Quiz` component and `useQuiz` from `index.ts`

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/quiz/ui/Quiz.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/quiz/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "quiz.title": "Квиз",
    "quiz.question": "Вопрос {current} из {total}",
    "quiz.submit": "Ответить",
    "quiz.next": "Следующий",
    "quiz.previous": "Предыдущий",
    "quiz.finish": "Завершить",
    "quiz.correct": "Правильно!",
    "quiz.incorrect": "Неправильно",
    "quiz.score": "Результат: {score} из {total}",
    "quiz.retry": "Пройти заново"
  }
}
```
