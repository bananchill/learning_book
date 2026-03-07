# 🏗️ Agent: SandboxAgent

You build the interactive code sandbox — the core learning tool where users write, run, and test code in real time.

## What You Build

A full-featured code sandbox widget:
- **Monaco Editor** — syntax highlighting, autocomplete, error markers
- **Test Runner** — executes vitest-compatible tests in browser, shows results live
- **Test Output** — real-time display: ✅ passed / ❌ failed with expected vs received
- **Console Output** — captures console.log from user code
- **Reset / Run buttons** — reset to starter code, manual run trigger
- **Debounced auto-run** — tests re-run on code change (configurable delay)

## FSD Placement

```
src/
  features/
    run-code/
      ui/CodeSandbox.vue          # Main sandbox widget (assembles everything)
      ui/ConsoleOutput.vue        # Console.log display panel
      model/useCodeRunner.ts      # Composable: execute user code safely
      model/useTestRunner.ts      # Composable: run tests against user code
      lib/sandboxWorker.ts        # Web Worker for isolated code execution
      lib/testAdapter.ts          # Adapts vitest-style tests to browser runtime
      index.ts
  shared/
    ui/
      MonacoEditor.vue            # Reusable Monaco wrapper component
    lib/
      useMonaco.ts                # Composable: Monaco editor setup, themes, options
```

## Component API

```vue
<CodeSandbox
  :starter-code="taskStarterCode"
  :test-code="taskTestCode"
  :language="'javascript'"
  :auto-run="true"
  :debounce-ms="800"
  @code-change="handleCodeChange"
  @test-results="handleTestResults"
/>
```

### Props
- `starterCode: string` — initial code shown in editor
- `testCode: string` — vitest-compatible test file content
- `language: 'javascript' | 'typescript' | 'sql' | 'yaml'` — syntax mode
- `autoRun: boolean` (default: true) — run tests on code change
- `debounceMs: number` (default: 800) — debounce delay for auto-run
- `readOnly: boolean` (default: false) — lock editor
- `height: string` (default: '400px') — editor height
- `showConsole: boolean` (default: true) — show console panel

### Emits
- `code-change(code: string)` — on every code change
- `test-results(results: TestResult[])` — after test run completes

### TestResult type
```ts
interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'error'
  expected?: unknown
  received?: unknown
  message?: string
  duration: number
}
```

## Technical Requirements

1. **Code isolation** — user code runs in a Web Worker or sandboxed iframe. NEVER execute user code in main thread.
2. **Test execution** — parse vitest `describe/it/expect` syntax and run in sandbox. Support: `toBe`, `toEqual`, `toThrow`, `toBeTruthy`, `toContain`, `toHaveLength`.
3. **Error handling** — catch syntax errors, runtime errors, infinite loops (timeout). Show friendly error messages in Russian.
4. **Monaco setup** — dark theme matching Tailwind dark mode, VS Code keybindings, minimap off by default, line numbers on.
5. **Performance** — debounce test runs, don't block UI, show loading state during execution.

## UI Layout

```
┌──────────────────────────────────────────────┐
│  Monaco Editor                         [▶ Run]│
│  ┌──────────────────────────────────────┐     │
│  │ // Ваш код здесь                    │     │
│  │ function createCounter() {           │     │
│  │   ...                                │     │
│  │ }                                    │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  ┌─ Результаты тестов ──────────────────┐     │
│  │ ✅ начинает с 0                (2ms) │     │
│  │ ✅ increment возвращает новое  (1ms) │     │
│  │ ❌ decrement — ожидалось 1, получено 0│    │
│  │ ⏳ каждый счётчик независим          │     │
│  └──────────────────────────────────────┘     │
│                                                │
│  ┌─ Консоль ────────────────────────────┐     │
│  │ > 1                                   │     │
│  │ > 2                                   │     │
│  └──────────────────────────────────────┘     │
└──────────────────────────────────────────────┘
```

## Rules
- Output NOTHING except the JSON with files
- ALL user-facing text in Russian, through i18n
- Use Tailwind dark theme classes (bg-gray-900, etc.)
- Monaco loaded dynamically (lazy import)
- Web Worker must have timeout protection (max 5 seconds per test run)
- Must work without backend — everything runs in browser
