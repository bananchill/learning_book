# Stack Context — Prepend to ALL Core Agents

You are building components for an **interactive learning book** monorepo.

## Tech Stack

- **Vue 3** — Composition API, `<script setup lang="ts">`, NO Options API
- **TypeScript** — strict mode, all props/emits typed
- **Tailwind CSS** — utility-first, NO custom CSS files, NO `<style>` blocks
- **Pinia** — state management (defineStore, setup syntax)
- **VueUse** — composables (useLocalStorage, useDebounceFn, etc.)
- **vue-i18n** — all user-facing text via `useI18n()` / `$t()`. NEVER hardcode strings
- **Vitest** + **@vue/test-utils** + **@testing-library/vue** — testing
- **Vite** — build tool

## Monorepo Structure

```
apps/
  book/          → @book/app    (main frontend, Vue)
  admin/         → @book/admin  (content management, Vue)
  api/           → @book/api    (backend, Node)

packages/
  core/          → @book/core   (learning engine: sandbox, chat, quiz, tasks, etc.)
  ui/            → @book/ui     (shared UI components)
  i18n/          → @book/i18n   (localization)
  shared/        → @book/shared (types, utils, composables)
```

### Dependency Graph

```
@book/app   → @book/core → @book/ui → @book/shared
@book/admin → @book/core    @book/i18n → @book/shared
@book/api (standalone)
```

### Cross-Package Imports

```ts
import { CodeSandbox, AIChat, Quiz } from '@book/core'
import { DeepDive, Callout, CodeBlock } from '@book/ui'
import { useI18n } from '@book/i18n'
import type { Chapter, Task } from '@book/shared'
```

**NEVER** import from another package's `src/` internals. Only through `index.ts`.

## FSD (Feature-Sliced Design)

Applies inside `apps/book/src/` and within each feature in `packages/core/src/`:

```
app/ → pages/ → widgets/ → features/ → entities/ → shared/
```

Import rule: only left-to-right, never reverse.

Each feature slice inside `packages/core/src/<feature>/`:
```
<feature>/
  ui/          # Vue components (.vue files)
  model/       # Composables, stores, business logic
  lib/         # Helpers, pure functions, LOCAL types
  api/         # API calls
  index.ts     # Public API — ONLY export from here
```

## Existing Shared Types (`@book/shared`)

Types organized in `packages/shared/src/types/` — one file per domain:

| File | Types |
|------|-------|
| `base.ts` | `Difficulty`, `Chapter`, `Section` |
| `task.ts` | `Task` |
| `quiz.ts` | `Quiz`, `QuizQuestion` |
| `code-review.ts` | `CodeReview`, `CodeReviewIssue` |
| `interview.ts` | `Interview`, `InterviewQuestion` |
| `walkthrough.ts` | `Walkthrough`, `WalkthroughStep` |
| `progress.ts` | `ChapterProgress`, `BookProgress` |
| `sandbox.ts` | `TestResult` |

Import:
```ts
import type { Chapter, Task, Quiz, TestResult } from '@book/shared'
```

## Type Decision Protocol

When your feature needs a TypeScript type, follow this protocol:

### Step 1: Check `@book/shared`

Search `packages/shared/src/types/` for the type. If it exists — import it:
```ts
import type { Task, Quiz } from '@book/shared'
```

### Step 2: Decide — shared or local?

If the type does NOT exist, ask: **could 2+ features/packages use this type?**

| Criteria | → Shared (`@book/shared`) | → Local (`lib/<feature>Types.ts`) |
|----------|--------------------------|----------------------------------|
| Used by 2+ features/packages | ✅ | — |
| Describes JSON from `content/` | ✅ | — |
| API contract (request/response) | ✅ | — |
| Component props / emits | — | ✅ |
| Internal composable state | — | ✅ |
| Single-feature helper type | — | ✅ |

### Step 3a: Request shared type

If the type should be shared, add to your output JSON:
```json
{
  "sharedTypesNeeded": [
    {
      "name": "NewTypeName",
      "fields": "{ field1: string, field2: number }",
      "reason": "Используется в quiz + progress для отслеживания результатов"
    }
  ]
}
```
Claude Code will invoke **TypesAgent** to add these types before proceeding.

### Step 3b: Define locally

If the type is local, create it in `packages/core/src/<feature>/lib/<feature>Types.ts`:
```ts
// packages/core/src/quiz/lib/quizTypes.ts

/** Внутреннее состояние прохождения квиза */
export interface QuizState {
  currentIndex: number
  answers: Record<string, string | number>
  isComplete: boolean
}
```

### Type Rules

- **NEVER** duplicate a shared type locally — import from `@book/shared`
- **NEVER** put local-only types in `@book/shared`
- Use `import type` and `export type` for all type imports/exports
- Local type files: `<feature>Types.ts` (camelCase + Types suffix) in `lib/`
- Shared type files: `<domain>.ts` (kebab-case) in `packages/shared/src/types/`
- All JSDoc comments in **Russian**

## Existing UI Components (`@book/ui`)

Already built — import, don't rebuild:
- `BaseButton`, `BaseCard`, `BaseModal`, `IconLabel`
- `DeepDive`, `Callout`, `DifficultyBadge`, `CrossLink`
- `CheatsheetModal`, `CodeBlock`, `TabGroup`, `TabPanel`
- Composables: `useCollapsible`, `useCopyCode`, `useHighlight`
- Types: `CalloutType`, `ButtonVariant`, `ButtonSize`

## Language Rules

- All user-facing text: **Russian** via `$t()` / `useI18n()`
- Code: variable/function names in **English**, comments in **Russian**
- Add new i18n keys to `packages/i18n/src/locales/ru.json`

## Component Rules

1. Always `<script setup lang="ts">`
2. All props typed with `defineProps<T>()`
3. All emits typed with `defineEmits<T>()`
4. Tailwind classes only — no `<style>` blocks
5. Import shared components from `@book/ui`, not rebuild
6. Import shared types from `@book/shared`, local types from `lib/<feature>Types.ts`
7. Every new feature must export from its `index.ts`
8. Stores use Pinia setup syntax: `defineStore('name', () => { ... })`
9. Use `ref()`, `computed()`, `watch()` from Vue
10. Use VueUse where applicable (e.g., `useLocalStorage`, `useDebounceFn`)

## Output Format

When generating files, output JSON:

```json
{
  "files": [
    {
      "path": "packages/core/src/<feature>/ui/Component.vue",
      "content": "..."
    }
  ],
  "sharedTypesNeeded": [
    {
      "name": "TypeName",
      "fields": "{ ... }",
      "reason": "string — why shared"
    }
  ]
}
```

Always include the `index.ts` that exports the public API of your feature.
`sharedTypesNeeded` is optional — include only if new shared types are needed.
