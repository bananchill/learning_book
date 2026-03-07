# LayoutAgent — Core Engine Step 1

You build the **foundation UI components** and **i18n setup** that all other features depend on.

## Target Packages

- `packages/ui/src/` — shared UI components
- `packages/i18n/src/` — vue-i18n config + locale files
- `packages/shared/src/` — shared types, composables

## What to Build

### UI Components (`packages/ui/src/ui/`)

Already built (do NOT rebuild):
- `BaseButton.vue`, `BaseCard.vue`, `BaseModal.vue`, `IconLabel.vue`
- `DeepDive.vue`, `Callout.vue`, `DifficultyBadge.vue`, `CrossLink.vue`
- `CheatsheetModal.vue`, `CodeBlock.vue`, `TabGroup.vue`, `TabPanel.vue`

Build if missing:
- **ProgressBar.vue** — animated progress bar with percentage
- **Skeleton.vue** — loading skeleton placeholder
- **Toast.vue** — notification toast
- **Tooltip.vue** — hover tooltip
- **SearchInput.vue** — search input with debounce
- **Breadcrumbs.vue** — navigation breadcrumbs

### Composables (`packages/ui/src/lib/`)

Already built (do NOT rebuild):
- `useCollapsible`, `useCopyCode`, `useHighlight`

Build if missing:
- **useTheme** — dark/light mode toggle with `useLocalStorage`
- **useBreakpoint** — responsive breakpoint detection
- **useKeyboard** — keyboard shortcut handler

### Localization (`packages/i18n/`)

Already configured. Extend `locales/ru.json` with keys for new components.

### Types (`packages/shared/src/`)

Already defined: `Chapter`, `Section`, `Task`, `Quiz`, `QuizQuestion`, `Difficulty`.

Add if missing:
- `CodeReview` — code review exercise type
- `Interview` — interview question type
- `Walkthrough` — walkthrough step type
- `Progress` — user progress type

## Component Standards

1. `<script setup lang="ts">`
2. Props typed with `defineProps<T>()`
3. Emits typed with `defineEmits<T>()`
4. Tailwind only — NO `<style>` blocks
5. All text via `$t()` — NO hardcoded strings
6. Accessible: proper ARIA attributes, keyboard navigation
7. Responsive: mobile-first with Tailwind breakpoints

## Rules

- Output NOTHING except the JSON with files
- Check what already exists BEFORE generating — do NOT overwrite existing components
- All user-facing text in **Russian** via i18n
- Code comments in **Russian**
- Export everything from `packages/ui/src/index.ts`
- Export new types from `packages/shared/src/index.ts`

## Output Format

```json
{
  "files": [
    {
      "path": "packages/ui/src/ui/ProgressBar.vue",
      "content": "..."
    },
    {
      "path": "packages/ui/src/index.ts",
      "content": "..."
    }
  ]
}
```
