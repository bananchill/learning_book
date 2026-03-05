# 📘 Interactive Learning Book — Full Specification

## Vision

An interactive technical book (JS/TS, Architecture, Databases, DevOps) with:
- Deep topic coverage: surface → mechanics → internals
- Live code sandbox with real-time test feedback
- AI chat assistant per chapter (code review, hints, best practices)
- Visualizations of concepts AND problems
- Tasks from easy to hard with progressive hints
- Interview prep, antipatterns, real-world examples, cheat sheets

---

## 1. Book Structure

### Hierarchy

```
ch01-closures/
├── index.mdx                    # Main chapter page (overview + links to subchapters)
├── _meta.json                   # Chapter metadata
│
├── 01-what-and-why.mdx          # Subchapter: что это и зачем
├── 02-how-it-works.mdx          # Subchapter: как работает
├── 03-common-problems.mdx       # Subchapter: проблемы + визуализация проблем
├── 04-real-world.mdx            # Subchapter: в реальном мире (React, Express, etc.)
├── 05-antipatterns.mdx          # Subchapter: антипаттерны
│
├── playground.jsx               # Sandbox — free experimentation
├── visualizations/
│   ├── scope-chain.jsx          # Concept visualization
│   └── loop-closure-bug.jsx     # Problem visualization
├── walkthrough.json             # Step-by-step debugger data
│
├── tasks/
│   ├── 01-easy-counter.js       # Easy task
│   ├── 01-easy-counter.test.js
│   ├── 02-easy-once.js
│   ├── 02-easy-once.test.js
│   ├── 03-medium-memoize.js     # Medium task
│   ├── 03-medium-memoize.test.js
│   ├── 04-hard-event-emitter.js # Hard task
│   ├── 04-hard-event-emitter.test.js
│   ├── 05-hard-middleware.js    # Hard task (several hard ones)
│   ├── 05-hard-middleware.test.js
│   └── _tasks.json              # Task metadata, hints, difficulty
│
├── code-review/
│   ├── 01-review.js             # Bad code to review/refactor
│   └── 01-review.json           # Expected issues + model solution
│
├── interview.json               # Interview questions with analysis
├── cheatsheet.mdx               # One-page summary
└── resources.json               # Related articles, videos, books (from agents)
```

### Chapter `index.mdx`

The main page introduces the topic and links to subchapters:

```mdx
---
title: "Замыкания"
description: "Полный разбор замыканий: от основ до внутренностей V8"
---

## О чём эта глава

Краткое введение — 2-3 абзаца, мотивация, где используется.

## Содержание

1. [Что это и зачем](/ch01-closures/01-what-and-why) — основы, аналогии
2. [Как это работает](/ch01-closures/02-how-it-works) — механика, scope chain
3. [Проблемы](/ch01-closures/03-common-problems) — ловушки, утечки памяти
4. [В реальном мире](/ch01-closures/04-real-world) — React hooks, Express middleware
5. [Антипаттерны](/ch01-closures/05-antipatterns) — что НЕ делать и почему

## Связанные темы

- [Event Loop](/ch03-event-loop) — замыкания в асинхронном коде
- [Прототипы](/ch02-prototypes) — замыкания vs приватные поля в классах

## Задания → [Перейти к заданиям](/ch01-closures/tasks)
## Песочница → [Открыть](/ch01-closures/playground)
```

### Subchapter MDX

Each subchapter is focused on ONE aspect:

```mdx
---
title: "Как работают замыкания"
parent: "ch01-closures"
order: 2
---

{/* Content with code examples, visualizations where needed */}
{/* Cross-links: if mentions "event loop" → link to ch03 */}
{/* DeepDive blocks for internals — collapsed by default */}
```

### Cross-Linking Rule

When a subchapter mentions a concept covered in another chapter:

```mdx
Замыкания часто встречаются в асинхронном коде.
Подробнее о том, как работает [Event Loop →](/ch03-event-loop).
```

Never re-explain a topic that has its own chapter. Link to it.

---

## 2. Core Engine (Reusable)

The core engine is a standalone package used by every chapter.

### Components

```
core/
├── Sandbox/
│   ├── Sandbox.jsx              # Code editor + runner + test output
│   ├── CodeEditor.jsx           # Monaco-based code editor
│   ├── TestRunner.jsx           # Runs vitest in browser, real-time results
│   └── TestOutput.jsx           # Shows: ✅ passed / ❌ failed + what went wrong
│
├── AIChat/
│   ├── AIChat.jsx               # Chat panel tied to current chapter
│   ├── ChatProvider.jsx         # Context: chapter content, user code, task
│   └── chatApi.js               # Calls Claude API with chapter-aware system prompt
│
├── Visualizer/
│   ├── CodeWalkthrough.jsx      # Step-by-step debugger from walkthrough.json
│   ├── DiagramRenderer.jsx      # Renders Mermaid / custom diagrams
│   └── InteractiveViz.jsx       # Wrapper for chapter-specific .jsx visualizations
│
├── Quiz/
│   ├── Quiz.jsx                 # Renders quiz.json — multiple choice, true/false, code output
│   ├── QuizQuestion.jsx         # Single question component
│   └── QuizResults.jsx          # Score + explanations
│
├── Tasks/
│   ├── TaskList.jsx             # List of tasks with difficulty badges
│   ├── TaskView.jsx             # Single task: description + Sandbox + hints
│   ├── HintSystem.jsx           # 3-level progressive hints
│   └── CodeReview.jsx           # "Find the bugs" task type
│
├── Progress/
│   ├── ProgressTracker.jsx      # Overall progress: chapters, tasks, quizzes
│   ├── ChapterProgress.jsx      # Per-chapter completion
│   └── progressStore.js         # Persistent progress state
│
├── Layout/
│   ├── DeepDive.jsx             # Collapsible deep-dive section
│   ├── Callout.jsx              # Info / warning / tip boxes
│   ├── CrossLink.jsx            # Smart link to other chapters
│   ├── Cheatsheet.jsx           # Renders cheatsheet.mdx in modal/sidebar
│   └── DifficultyBadge.jsx      # Easy / Medium / Hard badge
│
└── Interview/
    ├── InterviewPrep.jsx        # Interview questions with hidden answers
    └── InterviewQuestion.jsx    # Single question: what interviewer expects, common mistakes
```

### Sandbox: How It Works

```
┌─────────────────────────────────────────────┐
│  CodeEditor (Monaco)                        │
│  ┌─────────────────────────────────────┐    │
│  │ // Твой код здесь                   │    │
│  │ function createCounter() {          │    │
│  │   ...                               │    │
│  │ }                                   │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─ TestOutput (real-time) ──────────────┐  │
│  │ ✅ starts at 0                        │  │
│  │ ✅ increment returns new value        │  │
│  │ ❌ decrement — expected 1, got 0      │  │
│  │ ⏳ each counter is independent        │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  [💡 Подсказка 1/3]  [🤖 Спросить AI]      │
└─────────────────────────────────────────────┘
```

- Editor: Monaco with syntax highlighting, autocomplete
- Tests run on every keystroke (debounced) or on button press
- Each failed test shows: expected vs received, line reference
- Hint button reveals progressive hints (direction → approach → near-solution)
- AI Chat button opens chat panel with context about current task + user code

### AI Chat: How It Works

```
┌─ AI Chat ──────────────────────────────────┐
│                                             │
│  🤖 Я вижу твой код для задания "Counter". │
│     Заметил пару моментов:                  │
│     1. decrement может уйти в минус...      │
│                                             │
│  👤 А как лучше обработать этот edge case?  │
│                                             │
│  🤖 Хороший вопрос. Есть два подхода:       │
│     ...                                     │
│                                             │
│  ┌──────────────────────────────┐  [Send]   │
│  │ Напиши сообщение...         │           │
│  └──────────────────────────────┘           │
└─────────────────────────────────────────────┘
```

Context passed to AI:
- Chapter topic + current subchapter content
- Current task description + tests
- User's current code
- Test results (what passes, what fails)
- System prompt: "You are a mentor. Review code, suggest best practices, guide towards solution without giving direct answers. Respond in Russian."

The AI model is configurable — can use Claude API, OpenAI, or a local model.

### Sandbox + AI Chat = Reusable Core

This is a standalone package:

```jsx
import { Sandbox, AIChat } from '@book/core'

// In any chapter:
<Sandbox
  task={taskData}
  tests={testCode}
  hints={hints}
/>

<AIChat
  chapterContext={chapterContent}
  userCode={currentCode}
  testResults={results}
/>
```

---

## 3. Tasks System

### Difficulty Levels

| Level | Count per chapter | Description |
|-------|------------------|-------------|
| Easy | 2-3 | One concept, direct application |
| Medium | 1-2 | Combine concepts, some thinking |
| Hard | 2-3 | Complex scenarios, edge cases, real-world |

### `_tasks.json`

```json
{
  "chapter": "ch01-closures",
  "tasks": [
    {
      "id": "01-easy-counter",
      "title": "Простой счётчик",
      "difficulty": "easy",
      "description": "Создай функцию createCounter с замыканием",
      "file": "01-easy-counter.js",
      "test_file": "01-easy-counter.test.js",
      "concepts": ["closure", "state"],
      "hints": [
        "Подумай, где объявить переменную count, чтобы она была доступна внутренним функциям, но не снаружи",
        "Функция должна возвращать объект с методами. Каждый метод — это замыкание над count",
        "let count = 0; return { increment() { return ++count; }, ... }"
      ],
      "estimated_minutes": 5
    },
    {
      "id": "04-hard-event-emitter",
      "title": "Event Emitter",
      "difficulty": "hard",
      "description": "Реализуй EventEmitter используя замыкания вместо классов",
      "file": "04-hard-event-emitter.js",
      "test_file": "04-hard-event-emitter.test.js",
      "concepts": ["closure", "callback", "pub-sub"],
      "hints": [
        "Тебе нужна Map/объект для хранения слушателей по имени события",
        "on() добавляет callback в массив, emit() вызывает все callbacks, off() удаляет",
        "Не забудь про once() — слушатель который удаляется после первого вызова"
      ],
      "estimated_minutes": 20
    }
  ]
}
```

### Code Review Tasks

Different from coding tasks — user gets BAD code and must find/fix issues:

```json
{
  "id": "01-review",
  "title": "Найди проблемы с замыканиями",
  "code_file": "01-review.js",
  "issues": [
    {
      "line": 5,
      "type": "bug",
      "description": "Замыкание в цикле с var — все колбэки получат одно значение",
      "fix": "Заменить var на let"
    },
    {
      "line": 12,
      "type": "memory_leak",
      "description": "Большой массив удерживается замыканием без необходимости",
      "fix": "Извлечь нужное значение в отдельную переменную"
    },
    {
      "line": 18,
      "type": "best_practice",
      "description": "Можно использовать каррирование вместо вложенных if",
      "fix": "Рефакторинг в curried функцию"
    }
  ]
}
```

---

## 4. Interview Section

### `interview.json`

```json
{
  "chapter": "ch01-closures",
  "questions": [
    {
      "id": "i1",
      "question": "Что такое замыкание?",
      "level": "junior",
      "good_answer": "Замыкание — это функция, которая запоминает лексическое окружение, в котором была создана...",
      "what_interviewer_wants": "Понимание scope chain, ссылка vs копия, простой пример",
      "common_mistakes": [
        "Путают с контекстом (this)",
        "Говорят что замыкание создаётся только при return",
        "Не могут привести практический пример"
      ],
      "follow_ups": [
        "А что запоминает замыкание — значение или ссылку?",
        "Покажи пример утечки памяти через замыкание"
      ]
    }
  ]
}
```

---

## 5. Visualizations

### Types

1. **Concept visualizations** — как работает (scope chain, event loop, memory layout)
2. **Problem visualizations** — что идёт не так (closure in loop bug, memory leak)
3. **Comparison visualizations** — var vs let, sync vs async, etc.

Each is a self-contained `.jsx` in `visualizations/`.

### Naming

```
visualizations/
  scope-chain.jsx           # concept: how scope chain works
  loop-closure-bug.jsx      # problem: var in loop
  var-vs-let-scope.jsx      # comparison: var vs let
```

---

## 6. Chapter Sections Summary

Every chapter MAY have (agents decide based on topic):

| Section | File(s) | Required? |
|---------|---------|-----------|
| Overview + links | `index.mdx` | Always |
| Subchapters (2-5) | `XX-name.mdx` | Always |
| Playground / Sandbox | `playground.jsx` | Always |
| Visualizations | `visualizations/*.jsx` | Where useful |
| Code walkthrough | `walkthrough.json` | Where useful |
| Tasks (easy→hard) | `tasks/` | Always |
| Code review tasks | `code-review/` | Where useful |
| Quiz | `quiz.json` | Always |
| Interview prep | `interview.json` | Always |
| Cheat sheet | `cheatsheet.mdx` | Always |
| Related resources | `resources.json` | Always |
| AI Chat context | Built from chapter content | Always (core engine) |

---

## 7. Agent → Book Pipeline

When generating a chapter, agents produce:

| Step | Agent | Output | Book File |
|------|-------|--------|-----------|
| 1 | Planner | Research plan | (internal) |
| 2 | Searcher | Sources | `resources.json` |
| 3 | Reader | Extracted data | (internal) |
| 4 | Analyzer | Analysis | → `quiz.json` + `interview.json` |
| 5 | Writer | Content | → `index.mdx` + subchapter `.mdx` files |
| 6 | Visualizer | React + walkthrough | → `visualizations/*.jsx` + `walkthrough.json` + `playground.jsx` |
| — | Orchestrator | Metadata | → `_meta.json` + `_tasks.json` |

**Writer agent** must:
- Split content into subchapters (not one giant file)
- Add cross-links to other chapters
- Include antipatterns section
- Include real-world examples section
- Write cheatsheet

**Analyzer agent** additionally generates:
- Quiz questions from sub-question answers
- Interview questions from key insights + common misconceptions

---

## 8. Depth Control

### Default: standard
- Subchapters cover surface + mechanics
- DeepDive blocks: 1 paragraph (teaser)
- Tasks: 2 easy + 1 medium + 2 hard
- Quiz: 5 questions

### On request: deep
- Subchapters expanded with internals, benchmarks, engine specifics
- DeepDive blocks: full expansion
- Tasks: 3 easy + 2 medium + 3 hard (including performance tasks)
- Quiz: 8-10 questions with edge cases
- Additional subchapter possible: "XX-internals.mdx"

### Triggers
User says: "копай глубже", "go deeper", "подробнее", "internals", "senior-level"

---

## 9. Mini-Projects

At the end of each SECTION (not chapter), there is a mini-project that combines all chapters:

```
01-javascript/
  ...chapters...
  project/
    README.md              # Project description
    starter/               # Starter code
    tests/                 # Full test suite
    solution/              # Reference solution (hidden)
```

Examples:
- **JS section** → Build a reactive state management library (uses closures, prototypes, event loop, promises)
- **Architecture section** → Design a plugin system with DDD principles
- **Database section** → Build a simple query builder with query optimization
- **DevOps section** → Create a CI/CD pipeline config for a microservice
