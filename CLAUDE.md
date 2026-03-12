# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Interactive learning book: JS/TS, Architecture, Databases, DevOps. Monorepo on pnpm.

**Detailed specs:** [`docs/BOOK_SPEC.md`](docs/BOOK_SPEC.md) | **Roadmap:** [`ROADMAP.md`](ROADMAP.md)

## Language & Localization

- **Default: Russian (ru).** ALL output — theory, quizzes, tasks, hints, UI, code comments — in Russian.
- Agent prompts in English. All agent OUTPUT in Russian.
- Code: variable/function names in English, comments in Russian.
- Content lives in `content/ru/`. Future locales: `content/en/`, etc.
- All UI strings through `vue-i18n` (`useI18n()` / `$t()`). Never hardcode text.

## Tech Stack

- **pnpm workspaces** — monorepo
- **Vue 3** — Composition API, `<script setup lang="ts">`, no Options API
- **Vite** — build tool
- **Tailwind CSS** — utility-first, no custom CSS
- **FSD (Feature-Sliced Design)** — mandatory architecture
- **VueUse** — composables
- **Pinia** — state management
- **TypeScript** — strict mode
- **vue-i18n** — localization
- **Vitest** + **@vue/test-utils** + **@testing-library/vue** — testing

## Monorepo Structure

```
root/
├── pnpm-workspace.yaml
├── package.json                      # Root scripts, shared devDependencies
├── tsconfig.base.json                # Shared TS config with path aliases
├── .npmrc
│
├── apps/
│   ├── book/                         # @book/app — main book frontend (Vue)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── app/                  # FSD: providers, router, global styles
│   │   │   ├── pages/                # FSD: page components
│   │   │   ├── widgets/              # FSD: assembled blocks (ChapterView, Sidebar)
│   │   │   ├── features/             # FSD: app-specific features (navigation, theme)
│   │   │   ├── entities/             # FSD: business entities
│   │   │   └── shared/               # FSD: app-level shared
│   │   └── index.html
│   │
│   ├── admin/                        # @book/admin — content & agent management (Vue)
│   │   ├── package.json
│   │   └── src/
│   │
│   └── api/                          # @book/api — backend (Node)
│       ├── package.json
│       └── src/
│
├── packages/
│   ├── core/                         # @book/core — reusable learning engine
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── sandbox/              # Monaco + test runner
│   │   │   ├── chat/                 # AI chat
│   │   │   ├── quiz/                 # Quiz widget
│   │   │   ├── tasks/                # Tasks + hints + code review
│   │   │   ├── progress/             # Progress tracker
│   │   │   ├── interview/            # Interview prep
│   │   │   ├── walkthrough/          # Code walkthrough
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   │
│   ├── ui/                           # @book/ui — shared UI components
│   │   ├── package.json
│   │   └── src/
│   │
│   ├── i18n/                         # @book/i18n — localization
│   │   ├── package.json
│   │   └── src/
│   │
│   └── shared/                       # @book/shared — types, utils, composables
│       ├── package.json
│       └── src/
│
├── content/                          # Book content (not a package)
│   └── ru/
│       └── ch01-closures/
│
├── agents/                           # Agent prompts (not a package)
│   ├── shared/
│   ├── content/
│   └── core/
│
├── docs/
│   └── BOOK_SPEC.md
├── CLAUDE.md
└── ROADMAP.md
```

### Dependency Graph

```
@book/app   → @book/core → @book/ui → @book/shared
@book/admin → @book/core → @book/i18n → @book/shared
@book/api (standalone)
```

### Cross-Package Imports

```ts
import { CodeSandbox, AIChat, Quiz } from '@book/core'
import { DeepDive, Callout, CodeBlock } from '@book/ui'
import { useI18n } from '@book/i18n'
import { type Chapter, type Task } from '@book/shared'
```

**NEVER** import from another package's `src/` internals. Only through `index.ts`.
Use `"workspace:*"` for internal dependencies.

### Root Scripts

```json
{
  "dev": "pnpm --filter @book/app dev",
  "dev:admin": "pnpm --filter @book/admin dev",
  "dev:api": "pnpm --filter @book/api dev",
  "build": "pnpm -r build",
  "test": "pnpm -r test",
  "lint": "pnpm -r lint",
  "typecheck": "pnpm -r typecheck"
}
```

## Component Library Rule

Every UI block must be a reusable component in `@book/ui`. Every component in `packages/ui/src/ui/` MUST have a `.test.ts` file next to it. Components are composed from smaller primitives (BaseCard + DifficultyBadge, not standalone div-soup). All components re-exported from `packages/ui/src/index.ts`.

**Naming:** component names must NOT collide with shared type names. Use `QuizView` (not `Quiz`), `CodeReviewView` (not `CodeReview`), `ChapterProgressCard` (not `ChapterProgress`).

## FSD Structure

Applies inside `apps/book/src/` and within each feature in `packages/core/src/`:

```
app/ → pages/ → widgets/ → features/ → entities/ → shared/
```

Import rule: only left-to-right, never reverse.

Each feature slice:
```
sandbox/
  ui/          # Vue components
  model/       # Composables, stores, business logic
  lib/         # Helpers, pure functions
  api/         # API calls
  index.ts     # Public API
```

## Book Content Structure

```
content/ru/chXX-topic/
  index.mdx              # Overview + subchapter links
  XX-subchapter.mdx      # Subchapters
  playground.vue          # Sandbox
  visualizations/         # Concept + problem visualizations
  walkthrough.json        # Debugger steps
  tasks/                  # Easy → medium → hard + _tasks.json
  code-review/            # Bad code exercises
  quiz.json
  interview.json
  cheatsheet.mdx
  resources.json
  _meta.json
```

## Depth Control

**Telescope:** Surface → Mechanics → Deep Dive (collapsed by default).
- Default: levels 1–2, level 3 = 1 paragraph in `<DeepDive>`.
- On "копай глубже": full expansion.
- Do NOT over-explain by default.

## Agents — 20 Total

No separate orchestrator app. **Claude Code reads agent prompts directly and executes the pipelines.**

### Directory Layout

```
agents/
  shared/
    stack-context.md              # Vue 3 + FSD + monorepo context (prepended to core agents)
    orchestrator.md               # Pipeline reference for Claude Code
  content/                        # Research & content generation (7)
    planner.md
    searcher.md
    reader.md
    analyzer.md
    writer.md
    assembler.md                  # 📦 Converts Analyzer specs → JSON/TS files (_meta, quiz, tasks, etc.)
    visualizer.md
  core/                           # Core Engine components + QA + git + design + types (13)
    layout-agent.md
    sandbox-agent.md
    chat-agent.md
    quiz-agent.md
    task-agent.md
    progress-agent.md
    interview-agent.md
    walkthrough-agent.md
    designer-agent.md             # 🎨 Design system, tokens, themes, typography
    types-agent.md                # 🏗️ Shared type library management (on-demand)
    tester-agent.md
    reviewer-agent.md
    committer-agent.md
```

### Pipeline 1: Content Generation

Claude Code runs agents sequentially, user approves each step:

```
Topic → Planner → Searcher → Reader → Analyzer → Writer → Assembler → Visualizer → chapter files
```

### Pipeline 2: Core Engine Development

```
Core Agent → TesterAgent → ReviewerAgent → CommitterAgent
DesignerAgent → ReviewerAgent → CommitterAgent (skips TesterAgent — CSS only)
                              │
                    approve → commit ✅
                    request_changes → fix → re-test → re-review (max 2 cycles)
```

Core agent execution order (dependencies):
1. LayoutAgent (foundation: @book/ui)
2. DesignerAgent (design system, builds on Layout)
3. SandboxAgent
4. ChatAgent
5. QuizAgent
6. TaskAgent (depends on Sandbox)
7. WalkthroughAgent
8. InterviewAgent
9. ProgressAgent (depends on all features)

### How It Works

- Claude Code reads `agents/shared/orchestrator.md` to understand the pipeline
- Each agent = Claude Code reads its `.md` and follows instructions
- Core agents: Claude Code reads `stack-context.md` + `<agent>.md` together
- No Python, no external orchestrator. Claude Code IS the orchestrator.

### Adding Agents

1. Create `.md` in `agents/content/`, `agents/core/`, or `agents/shared/`
2. Core agents: `stack-context.md` is always prepended
3. Core agents: always go through QA (Tester → Reviewer → Committer). Exception: DesignerAgent skips TesterAgent (CSS-only output)

## Configuration

- `ANTHROPIC_API_KEY` — for AI Chat feature in the book
- `RESEARCH_MODEL` — defaults to `claude-sonnet-4-20250514`

## Task Intake Protocol

**CRITICAL: EVERY task starts with analysis and a plan. NEVER jump straight to code or content generation.**

**Визуализация:** На протяжении ВСЕЙ работы используй визуализацию прогресса из `agents/shared/orchestrator.md` — Console Progress Visualization + Status Tracking Protocol. Пользователь ВСЕГДА должен видеть: какой агент сейчас активен, что он делает, и сколько шагов осталось. Выводи progress-блок при каждом переходе между агентами.

### Step 1: Classify the Task

| Type | Description | Pipeline |
|------|-------------|----------|
| `content` | Написать/обновить главу | Content Pipeline |
| `core-feature` | Создать/обновить фичу движка | Core Pipeline |
| `ui-component` | Добавить/обновить UI-компонент | Layout/Designer Pipeline |
| `bug-fix` | Исправить баг | Review → Fix → Test → Commit |
| `refactor` | Рефакторинг кода | Review → Refactor → Test → Commit |
| `types` | Обновить shared типы | Types Pipeline |

### Step 2: Create and Present a Plan

Use `EnterPlanMode` for multi-file or non-trivial tasks. For small tasks — output the plan as markdown and ask for confirmation.

#### For Content Tasks (`content`):

Present the user with:

1. **Existing chapters** — list all `content/ru/ch*` with titles from `_meta.json`. Mark which ones will be cross-linked.
2. **Planned structure** — chapter ID, title, subchapter breakdown (3-5), estimated time.
3. **Research directions** — what sources will be searched (MDN, specs, YDKJS, V8 blog, etc.), which key questions need answering. Present as a numbered list.
4. **Planned artifacts** — how many MDX files, quiz questions, interview questions, tasks by difficulty, code review exercises, visualizations.
5. **Cross-links** — which existing chapters this topic connects to and how.

Example plan output format:

```
───────────────────────────────────────────
  📋 План: Глава «Прототипы»
───────────────────────────────────────────

  📚 Существующие главы:
     ch01-closures  — Замыкания (cross-link: scope chain)
     ch02-async     — Асинхронность
     ch03-parallelism — Параллелизм
     ch04-v8-engine — Движок V8 (cross-link: hidden classes)

  📖 Структура:
     01 — Что такое прототипы и зачем они нужны  (~5 мин)
     02 — Как работает прототипная цепочка       (~7 мин)
     03 — Классы как синтаксический сахар         (~5 мин)
     04 — Паттерны наследования                   (~6 мин)
     05 — Антипаттерны и подводные камни          (~5 мин)

  🔍 Направления исследования:
     1. MDN — Object.prototype, __proto__, Object.create
     2. ECMAScript spec — OrdinaryGetPrototypeOf, OrdinarySetPrototypeOf
     3. YDKJS — "this & Object Prototypes"
     4. V8 blog — hidden classes и прототипы

  📦 Артефакты:
     6 MDX-файлов (index + 4 подглавы + cheatsheet)
     5 вопросов квиза
     4 вопроса на собеседование
     7 задач (3 easy + 2 medium + 2 hard)
     1 code review упражнение
     2 визуализации (prototype chain, class vs prototype)
───────────────────────────────────────────
```

#### For Code Tasks (`core-feature`, `ui-component`, `bug-fix`, `refactor`):

Present the user with:

1. **Affected files** — list all files to create or modify, grouped by package.
2. **Dependencies** — what packages/features this depends on, what depends on this.
3. **Shared types** — new types for `@book/shared` and existing types to import.
4. **Test plan** — what will be tested, estimated test count.
5. **i18n keys** — new i18n keys to add.

### Step 3: Wait for Approval

**NEVER start execution without user approval of the plan.**

- User approves → execute the pipeline
- User requests changes → update the plan and re-present
- User asks questions → answer them, update the plan if needed

## Agent Execution Rules

**CRITICAL: Before performing any major action, read the relevant agent files first.**
**CRITICAL: EVERY task starts with the Task Intake Protocol (see above). Classify → Plan → Approve → Execute.**

### Step 0 (ALL tasks): Task Intake
1. Classify the task (content / core-feature / ui-component / bug-fix / refactor / types)
2. Create and present a plan (see "Task Intake Protocol" above)
3. **Wait for user approval** — NEVER skip this step

### When building a core feature:
1. ~~Step 0~~ → Plan approved
2. Read `agents/shared/stack-context.md` first
3. Read the specific agent: `agents/core/<agent>.md`
4. Follow instructions from both files
5. If new shared types needed → read `agents/core/types-agent.md` and add them first
6. After writing code → read `agents/core/tester-agent.md` and write tests
7. After tests → read `agents/core/reviewer-agent.md` and review
8. After approval → read `agents/core/committer-agent.md` and commit

### When generating chapter content:
1. ~~Step 0~~ → Plan approved (including existing chapters list, research directions, planned artifacts)
2. Read `agents/shared/orchestrator.md` for pipeline overview
3. Read each content agent in order:
   - `agents/content/planner.md`
   - `agents/content/searcher.md`
   - `agents/content/reader.md`
   - `agents/content/analyzer.md`
   - `agents/content/writer.md`
   - `agents/content/assembler.md`
   - `agents/content/visualizer.md`
4. After all content → read `agents/core/committer-agent.md` and commit

### When reviewing or fixing existing code:
1. ~~Step 0~~ → Plan approved (including affected files list)
2. Read `agents/shared/stack-context.md`
3. Read `agents/core/reviewer-agent.md`
4. Follow review checklist

### Quick Reference — Which agents to read:

| Task | Read these files |
|------|-----------------|
| Build core feature | **Step 0 (plan)** → `stack-context.md` + `<feature>-agent.md` + `tester-agent.md` + `reviewer-agent.md` + `committer-agent.md` |
| Generate chapter | **Step 0 (plan)** → `orchestrator.md` + all `content/*.md` in order + `committer-agent.md` |
| Write tests only | **Step 0 (plan)** → `stack-context.md` + `tester-agent.md` |
| Review code only | **Step 0 (plan)** → `stack-context.md` + `reviewer-agent.md` |
| Commit changes | `committer-agent.md` |
| Add shared UI | **Step 0 (plan)** → `stack-context.md` + `layout-agent.md` |
| Create design system | **Step 0 (plan)** → `stack-context.md` + `designer-agent.md` + `reviewer-agent.md` + `committer-agent.md` |
| Manage shared types | **Step 0 (plan)** → `stack-context.md` + `types-agent.md` |

