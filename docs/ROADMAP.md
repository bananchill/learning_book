# 🗺️ ROADMAP.md

Step-by-step build plan. Claude Code executes each step.

---

## Step 1: Initialize Monorepo

**Goal:** pnpm monorepo with all apps and packages scaffolded.

**Actions:**
1. `pnpm init` at root
2. Create `pnpm-workspace.yaml`:
   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```
3. Create `.npmrc`: `shamefully-hoist=true` + `strict-peer-dependencies=false`
4. Scaffold apps:
   - `apps/book` — `pnpm create vite@latest . -- --template vue-ts`
   - `apps/admin` — same template, minimal shell
   - `apps/api` — `pnpm init`, add typescript, basic entry point
5. Scaffold packages with `package.json` + `tsconfig.json` + `src/index.ts`:
   - `packages/core` (`@book/core`)
   - `packages/ui` (`@book/ui`)
   - `packages/i18n` (`@book/i18n`)
   - `packages/shared` (`@book/shared`)
6. Root `tsconfig.base.json` with path aliases for `@book/*`
7. Root devDependencies: typescript, vite, vitest, tailwindcss, postcss, autoprefixer, eslint, prettier
8. Configure Tailwind in `apps/book` — content paths include `packages/*/src/**/*.vue`
9. FSD structure in `apps/book/src/`: app/, pages/, widgets/, features/, entities/, shared/
10. Root scripts: `dev`, `dev:admin`, `dev:api`, `build`, `test`, `lint`, `typecheck`
11. Wire `workspace:*` dependencies between packages
12. Verify: `pnpm dev` works, `@book/*` imports resolve

**Done when:** Monorepo builds, packages importable, Tailwind renders.

---

## Step 2: Core Engine — Layout (Shared UI + i18n)

**Goal:** Foundation that all other features depend on.

**Agent:** Read `agents/shared/stack-context.md` + `agents/core/layout-agent.md`

**Actions:**
1. Follow LayoutAgent instructions → generate shared UI components
2. Place in `packages/ui/src/` — DeepDive, Callout, CodeBlock, DifficultyBadge, CrossLink, TabGroup, BaseButton, BaseCard, BaseModal
3. Setup `packages/i18n/src/` — vue-i18n config + `locales/ru.json`
4. Setup `packages/shared/src/` — shared types, composables (useHighlight, useCopyCode, useCollapsible)
5. QA: TesterAgent → ReviewerAgent → CommitterAgent

**Done when:** All shared components render, i18n works, dark mode works.

---

## Step 3: Core Engine — Sandbox

**Goal:** Code editor with real-time test execution.

**Agent:** `stack-context.md` + `sandbox-agent.md`

**Actions:**
1. Follow SandboxAgent → generate Monaco editor + test runner
2. Place in `packages/core/src/sandbox/`
3. Install `monaco-editor` in `packages/core`
4. Test with sample task
5. QA: Tester → Reviewer → Committer

**Done when:** User types code, tests run in Web Worker, results display live.

---

## Step 4: Core Engine — AI Chat

**Goal:** Context-aware AI mentor chat.

**Agent:** `stack-context.md` + `chat-agent.md`

**Actions:**
1. Follow ChatAgent → generate chat panel
2. Place in `packages/core/src/chat/`
3. Configure API endpoint (Claude by default)
4. QA cycle

**Done when:** Chat streams responses, knows chapter + code context, responds in Russian.

---

## Step 5: Core Engine — Remaining Features

**Goal:** Quiz, Tasks, Progress, Interview, Walkthrough.

Run agents in order, each through QA cycle:

1. `quiz-agent.md` → `packages/core/src/quiz/`
2. `task-agent.md` → `packages/core/src/tasks/`
3. `walkthrough-agent.md` → `packages/core/src/walkthrough/`
4. `interview-agent.md` → `packages/core/src/interview/`
5. `progress-agent.md` → `packages/core/src/progress/`

**Done when:** All features render and function independently.

---

## Step 6: Book App — Config + Routing

**Goal:** Chapter navigation, routing, page assembly in `apps/book`.

**Actions:**
1. Create `book.config.json` — sections, chapters, ordering
2. Setup vue-router in `apps/book`:
   - `/` — home with section overview + progress
   - `/:section/:chapter` — chapter page
   - `/:section/:chapter/:subchapter` — subchapter
   - `/:section/:chapter/tasks` — task list
   - `/:section/:chapter/playground` — sandbox
3. Build pages: home, chapter, subchapter
4. Build widgets: ChapterView (assembles all features), Sidebar (nav tree + progress)
5. MDX loader — Vite plugin for `.mdx` → Vue components
6. Wire up all `@book/core` features into chapter page

**Done when:** Full navigation works, chapter page shows all sections.

---

## Step 7: Generate First Chapter

**Goal:** First real chapter via content pipeline.

**Actions:**
1. Follow content pipeline (read each agent .md in order):
   Planner → Searcher → Reader → Analyzer → Writer → Visualizer
2. Topic: "JavaScript closures"
3. Save output to `content/ru/ch01-closures/`
4. Create tasks (easy × 2-3, medium × 1-2, hard × 2-3) with test files
5. Commit via CommitterAgent

**Done when:** ch01-closures fully navigable with all content.

---

## Step 8: Admin App

**Goal:** Content management interface.

**Actions:**
1. Build `apps/admin` — dashboard for managing chapters, running agents, viewing progress stats
2. Connect to `apps/api` for data persistence
3. Agent management UI: trigger pipelines, view logs, approve steps

---

## Step 9: Polish & Scale

- Generate remaining chapters section by section
- Add mini-projects at end of each section
- Responsive design pass
- Accessibility audit
- Performance optimization (lazy loading, code splitting)
- Deploy
