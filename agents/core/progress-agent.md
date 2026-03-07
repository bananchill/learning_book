# ProgressAgent — Progress Tracker

You build the **progress tracking system** — tracks completion of chapters, tasks, quizzes, and interview prep across the entire book.

## Target Package

`packages/core/src/progress/`

## Dependencies

This agent depends on ALL other features. It tracks:
- Chapter reading progress (from page views)
- Task completion (from TaskAgent)
- Quiz scores (from QuizAgent)
- Interview questions reviewed (from InterviewAgent)
- Code walkthrough completed (from WalkthroughAgent)

## FSD Structure

```
packages/core/src/progress/
  ui/
    ProgressTracker.vue        # Overall book progress dashboard
    ChapterProgress.vue        # Single chapter completion card
    ProgressRing.vue           # Circular progress indicator
    StreakCounter.vue           # Learning streak (days in a row)
  model/
    useProgress.ts             # Progress state, localStorage persistence
    progressStore.ts           # Pinia store for global progress
  lib/
    progressTypes.ts           # Local types (ProgressRingProps, StreakData). Shared: import ChapterProgress, BookProgress from @book/shared
    progressCalculator.ts      # Score and completion calculations
  index.ts                     # Public API
```

## Components

### ProgressTracker.vue (Main)
```
┌─ Прогресс ─────────────────────────┐
│                                     │
│  📚 Общий прогресс          45%    │
│  ████████████░░░░░░░░░░░░░░        │
│                                     │
│  🔥 Серия: 5 дней подряд          │
│                                     │
│  ┌─ JavaScript ──────────────────┐ │
│  │  ch01 Замыкания       ████ 80%│ │
│  │  ch02 Прототипы       ██░░ 40%│ │
│  │  ch03 Event Loop      ░░░░  0%│ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌─ Детали: ch01 Замыкания ──────┐ │
│  │  📖 Прочитано    4/5 подглав  │ │
│  │  ✅ Задания      5/7          │ │
│  │  📝 Квиз         4/5 (80%)   │ │
│  │  🎯 Собесед.     2/4          │ │
│  │  🔍 Walkthrough  ✅           │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Props Interface
```ts
interface ProgressTrackerProps {
  sections: Section[]    // From @book/shared
}

// Type to add to @book/shared:
interface Progress {
  chapterId: string
  reading: { completed: string[]; total: number }
  tasks: { completed: string[]; total: number }
  quiz: { score: number; total: number; passed: boolean }
  interview: { reviewed: string[]; total: number }
  walkthrough: { completed: boolean }
  lastActivity: string   // ISO date
}

interface BookProgress {
  chapters: Record<string, Progress>
  streak: { current: number; lastDate: string }
  totalCompletion: number
}
```

## Key Behaviors

1. **Persistent** — all progress saved to `localStorage` via Pinia + `useLocalStorage`
2. **Real-time updates** — progress updates instantly when tasks/quizzes completed
3. **Chapter breakdown** — detailed view per chapter (reading, tasks, quiz, interview)
4. **Section overview** — high-level progress per section (JavaScript, Architecture, etc.)
5. **Streak tracking** — count consecutive days of learning
6. **Visual progress** — rings, bars, percentage indicators
7. **Completion rewards** — visual celebration when chapter 100% complete

## Pinia Store

```ts
// progressStore.ts
export const useProgressStore = defineStore('progress', () => {
  const bookProgress = useLocalStorage<BookProgress>('book-progress', {
    chapters: {},
    streak: { current: 0, lastDate: '' },
    totalCompletion: 0
  })

  function markTaskCompleted(chapterId: string, taskId: string) { ... }
  function saveQuizResult(chapterId: string, score: number, total: number) { ... }
  function markSubchapterRead(chapterId: string, subchapterId: string) { ... }
  function updateStreak() { ... }

  return { bookProgress, markTaskCompleted, saveQuizResult, ... }
})
```

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- Use Pinia store with setup syntax
- Persist via `useLocalStorage` from VueUse
- Import `BaseCard`, `ProgressBar` from `@book/ui`
- Import types from `@book/shared`
- Export `ProgressTracker`, `ChapterProgress`, `useProgress`, `useProgressStore` from `index.ts`
- Shared types (`ChapterProgress`, `BookProgress`) already in `@book/shared` — import, don't redefine

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/progress/ui/ProgressTracker.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/progress/model/progressStore.ts",
      "content": "..."
    },
    {
      "path": "packages/core/src/progress/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "progress.title": "Прогресс",
    "progress.overall": "Общий прогресс",
    "progress.streak": "Серия: {days} дней подряд",
    "progress.reading": "Прочитано",
    "progress.tasks": "Задания",
    "progress.quiz": "Квиз",
    "progress.interview": "Собеседование",
    "progress.walkthrough": "Разбор кода",
    "progress.completed": "Завершено",
    "progress.chapterComplete": "Глава пройдена! 🎉"
  }
}
```
