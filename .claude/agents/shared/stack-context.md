# Stack Context (shared by all Core Engine agents)

## Tech Stack
- **pnpm workspaces** — monorepo
- **Vue 3** — Composition API, `<script setup>`, no Options API
- **Vite** — build tool, HMR
- **Tailwind CSS** — utility-first, no custom CSS unless absolutely necessary
- **VueUse** — composables (useStorage, useDark, useEventListener, etc.)
- **TypeScript** — strict mode, all components fully typed
- **Pinia** — state management
- **vue-i18n** — localization
- **FSD (Feature-Sliced Design)** — mandatory architecture

## Monorepo Layout

```
root/
  apps/
    book/                           # @book/app — main book frontend
    admin/                          # @book/admin — content & agent management
    api/                            # @book/api — backend (Node)
  packages/
    core/                           # @book/core — reusable learning engine
      src/
        sandbox/                    # Each feature = FSD slice
        chat/
        quiz/
        tasks/
        progress/
        interview/
        walkthrough/
        index.ts
    ui/                             # @book/ui — shared UI components
      src/
    i18n/                           # @book/i18n — vue-i18n setup + locales
      src/
    shared/                         # @book/shared — types, utils, composables
      src/
```

## Where Your Code Goes

**You are building a package.** Files go into `packages/` — NOT `apps/`.

| If you are... | Put files in |
|---------------|-------------|
| SandboxAgent | `packages/core/src/sandbox/` |
| ChatAgent | `packages/core/src/chat/` |
| QuizAgent | `packages/core/src/quiz/` |
| TaskAgent | `packages/core/src/tasks/` |
| ProgressAgent | `packages/core/src/progress/` |
| InterviewAgent | `packages/core/src/interview/` |
| WalkthroughAgent | `packages/core/src/walkthrough/` |
| LayoutAgent | `packages/ui/src/` + `packages/i18n/src/` |
| TesterAgent | test files next to source (e.g., `packages/core/src/sandbox/CodeSandbox.test.ts`) |

## FSD Inside Packages

Each feature inside `packages/core/src/` follows FSD slice structure:

```
packages/core/src/sandbox/
  ui/
    CodeSandbox.vue
    ConsoleOutput.vue
  model/
    useCodeRunner.ts
    useTestRunner.ts
  lib/
    sandboxWorker.ts
    testAdapter.ts
  index.ts                        # Public API — re-exports only
```

## Cross-Package Imports

```ts
// From @book/core:
import { DeepDive, Callout, CodeBlock } from '@book/ui'
import { useI18n } from '@book/i18n'
import { type Chapter, type Task } from '@book/shared'

// From apps/book:
import { CodeSandbox, AIChat, Quiz } from '@book/core'
```

Internal dependencies: `"workspace:*"` in package.json.
**NEVER** import from another package's internal paths. Only through `index.ts`.

## Coding Conventions

- Components: `PascalCase.vue`, single `<script setup lang="ts">` block
- Composables: `useCamelCase.ts`, return reactive refs and functions
- Types: `camelCase.ts`, export interfaces
- Props: `defineProps<{}>()`, always typed
- Emits: `defineEmits<{}>()`, always typed
- State: `ref()` / `reactive()` / Pinia stores
- No `this`, no Options API, no mixins
- Tailwind classes directly, `@apply` only for repeated patterns
- i18n: all user-facing strings through `useI18n()` from `@book/i18n`
- All text content in **Russian** by default

## File Naming
- Components: `PascalCase.vue`
- Composables: `useCamelCase.ts`
- Stores: `useCamelCaseStore.ts`
- Types: `camelCase.ts`
- Constants: `SCREAMING_SNAKE_CASE`

## Output Format

Respond with complete, runnable files. **Use full monorepo paths:**

```json
{
  "files": [
    {
      "path": "packages/core/src/sandbox/ui/CodeSandbox.vue",
      "content": "... full file content ..."
    },
    {
      "path": "packages/core/src/sandbox/index.ts",
      "content": "export { default as CodeSandbox } from './ui/CodeSandbox.vue'"
    }
  ],
  "dependencies": ["monaco-editor"],
  "peerDependencies": ["@book/ui", "@book/i18n", "@book/shared"],
  "description": "Brief description of what was built"
}
```
