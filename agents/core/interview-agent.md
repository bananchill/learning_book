# InterviewAgent — Interview Prep

You build the **interview preparation** feature — cards with questions, expected answers, common mistakes, and follow-ups.

## Target Package

`packages/core/src/interview/`

## FSD Structure

```
packages/core/src/interview/
  ui/
    InterviewPrep.vue          # Main container: list of interview questions
    InterviewQuestion.vue      # Single question card with expandable answer
    InterviewFilter.vue        # Filter by level: junior / middle / senior
  model/
    useInterview.ts            # Interview state: current question, filters
  lib/
    interviewTypes.ts          # Local types (InterviewFilter, InterviewPrepState). Shared: import Interview, InterviewQuestion from @book/shared
  index.ts                     # Public API
```

## Components

### InterviewPrep.vue (Main)
```
┌─ Подготовка к собеседованию ───────┐
│                                     │
│  [Junior]  [Middle]  [Senior]  [Все]│
│                                     │
│  ┌─ Q1 ─────────────────────────┐  │
│  │ 🎯 Junior                    │  │
│  │ Что такое замыкание?         │  │
│  │                               │  │
│  │ [Показать ответ]              │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Q2 ─────────────────────────┐  │
│  │ 🎯 Middle                    │  │
│  │ Как замыкание связано с      │  │
│  │ утечками памяти?             │  │
│  │                               │  │
│  │ ▼ Ответ:                      │  │
│  │ Замыкание удерживает ссылку  │  │
│  │ на весь scope chain...       │  │
│  │                               │  │
│  │ ⚠ Частые ошибки:             │  │
│  │ • Путают с контекстом this   │  │
│  │ • Не знают про WeakRef       │  │
│  │                               │  │
│  │ 🔄 Follow-up:               │  │
│  │ • Как GC обрабатывает        │  │
│  │   замыкания?                 │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Props Interface
```ts
interface InterviewPrepProps {
  interview: Interview   // From @book/shared types
}

// Type to add to @book/shared:
interface Interview {
  chapter: string
  questions: InterviewQuestion[]
}

interface InterviewQuestion {
  id: string
  question: string
  level: 'junior' | 'middle' | 'senior'
  goodAnswer: string
  whatInterviewerWants: string
  commonMistakes: string[]
  followUps: string[]
}
```

### Events
```ts
interface InterviewPrepEmits {
  'question-revealed': [questionId: string]
}
```

## Key Behaviors

1. **Level filtering** — filter by junior / middle / senior
2. **Expandable answers** — click to reveal the good answer
3. **Common mistakes** — highlighted in warning callout
4. **Follow-up questions** — show what interviewer might ask next
5. **What interviewer wants** — meta-info about what makes a good answer
6. **Progress** — track which questions user has reviewed

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- Load data from `interview.json` in chapter directory
- Import `BaseButton`, `BaseCard`, `Callout`, `DifficultyBadge` from `@book/ui`
- Use `useCollapsible` from `@book/ui` for expandable answers
- Export `InterviewPrep` and `useInterview` from `index.ts`
- Shared types (`Interview`, `InterviewQuestion`) already in `@book/shared` — import, don't redefine

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/interview/ui/InterviewPrep.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/interview/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "interview.title": "Подготовка к собеседованию",
    "interview.showAnswer": "Показать ответ",
    "interview.hideAnswer": "Скрыть ответ",
    "interview.whatExpected": "Что ожидает интервьюер",
    "interview.commonMistakes": "Частые ошибки",
    "interview.followUp": "Дополнительные вопросы",
    "interview.all": "Все",
    "interview.junior": "Junior",
    "interview.middle": "Middle",
    "interview.senior": "Senior"
  }
}
```
