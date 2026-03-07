# WalkthroughAgent — Code Walkthrough

You build the **code walkthrough** — a step-by-step debugger-like view that walks readers through code execution.

## Target Package

`packages/core/src/walkthrough/`

## FSD Structure

```
packages/core/src/walkthrough/
  ui/
    CodeWalkthrough.vue    # Main container: code + state panel + controls
    WalkthroughCode.vue    # Code display with line highlighting
    VariablesPanel.vue     # Current variable values at each step
    CallStackPanel.vue     # Call stack visualization
    StepControls.vue       # Previous / Next / Play / Pause buttons
    StepDescription.vue    # Explanation of current step
  model/
    useWalkthrough.ts      # Walkthrough state: steps, current step, playback
    usePlayback.ts         # Auto-play with configurable speed
  lib/
    walkthroughTypes.ts    # Local types (PlaybackState, StepControlsProps). Shared: import Walkthrough, WalkthroughStep from @book/shared
  index.ts                 # Public API
```

## Components

### CodeWalkthrough.vue (Main)
```
┌─ Пошаговый разбор ─────────────────┐
│                                     │
│  ┌─ Code ────────────────────────┐  │
│  │   function createCounter() {  │  │
│  │ → let count = 0              │  │  ← highlighted line
│  │     return {                  │  │
│  │       increment() {          │  │
│  │         return ++count       │  │
│  │       }                      │  │
│  │     }                        │  │
│  │   }                          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌─ Variables ──── ┬─ Call Stack ┐  │
│  │ count: 0        │ createCounter│  │
│  │                 │ (global)     │  │
│  └─────────────────┴─────────────┘  │
│                                     │
│  💬 Создаём переменную count = 0.  │
│     Она будет доступна через       │
│     замыкание.                     │
│                                     │
│  [◀ Назад]  [▶ Далее]  [⏯ Авто]  │
│                   Шаг 2 из 8       │
└─────────────────────────────────────┘
```

### Props Interface
```ts
interface CodeWalkthroughProps {
  walkthrough: Walkthrough   // From @book/shared types
}

// Type to add to @book/shared:
interface Walkthrough {
  title: string
  code: string
  steps: WalkthroughStep[]
}

interface WalkthroughStep {
  line: number
  description: string
  variables: Record<string, string>
  callStack: string[]
  highlight?: string
}
```

### Events
```ts
interface CodeWalkthroughEmits {
  'step-change': [stepIndex: number]
  'complete': []
}
```

## Key Behaviors

1. **Line highlighting** — current execution line highlighted with accent color
2. **Variable tracking** — variables panel updates with each step
3. **Call stack** — shows current function stack
4. **Step descriptions** — explanation of what happens at each step (Russian)
5. **Auto-play** — play through steps automatically with speed control
6. **Keyboard navigation** — arrow keys for step-by-step
7. **Load from JSON** — reads `walkthrough.json` from chapter directory

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- Use `CodeBlock` from `@book/ui` for code display (or custom with line highlighting)
- Import `BaseButton`, `BaseCard` from `@book/ui`
- Export `CodeWalkthrough` and `useWalkthrough` from `index.ts`
- Shared types (`Walkthrough`, `WalkthroughStep`) already in `@book/shared` — import, don't redefine

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/walkthrough/ui/CodeWalkthrough.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/walkthrough/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "walkthrough.title": "Пошаговый разбор",
    "walkthrough.step": "Шаг {current} из {total}",
    "walkthrough.prev": "Назад",
    "walkthrough.next": "Далее",
    "walkthrough.play": "Авто",
    "walkthrough.pause": "Пауза",
    "walkthrough.variables": "Переменные",
    "walkthrough.callStack": "Стек вызовов",
    "walkthrough.speed": "Скорость"
  }
}
```
