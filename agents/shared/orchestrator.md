# Orchestrator — Pipeline Reference for Claude Code

This file is instructions for **Claude Code**. You ARE the orchestrator. There is no separate orchestrator app. You read agent `.md` files and follow their instructions to produce output.

---

## Status Tracking Protocol

**CRITICAL:** You MUST use the `TodoWrite` tool to show pipeline progress. The user must always see which agent is active and what it's doing.

### Status Format

Each todo item represents one agent step. Use this naming convention:

```
content: "[ICON] AgentName — краткое описание"
activeForm: "[ICON] AgentName → что делает прямо сейчас"
```

### Icons by Agent Type

| Type | Icon | Example |
|------|------|---------|
| Content agents | 📝 | 📝 Planner — план исследования |
| Core builder agents | 🔧 | 🔧 SandboxAgent — код-редактор |
| QA: Tester | 🧪 | 🧪 TesterAgent — тесты для Sandbox |
| QA: Reviewer | 🔍 | 🔍 ReviewerAgent — ревью Sandbox |
| QA: Committer | 📦 | 📦 CommitterAgent — коммит Sandbox |
| Design | 🎨 | 🎨 DesignerAgent — дизайн-система |
| Infrastructure | 🏗️ | 🏗️ TypesAgent — добавляю shared типы |

### Status Transitions

For each agent, update the todo list at these moments:

```
1. BEFORE starting agent  → set status: "in_progress"
2. AFTER agent completes  → set status: "completed"
3. If agent fails/blocked → keep "in_progress", add new todo for the blocker
```

### Pipeline 1 Example: Content Generation

When generating chapter "Замыкания", create this todo list BEFORE starting:

```
📝 Planner — план исследования по теме "Замыкания"     [in_progress]
📝 Searcher — поиск источников                         [pending]
📝 Reader — извлечение контента                        [pending]
📝 Analyzer — анализ + квиз + интервью                 [pending]
📝 Writer — написание MDX-файлов главы                 [pending]
📝 Visualizer — визуализации + walkthrough             [pending]
📦 CommitterAgent — коммит главы                       [pending]
```

ActiveForm examples during execution:
```
"📝 Planner → составляю план на 5 подглав, 7 задач, 5 вопросов квиза"
"📝 Searcher → ищу источники: MDN, YDKJS, V8 blog, спецификация ECMAScript"
"📝 Reader → извлекаю ключевые идеи из 12 источников"
"📝 Analyzer → генерирую quiz.json (5 вопросов) + interview.json (4 вопроса)"
"📝 Writer → пишу 5 MDX-подглав + cheatsheet"
"📝 Visualizer → создаю scope-chain.vue + walkthrough.json"
"📦 CommitterAgent → git commit content(content): add chapter ch01-closures"
```

### Pipeline 2 Example: Core Engine Development

When building SandboxAgent, create this todo list BEFORE starting:

```
🔧 SandboxAgent — код-редактор + тест-раннер           [in_progress]
🧪 TesterAgent — тесты для Sandbox                     [pending]
🔍 ReviewerAgent — ревью кода Sandbox                   [pending]
📦 CommitterAgent — коммит Sandbox                      [pending]
```

ActiveForm examples during execution:
```
"🔧 SandboxAgent → генерирую CodeSandbox.vue, CodeEditor.vue, TestRunner.vue"
"🧪 TesterAgent → пишу 25 тестов для компонентов и composables"
"🔍 ReviewerAgent → проверяю FSD, TypeScript, Tailwind, i18n, a11y"
"📦 CommitterAgent → git commit feat(core/sandbox): add code editor with Monaco"
```

### Review Cycle Status

If ReviewerAgent returns `request_changes`:

```
🔧 SandboxAgent — код-редактор + тест-раннер           [completed]
🧪 TesterAgent — тесты для Sandbox                     [completed]
🔍 ReviewerAgent — ревью кода Sandbox                   [completed]
🔧 Fix: исправление 3 замечаний (i18n, a11y, types)    [in_progress]  ← NEW
🧪 TesterAgent — повторные тесты после фикса           [pending]      ← NEW
🔍 ReviewerAgent — повторное ревью (цикл 2/2)          [pending]      ← NEW
📦 CommitterAgent — коммит Sandbox                      [pending]
```

### Multi-Agent Pipeline Status

When running the full core engine pipeline (all 9 agents), show the big picture:

```
🔧 LayoutAgent — foundation UI                         [completed]
🎨 DesignerAgent — дизайн-система                      [completed]
🔧 SandboxAgent — код-редактор + тест-раннер           [in_progress]
  └─ 🧪🔍📦 QA pipeline                               [pending]
🔧 ChatAgent — AI-чат                                  [pending]
🔧 QuizAgent — квиз-виджет                             [pending]
🔧 TaskAgent — задания + code review                   [pending]
🔧 WalkthroughAgent — пошаговый разбор                 [pending]
🔧 InterviewAgent — подготовка к собеседованию          [pending]
🔧 ProgressAgent — трекер прогресса                    [pending]
```

When entering QA for a specific agent, expand it:

```
🔧 SandboxAgent — код-редактор + тест-раннер           [completed]
🧪 TesterAgent — тесты для Sandbox                     [in_progress]
🔍 ReviewerAgent — ревью Sandbox                        [pending]
📦 CommitterAgent — коммит Sandbox                      [pending]
🔧 ChatAgent — AI-чат                                  [pending]
...
```

---

## Agent Registry

### Shared (2 files)

| File | Purpose |
|------|---------|
| `agents/shared/stack-context.md` | Tech stack context — prepend to ALL core agents |
| `agents/shared/orchestrator.md` | This file — pipeline reference |

### Content Pipeline (6 agents)

| Order | Agent | File | Input | Output |
|-------|-------|------|-------|--------|
| 1 | Planner | `agents/content/planner.md` | Topic name | Research plan (JSON) |
| 2 | Searcher | `agents/content/searcher.md` | Research plan | Source URLs + summaries (JSON) |
| 3 | Reader | `agents/content/reader.md` | Source URLs | Extracted content (JSON) |
| 4 | Analyzer | `agents/content/analyzer.md` | Extracted content | Analysis + quiz + interview (JSON) |
| 5 | Writer | `agents/content/writer.md` | Analysis | MDX chapter files (Markdown) |
| 6 | Visualizer | `agents/content/visualizer.md` | Analysis + chapter | Visualizations + walkthrough (JSON) |

### Core Engine (9 builder agents)

| Order | Agent | File | Target Package |
|-------|-------|------|---------------|
| 1 | LayoutAgent | `agents/core/layout-agent.md` | `packages/ui/` + `packages/i18n/` |
| 2 | DesignerAgent | `agents/core/designer-agent.md` | `packages/ui/` + `apps/book/` |
| 3 | SandboxAgent | `agents/core/sandbox-agent.md` | `packages/core/src/sandbox/` |
| 4 | ChatAgent | `agents/core/chat-agent.md` | `packages/core/src/chat/` |
| 5 | QuizAgent | `agents/core/quiz-agent.md` | `packages/core/src/quiz/` |
| 6 | TaskAgent | `agents/core/task-agent.md` | `packages/core/src/tasks/` |
| 7 | WalkthroughAgent | `agents/core/walkthrough-agent.md` | `packages/core/src/walkthrough/` |
| 8 | InterviewAgent | `agents/core/interview-agent.md` | `packages/core/src/interview/` |
| 9 | ProgressAgent | `agents/core/progress-agent.md` | `packages/core/src/progress/` |

### QA, Infrastructure & Governance (4 agents)

| Agent | File | Purpose |
|-------|------|---------|
| TesterAgent | `agents/core/tester-agent.md` | Write Vitest tests for generated code |
| ReviewerAgent | `agents/core/reviewer-agent.md` | Review code against quality checklist |
| CommitterAgent | `agents/core/committer-agent.md` | Create git commits with conventional format |
| TypesAgent | `agents/core/types-agent.md` | Manage shared type library (`@book/shared`) — on-demand |

**Total: 19 agents** (6 content + 9 core builders + 4 QA/infrastructure)

---

## Pipeline 1: Content Generation

Run agents sequentially. Each agent's output is the next agent's input.

```
Topic → [1] Planner → [2] Searcher → [3] Reader → [4] Analyzer → [5] Writer → [6] Visualizer → chapter files
```

### How to Execute

1. **Create todo list** with all 7 steps (6 agents + commit)
2. Set Planner to `in_progress`, read `agents/content/planner.md`, provide topic → get research plan
3. Mark Planner `completed`, set Searcher `in_progress`, read `agents/content/searcher.md` → get sources
4. Mark Searcher `completed`, set Reader `in_progress`, read `agents/content/reader.md` → get extracted content
5. Mark Reader `completed`, set Analyzer `in_progress`, read `agents/content/analyzer.md` → get analysis
6. Mark Analyzer `completed`, set Writer `in_progress`, read `agents/content/writer.md` → get MDX files
7. Mark Writer `completed`, set Visualizer `in_progress`, read `agents/content/visualizer.md` → get visualizations
8. Mark Visualizer `completed`, set Committer `in_progress`, read `agents/core/committer-agent.md` → commit
9. Mark Committer `completed`

### Output Structure

All content goes to `content/ru/chXX-topic/`:
```
content/ru/chXX-topic/
  _meta.json
  index.mdx
  01-subchapter.mdx ... 05-subchapter.mdx
  playground.vue
  visualizations/*.vue
  walkthrough.json
  tasks/*.ts + *.test.ts + _tasks.json
  code-review/*.ts + *.json
  quiz.json
  interview.json
  cheatsheet.mdx
  resources.json
```

---

## Pipeline 2: Core Engine Development

Each core agent goes through QA:

```
Core Agent → TesterAgent → ReviewerAgent → CommitterAgent
                              │
                    approve → commit ✅
                    request_changes → fix → re-test → re-review (max 2 cycles)
```

### How to Execute

1. **Create todo list** with 4 steps (agent + tester + reviewer + committer)
2. Set agent to `in_progress`, read `agents/shared/stack-context.md` + `agents/core/<agent>.md`
3. Follow instructions → generate code files
4. **If agent outputs `sharedTypesNeeded`** → invoke TypesAgent on-demand (see below)
5. Mark agent `completed`, set TesterAgent `in_progress`, read `agents/core/tester-agent.md` → write tests
6. Mark TesterAgent `completed`, set ReviewerAgent `in_progress`, read `agents/core/reviewer-agent.md` → review
7. If `approve` → mark ReviewerAgent `completed`, set CommitterAgent `in_progress` → commit
8. If `request_changes` → add fix + re-test + re-review todos, max 2 cycles
9. Mark CommitterAgent `completed`

### Execution Order (dependencies)

```
1. LayoutAgent      ← foundation, MUST be first
2. DesignerAgent    ← design system, builds on Layout
3. SandboxAgent     ← independent
4. ChatAgent        ← independent
5. QuizAgent        ← independent
6. TaskAgent        ← depends on Sandbox (imports CodeSandbox)
7. WalkthroughAgent ← independent
8. InterviewAgent   ← independent
9. ProgressAgent    ← depends on ALL features (tracks everything)
```

---

## How to Execute an Agent

1. **Update todo** — set current agent to `in_progress` with descriptive `activeForm`
2. **Read** the agent's `.md` file (for core agents: `stack-context.md` first)
3. **Follow** its instructions (the `.md` IS the system prompt)
4. **Produce** output in the format specified by the agent
5. **Save** files to the paths specified by the agent
6. **Update todo** — mark agent `completed`
7. **Run QA** if it's a core agent (Tester → Reviewer → Committer)

## Key Rules

- Agent prompts are written in **English**
- All agent OUTPUT (generated code, content) must be in **Russian** (user-facing text)
- Code variable/function names in **English**, comments in **Russian**
- Each agent outputs JSON or Markdown — nothing else
- Core agents ALWAYS get `stack-context.md` prepended
- Content agents are independent of `stack-context.md`
- **ALWAYS update TodoWrite** before and after each agent step
- **activeForm must be specific** — not "Working...", but "генерирую CodeSandbox.vue, TestRunner.vue"

---

## TypesAgent — On-Demand Invocation

TypesAgent is NOT sequential — it runs **on-demand** when other agents need shared types.

### When to Invoke

During core agent execution (Pipeline 2), if an agent's output includes `"sharedTypesNeeded"`:

1. **Pause** the current agent
2. **Update todo**: add `🏗️ TypesAgent — добавляю типы для <feature>` as `in_progress`
3. **Read** `agents/core/types-agent.md`
4. **Execute** TypesAgent with the requested types
5. **Mark** TypesAgent todo as `completed`
6. **Resume** the original agent (it can now import the new types)

### Integration in Pipeline 2

```
Core Agent (outputs sharedTypesNeeded)
    ↓
🏗️ TypesAgent (adds types to @book/shared)
    ↓
Core Agent (continues, imports new types)
    ↓
🧪 TesterAgent → 🔍 ReviewerAgent → 📦 CommitterAgent
```

### Status Example

```
🔧 QuizAgent — квиз-виджет                            [in_progress]
  └─ 🏗️ TypesAgent — добавляю QuizResult в shared     [in_progress]
🧪 TesterAgent — тесты для Quiz                        [pending]
🔍 ReviewerAgent — ревью Quiz                           [pending]
📦 CommitterAgent — коммит Quiz                         [pending]
```
