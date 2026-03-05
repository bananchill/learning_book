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

## Agents — 18 Total

No separate orchestrator app. **Claude Code reads agent prompts directly and executes the pipelines.**

### Directory Layout

```
agents/
  shared/
    stack-context.md              # Vue 3 + FSD + monorepo context (prepended to core agents)
    orchestrator.md               # Pipeline reference for Claude Code
  content/                        # Research & content generation (6)
    planner.md
    searcher.md
    reader.md
    analyzer.md
    writer.md
    visualizer.md
  core/                           # Core Engine components + QA + git + design (12)
    layout-agent.md
    sandbox-agent.md
    chat-agent.md
    quiz-agent.md
    task-agent.md
    progress-agent.md
    interview-agent.md
    walkthrough-agent.md
    designer-agent.md             # 🎨 Design system, tokens, themes, typography
    tester-agent.md
    reviewer-agent.md
    committer-agent.md
```

### Pipeline 1: Content Generation

Claude Code runs agents sequentially, user approves each step:

```
Topic → Planner → Searcher → Reader → Analyzer → Writer → Visualizer → chapter files
```

### Pipeline 2: Core Engine Development

```
Core Agent → TesterAgent → ReviewerAgent → CommitterAgent
                              │
                    approve → commit ✅
                    request_changes → fix → re-test → re-review (max 2 cycles)
```

Core agent execution order (dependencies):
1. LayoutAgent (foundation: @book/ui)
2. SandboxAgent
3. ChatAgent
4. QuizAgent
5. TaskAgent (depends on Sandbox)
6. WalkthroughAgent
7. InterviewAgent
8. ProgressAgent (depends on all features)

### How It Works

- Claude Code reads `agents/shared/orchestrator.md` to understand the pipeline
- Each agent = Claude Code reads its `.md` and follows instructions
- Core agents: Claude Code reads `stack-context.md` + `<agent>.md` together
- No Python, no external orchestrator. Claude Code IS the orchestrator.

### Adding Agents

1. Create `.md` in `agents/content/`, `agents/core/`, or `agents/shared/`
2. Core agents: `stack-context.md` is always prepended
3. Core agents: always go through QA (Tester → Reviewer → Committer)

## Configuration

- `ANTHROPIC_API_KEY` — for AI Chat feature in the book
- `RESEARCH_MODEL` — defaults to `claude-sonnet-4-20250514`

## Agent Execution Rules

**CRITICAL: Before performing any major action, read the relevant agent files first.**

### When building a core feature:
1. ALWAYS read `agents/shared/stack-context.md` first
2. Read the specific agent: `agents/core/<agent>.md`
3. Follow instructions from both files
4. After writing code → read `agents/core/tester-agent.md` and write tests
5. After tests → read `agents/core/reviewer-agent.md` and review
6. After approval → read `agents/core/committer-agent.md` and commit

### When generating chapter content:
1. Read `agents/shared/orchestrator.md` for pipeline overview
2. Read each content agent in order:
   - `agents/content/planner.md`
   - `agents/content/searcher.md`
   - `agents/content/reader.md`
   - `agents/content/analyzer.md`
   - `agents/content/writer.md`
   - `agents/content/visualizer.md`
3. After all content → read `agents/core/committer-agent.md` and commit

### When reviewing or fixing existing code:
1. Read `agents/shared/stack-context.md`
2. Read `agents/core/reviewer-agent.md`
3. Follow review checklist

### Quick Reference — Which agents to read:

| Task | Read these files |
|------|-----------------|
| Build core feature | `stack-context.md` + `<feature>-agent.md` + `tester-agent.md` + `reviewer-agent.md` + `committer-agent.md` |
| Generate chapter | `orchestrator.md` + all `content/*.md` in order + `committer-agent.md` |
| Write tests only | `stack-context.md` + `tester-agent.md` |
| Review code only | `stack-context.md` + `reviewer-agent.md` |
| Commit changes | `committer-agent.md` |
| Add shared UI | `stack-context.md` + `layout-agent.md` |
| Create design system | `stack-context.md` + `designer-agent.md` + `reviewer-agent.md` + `committer-agent.md` |

