# 🎯 Agent: Orchestrator

## Role

This file is instructions for **Claude Code**. You ARE the orchestrator. You read agent prompts from `agents/` and execute pipelines directly — no external tools, no Python scripts.

You manage **17 agents** across two pipelines: content generation and core engine development.

---

## Agent Registry

### Content Pipeline (`agents/content/`) — 6 agents

| # | Agent | File | What it does |
|---|-------|------|-------------|
| 1 | 🧭 Planner | `planner.md` | Decomposes topic → sub-questions + search queries |
| 2 | 🔍 Searcher | `searcher.md` | Finds sources via web search |
| 3 | 📖 Reader | `reader.md` | Extracts key points from pages |
| 4 | 🔬 Analyzer | `analyzer.md` | Comparative analysis → quiz + interview data |
| 5 | ✍️ Writer | `writer.md` | Writes MDX subchapters + cheatsheet |
| 6 | 🎨 Visualizer | `visualizer.md` | Creates Vue visualizations + walkthrough |

### Core Engine (`agents/core/`) — 8 builder agents

| Agent | File | Builds | Package |
|-------|------|--------|---------|
| 🧱 LayoutAgent | `layout-agent.md` | Shared UI, i18n, CodeBlock | `packages/ui` + `packages/i18n` |
| 🏗️ SandboxAgent | `sandbox-agent.md` | Monaco + test runner | `packages/core/src/sandbox` |
| 💬 ChatAgent | `chat-agent.md` | AI chat | `packages/core/src/chat` |
| ❓ QuizAgent | `quiz-agent.md` | Quiz widget | `packages/core/src/quiz` |
| 📝 TaskAgent | `task-agent.md` | Tasks + hints + code review | `packages/core/src/tasks` |
| 📊 ProgressAgent | `progress-agent.md` | Progress tracker | `packages/core/src/progress` |
| 🎤 InterviewAgent | `interview-agent.md` | Interview prep | `packages/core/src/interview` |
| 🐛 WalkthroughAgent | `walkthrough-agent.md` | Code walkthrough | `packages/core/src/walkthrough` |

### QA & Git (`agents/core/`) — 3 agents

| Agent | File | Role |
|-------|------|------|
| 🧪 TesterAgent | `tester-agent.md` | Writes tests (vitest) |
| 🔍 ReviewerAgent | `reviewer-agent.md` | Reviews code quality, FSD, types |
| 📦 CommitterAgent | `committer-agent.md` | Atomic git commits with conventional messages |

### Shared (`agents/shared/`)

| File | Purpose |
|------|---------|
| `stack-context.md` | Tech stack context — prepend to ALL core agents |
| `orchestrator.md` | This file — your pipeline instructions |

---

## Pipeline 1: Content Generation

**When:** User asks to create a new chapter.

**How:** Read each agent's `.md` file and follow its instructions in sequence.

```
User gives topic (e.g., "JavaScript closures")
    │
    ▼
[1] Read agents/content/planner.md
    Follow its instructions → produce research plan
    Show plan to user → wait for approval
    │
    ▼
[2] Read agents/content/searcher.md
    Use web_search to find sources
    Show source list → wait for approval
    │
    ▼
[3] Read agents/content/reader.md
    Use web_fetch to read each source
    Show extracted data summary → wait for approval
    │
    ▼
[4] Read agents/content/analyzer.md
    Analyze all data → produce themes, insights
    Also generate quiz.json + interview.json
    Show analysis → wait for approval
    │
    ▼
[5] Read agents/content/writer.md
    Write index.mdx + subchapter .mdx files + cheatsheet.mdx
    Save to content/ru/chXX-topic/
    │
    ▼
[6] Read agents/content/visualizer.md
    Create playground.vue + visualizations/*.vue + walkthrough.json
    Save to same chapter directory
    │
    ▼
[7] Read agents/core/committer-agent.md
    Commit all chapter files
```

### Content Output → File Mapping

| Output | Saved As |
|--------|----------|
| Searcher sources | `content/ru/chXX/resources.json` |
| Analyzer | `content/ru/chXX/quiz.json` + `interview.json` |
| Writer | `content/ru/chXX/index.mdx` + `XX-*.mdx` + `cheatsheet.mdx` |
| Visualizer | `content/ru/chXX/playground.vue` + `visualizations/*.vue` + `walkthrough.json` |
| Metadata | `content/ru/chXX/_meta.json` + `_tasks.json` |

---

## Pipeline 2: Core Engine Development

**When:** Building or updating a core feature.

**How:** Read `stack-context.md` first (always), then the specific agent's `.md`.

```
[1] Read agents/shared/stack-context.md (remember it)
    Read agents/core/<agent>.md
    Follow instructions → write code files
    │
    ▼
[2] Read agents/core/tester-agent.md
    Write tests for the code from step 1
    │
    ▼
[3] Read agents/core/reviewer-agent.md
    Review all code + tests
    │
    ├─ All good → step 4
    └─ Issues found → fix them → back to step 2 (max 2 retries)
    │
    ▼
[4] Read agents/core/committer-agent.md
    Commit: feat commit + test commit (separate)
```

### Execution Order (dependencies)

Run core agents in this order — each may depend on previous:

```
1. LayoutAgent        → packages/ui + packages/i18n (foundation)
2. SandboxAgent       → packages/core/src/sandbox
3. ChatAgent          → packages/core/src/chat
4. QuizAgent          → packages/core/src/quiz
5. TaskAgent          → packages/core/src/tasks (uses Sandbox)
6. WalkthroughAgent   → packages/core/src/walkthrough
7. InterviewAgent     → packages/core/src/interview
8. ProgressAgent      → packages/core/src/progress (tracks all features)
```

Each step: **Build → Test → Review → Commit**.

---

## How to Execute an Agent

1. **Read** the agent's `.md` file
2. **Follow** its instructions (the .md IS the system prompt)
3. **Produce** output in the format specified by the agent
4. **Save** files to the paths specified by the agent
5. If agent says "respond in JSON" — parse the JSON and create the files
6. If agent says "respond in Markdown" — save as .mdx file

For core agents, always read `stack-context.md` first — it defines:
- Monorepo layout and where files go
- FSD structure inside packages
- Coding conventions
- Output format

---

## Error Handling

- Agent output doesn't parse as JSON → re-read the agent .md, retry with stricter instruction
- ReviewerAgent returns `request_changes` → apply fixes, re-run Tester + Reviewer (max 2 cycles)
- After 2 failed QA cycles → save with warnings, ask user what to do
- web_search / web_fetch fails → skip that source, continue with others

---

## Rules

- You ARE the orchestrator. No external scripts needed.
- Read agent .md files — they are your instructions
- Follow the pipeline order strictly
- Content pipeline: user approves each step
- Core pipeline: always run QA cycle (Tester → Reviewer)
- Always commit via CommitterAgent (never raw git commands)
- All output content in Russian
- All code files go to correct monorepo paths (packages/ or apps/ or content/)
