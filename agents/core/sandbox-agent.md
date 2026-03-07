# SandboxAgent — Code Sandbox

You build the **code editor + test runner** — the core interactive component where users write and test code.

## Target Package

`packages/core/src/sandbox/`

## FSD Structure

```
packages/core/src/sandbox/
  ui/
    CodeSandbox.vue        # Main wrapper: editor + test output + controls
    CodeEditor.vue         # Monaco editor wrapper
    TestRunner.vue         # Test execution display
    TestOutput.vue         # Test results: ✅ passed / ❌ failed
    SandboxControls.vue    # Run, reset, format buttons
  model/
    useSandbox.ts          # Main composable: code state, test execution
    useTestRunner.ts       # Web Worker test execution logic
    useCodeHistory.ts      # Undo/redo, localStorage persistence
  lib/
    testWorker.ts          # Web Worker for running tests in isolation
    codeFormatter.ts       # Code formatting helper
    sandboxTypes.ts        # Local types (CodeSandboxProps, CodeSandboxEmits, SandboxState). Shared: import TestResult from @book/shared
  index.ts                 # Public API
```

## Components

### CodeSandbox.vue (Main)
The assembled sandbox with all parts:
```
┌──────────────────────────────────────┐
│  CodeEditor (Monaco)                 │
│  ┌────────────────────────────────┐  │
│  │ // Код пользователя            │  │
│  │ function createCounter() {     │  │
│  │   ...                          │  │
│  │ }                              │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌─ TestOutput ───────────────────┐  │
│  │ ✅ starts at 0                 │  │
│  │ ✅ increment returns new value │  │
│  │ ❌ decrement — expected 1      │  │
│  └────────────────────────────────┘  │
│                                      │
│  [▶ Запустить]  [↺ Сбросить]        │
└──────────────────────────────────────┘
```

### Props Interface
```ts
interface CodeSandboxProps {
  initialCode: string        // Starter code
  testCode: string           // Test file content
  language?: 'javascript' | 'typescript'
  readOnly?: boolean
  autoRun?: boolean          // Run tests on change (debounced)
  height?: string            // Editor height
}
```

### Events
```ts
interface CodeSandboxEmits {
  'update:code': [code: string]
  'test-results': [results: TestResult[]]
  'error': [error: string]
}
```

## Key Behaviors

1. **Monaco Editor** — syntax highlighting, autocomplete, error markers
2. **Test execution** — runs in Web Worker for isolation
3. **Real-time feedback** — tests run on keystroke (debounced 500ms) or button press
4. **Test output** — each test: name + status + error details if failed
5. **Code persistence** — save to localStorage, restore on reload
6. **Reset** — restore to initial starter code

## Dependencies

- `monaco-editor` — code editor (install in `packages/core`)
- `@vueuse/core` — `useDebounceFn`, `useLocalStorage`

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys to `packages/i18n/src/locales/ru.json`
- Tailwind only, no `<style>` blocks
- Web Worker for test isolation — no eval in main thread
- Export `CodeSandbox` and `useSandbox` from `index.ts`
- Import `BaseButton`, `BaseCard` from `@book/ui` — don't rebuild

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/sandbox/ui/CodeSandbox.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/sandbox/index.ts",
      "content": "..."
    }
  ],
  "dependencies": {
    "packages/core": ["monaco-editor"]
  },
  "i18nKeys": {
    "sandbox.run": "Запустить",
    "sandbox.reset": "Сбросить",
    "sandbox.passed": "Пройден",
    "sandbox.failed": "Провален"
  }
}
```
