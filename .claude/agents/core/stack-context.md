# Stack Context (shared by all Core Engine agents)

## Tech Stack
- **Vue 3** — Composition API, `<script setup>`, no Options API
- **Vite** — build tool, HMR
- **Tailwind CSS** — utility-first, no custom CSS unless absolutely necessary
- **VueUse** — use composables from VueUse where applicable (useStorage, useDark, useEventListener, etc.)
- **TypeScript** — strict mode, all components fully typed
- **FSD (Feature-Sliced Design)** — mandatory architecture

## FSD Structure

```
src/
  app/                    # App layer — providers, router, global styles
  pages/                  # Page components (chapter page, home, etc.)
  widgets/                # Complex assembled blocks (ChapterView, Sidebar)
  features/               # User interactions (run-tests, submit-answer, send-chat-message)
  entities/               # Business entities (chapter, task, quiz-question, progress)
  shared/                 # Reusable kit
    ui/                   # Dumb UI components (Button, Card, Badge, Modal)
    lib/                  # Utilities, helpers, composables
    api/                  # API clients (Claude API, test runner)
    config/               # Constants, i18n config
    types/                # Shared TypeScript types
```

Each slice follows FSD internal structure:
```
features/run-tests/
  ui/                     # Vue components
    RunTestsButton.vue
  model/                  # Store, composables, business logic
    useRunTests.ts
  api/                    # API calls if needed
  lib/                    # Helpers
  index.ts                # Public API (re-exports)
```

## Coding Conventions

- Components: `PascalCase.vue`, single `<script setup lang="ts">` block
- Composables: `useCamelCase.ts`, return reactive refs and functions
- Types: `camelCase.ts` in `types/`, export interfaces with `I` prefix only for ambiguous names
- Props: defined with `defineProps<{}>()`, always typed
- Emits: defined with `defineEmits<{}>()`, always typed
- State: `ref()` / `reactive()` / Pinia stores where needed
- No `this`, no Options API, no mixins
- Tailwind: use classes directly, extract to `@apply` only for repeated patterns
- i18n: all user-facing strings go through `useI18n()` from vue-i18n
- All text content in **Russian** by default, with i18n keys for localization

## File Naming
- Components: `PascalCase.vue`
- Composables: `useCamelCase.ts`
- Stores: `useCamelCaseStore.ts`
- Types: `camelCase.ts`
- Constants: `SCREAMING_SNAKE_CASE` inside `camelCase.ts`

## Output Format

Every agent must respond with complete, runnable files. Format:

```json
{
  "files": [
    {
      "path": "src/features/run-tests/ui/RunTestsButton.vue",
      "content": "... full file content ..."
    },
    {
      "path": "src/features/run-tests/model/useRunTests.ts",
      "content": "..."
    },
    {
      "path": "src/features/run-tests/index.ts",
      "content": "..."
    }
  ],
  "dependencies": ["monaco-editor", "@vueuse/core"],
  "description": "Brief description of what was built"
}
```
