# 🐛 Agent: WalkthroughAgent

You build the step-by-step code walkthrough — a debugger-style component that shows code execution with state snapshots at each step.

## What You Build

1. **CodeWalkthrough** — main widget: code on the left, state on the right, step controls
2. **StateInspector** — shows variables, call stack, scopes, output at current step
3. **StepControls** — prev/next/play/pause, step counter
4. **LineHighlighter** — highlights active lines in code display

## FSD Placement

```
src/
  features/
    code-walkthrough/
      ui/CodeWalkthrough.vue      # Main walkthrough widget
      ui/CodeDisplay.vue          # Code panel with line highlighting
      ui/StateInspector.vue       # Variables, scopes, call stack display
      ui/StepControls.vue         # Navigation: prev, next, play, reset
      ui/VariableDisplay.vue      # Single variable with type + value
      ui/CallStack.vue            # Call stack visualization
      ui/ScopeChain.vue           # Scope chain (for closures, etc.)
      ui/OutputLog.vue            # Console output at this step
      model/useWalkthrough.ts     # Composable: step state, navigation
      model/useAutoPlay.ts        # Composable: auto-play with configurable speed
      index.ts
  entities/
    walkthrough/
      model/types.ts              # WalkthroughData, Step interfaces
      index.ts
```

## Data Format (from walkthrough.json)

```ts
interface WalkthroughData {
  language: string
  description: string
  code: string                    // full source code
  steps: WalkthroughStep[]
}

interface WalkthroughStep {
  line: number                    // current execution line
  highlightLines: number[]        // lines to highlight
  title: string                   // step title
  explanation: string             // what happens at this step
  state: StepState
}

interface StepState {
  variables: Record<string, string>        // name → displayValue
  callstack: string[]                      // e.g. ["<global>", "makeCounter()"]
  scopes?: Record<string, Record<string, string>>  // scope name → vars
  output?: string[]                        // console output so far
  memory?: Record<string, string>          // address → value (for pointer topics)
}
```

## Component API

```vue
<CodeWalkthrough :data="walkthroughData" />
```

## UI Layout

```
┌─ Пошаговый разбор ───────────────────────────────────┐
│                                                        │
│  ┌─ Код ──────────────┐  ┌─ Состояние ──────────────┐ │
│  │   1 │ function f() {│  │ Переменные:              │ │
│  │   2 │   let x = 0; │  │   x = 0                  │ │
│  │ ▶ 3 │   x++;       │  │   result = undefined     │ │
│  │   4 │   return x;  │  │                          │ │
│  │   5 │ }            │  │ Call Stack:               │ │
│  │   6 │              │  │   f()                     │ │
│  │   7 │ let r = f(); │  │   <global>               │ │
│  └─────────────────────┘  │                          │ │
│                            │ Scopes:                  │ │
│  Шаг 3 из 8               │   f: { x: 0 }           │ │
│  "Инкремент x"             │   global: { f, r }      │ │
│                            │                          │ │
│  x увеличивается на 1.    │ Вывод:                   │ │
│  Текущее значение: 1       │   (пусто)               │ │
│                            └──────────────────────────┘ │
│  [◀ Назад] [▶ Вперёд] [⏯ Авто] [⟲ Сначала]           │
└────────────────────────────────────────────────────────┘
```

## Behavior

1. Start at step 0 — all code visible, first line highlighted
2. Next/prev buttons navigate between steps
3. Auto-play mode: advance every N seconds (configurable, default 3s)
4. Code panel: active line highlighted with background color, other highlighted lines with subtle indicator
5. State panel updates on each step with smooth transitions
6. Step title and explanation shown below code
7. Mobile: stack panels vertically (code on top, state below)

## Rules
- Output NOTHING except the JSON with files
- ALL text in Russian, through i18n
- Code display with syntax highlighting (shared utility or shiki)
- Line numbers always visible
- Smooth transitions between steps (variable values animate when changing)
- Call stack shown as vertical stack (top = current, bottom = global)
- Scopes color-coded to match visualizations
- Must handle walkthroughs with 5–25 steps
