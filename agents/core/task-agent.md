# TaskAgent — Tasks & Code Review

You build the **task system** — coding exercises with progressive hints, test validation, and code review exercises.

## Target Package

`packages/core/src/tasks/`

## Dependencies

- **SandboxAgent** — TaskView embeds `CodeSandbox` from `@book/core` sandbox module. Import it, don't rebuild.

## FSD Structure

```
packages/core/src/tasks/
  ui/
    TaskList.vue           # List of tasks with difficulty badges and completion status
    TaskView.vue           # Single task: description + CodeSandbox + hints
    HintSystem.vue         # Progressive hints (3 levels)
    CodeReview.vue         # "Find the bugs" task type
    CodeReviewIssue.vue    # Single issue in code review
  model/
    useTasks.ts            # Task state: current task, completion, hints revealed
    useHints.ts            # Hint progression logic
    useCodeReview.ts       # Code review state and scoring
  lib/
    taskTypes.ts           # Local types (TaskListProps, TaskViewProps, HintLevel, CodeReviewProps). Shared: import Task, CodeReview from @book/shared
    taskScoring.ts         # Completion scoring
  index.ts                 # Public API
```

## Components

### TaskList.vue
```
┌─ Задания: Замыкания ───────────────┐
│                                     │
│  🟢 Easy                           │
│  ├─ ✅ Простой счётчик        5мин │
│  ├─ ⬜ Функция once          5мин │
│  └─ ⬜ Приватные переменные   8мин │
│                                     │
│  🟡 Medium                         │
│  ├─ ⬜ Мемоизация            10мин │
│  └─ ⬜ Каррирование          12мин │
│                                     │
│  🔴 Hard                           │
│  ├─ ⬜ Event Emitter         20мин │
│  └─ ⬜ Middleware Pipeline   25мин │
│                                     │
│  📝 Code Review                    │
│  └─ ⬜ Найди проблемы             │
└─────────────────────────────────────┘
```

### TaskView.vue
```
┌─ Задание: Простой счётчик ─────────┐
│                                     │
│  Создай функцию createCounter,     │
│  которая возвращает объект...      │
│                                     │
│  ┌─ CodeSandbox ────────────────┐  │
│  │ (from SandboxAgent)          │  │
│  └──────────────────────────────┘  │
│                                     │
│  [💡 Подсказка 1/3]  [🤖 AI Chat] │
└─────────────────────────────────────┘
```

### HintSystem.vue
3-level progressive hints:
1. **Direction** — general direction ("Подумай, где объявить переменную...")
2. **Approach** — specific approach ("Функция должна возвращать объект с методами...")
3. **Near-solution** — almost the answer ("let count = 0; return { increment() { ... } }")

### CodeReview.vue
```
┌─ Code Review: Найди проблемы ──────┐
│                                     │
│  ┌─ Код с ошибками ─────────────┐  │
│  │ 1: function loadData() {     │  │
│  │ 2:   const cache = []        │  │
│  │ 3:   return function(id) {   │  │
│  │ 4:     cache.push(fetch(id)) │  │
│  │ 5:     // ...                │  │
│  └──────────────────────────────┘  │
│                                     │
│  Найдено: 1 / 3 проблем            │
│                                     │
│  ✅ Строка 4: Утечка памяти        │
│  ⬜ ???                             │
│  ⬜ ???                             │
│                                     │
│  [Показать все]                    │
└─────────────────────────────────────┘
```

## Props Interfaces

```ts
interface TaskListProps {
  tasks: Task[]            // From @book/shared
  completedIds: string[]   // Already completed task IDs
}

interface TaskViewProps {
  task: Task               // From @book/shared
  initialCode: string      // Starter code
  testCode: string         // Test file content
}

interface CodeReviewProps {
  id: string
  title: string
  code: string
  issues: CodeReviewIssue[]
}
```

## Key Behaviors

1. **Task list** — grouped by difficulty, shows completion status
2. **Sandbox integration** — CodeSandbox embedded in TaskView
3. **Hints** — progressive reveal, each click shows next level
4. **Code review** — user clicks on lines to identify issues
5. **Progress** — track completed tasks, emit for ProgressAgent
6. **AI Chat link** — button to open chat with task context

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- Import `CodeSandbox` from sandbox module: `import { CodeSandbox } from '../sandbox'`
- Import `DifficultyBadge`, `BaseButton`, `BaseCard` from `@book/ui`
- Use `Task` type from `@book/shared`
- Load task data from `_tasks.json` in chapter directory
- Export `TaskList`, `TaskView`, `CodeReview`, `useTasks` from `index.ts`

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/tasks/ui/TaskList.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/tasks/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "task.title": "Задания",
    "task.hint": "Подсказка {current} из {total}",
    "task.showHint": "Показать подсказку",
    "task.completed": "Выполнено",
    "task.estimatedTime": "{minutes} мин",
    "task.codeReview": "Code Review",
    "task.findIssues": "Найди проблемы",
    "task.issuesFound": "Найдено: {found} из {total} проблем",
    "task.showAll": "Показать все",
    "task.askAI": "Спросить AI"
  }
}
```
