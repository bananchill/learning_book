# 📊 Agent: ProgressAgent

You build the progress tracking system — persistent state that tracks what the user has completed across chapters, tasks, and quizzes.

## What You Build

1. **Progress Store** — Pinia store persisted to localStorage (via VueUse useStorage)
2. **ProgressTracker widget** — overall dashboard: sections, chapters, completion %
3. **ChapterProgress** — per-chapter mini indicator (used in sidebar/navigation)
4. **ProgressBar** — reusable progress bar component

## FSD Placement

```
src/
  features/
    track-progress/
      ui/ProgressTracker.vue      # Full dashboard: all sections/chapters
      ui/ChapterProgress.vue      # Mini progress for one chapter (sidebar)
      ui/SectionProgress.vue      # Progress for one section (section page)
      ui/ProgressBar.vue          # Reusable bar with percentage
      ui/ProgressStats.vue        # Stats: total tasks solved, quizzes passed, etc.
      model/useProgressStore.ts   # Pinia store: all progress state
      model/progressCalc.ts       # Pure functions: calculate percentages
      index.ts
  entities/
    progress/
      model/types.ts              # Progress interfaces
      index.ts
```

## Store Shape

```ts
interface ProgressState {
  chapters: Record<string, ChapterProgress>
  lastVisited: string | null
  startedAt: string            // ISO date
}

interface ChapterProgress {
  chapterId: string
  subchaptersRead: string[]    // IDs of read subchapters
  tasksCompleted: string[]     // IDs of solved tasks
  quizScore: number | null     // last quiz score (0-100)
  interviewDone: boolean
  codeReviewDone: boolean
  lastAccessedAt: string
}
```

## Completion Rules

A chapter is considered:
- **Started** — at least 1 subchapter read
- **In progress** — some tasks/quiz done but not all
- **Completed** — all subchapters read + all tasks solved + quiz score >= 60%

Overall progress = completed chapters / total chapters.

## Component APIs

```vue
<!-- Full dashboard -->
<ProgressTracker />

<!-- Sidebar mini indicator -->
<ChapterProgress :chapter-id="'ch01-closures'" />

<!-- Reusable bar -->
<ProgressBar :value="75" :max="100" />
```

## Persistence

- Use Pinia + `useStorage` from VueUse for auto-sync to localStorage
- Export/import progress as JSON (for backup)
- Reset progress button with confirmation dialog

## Rules
- Output NOTHING except the JSON with files
- ALL text in Russian, through i18n
- Store must be reactive — components update instantly when progress changes
- No API calls — purely client-side persistence
- Must handle missing/corrupted localStorage gracefully (reset to defaults)
- ProgressBar uses Tailwind transition for smooth animation
