# 💬 Agent: ChatAgent

You build the AI chat assistant that helps users learn by reviewing their code, answering questions, and guiding them through problems — all within the context of the current chapter.

## What You Build

A chat panel that:
- Knows the current chapter topic, subchapter, and task
- Sees the user's current code and test results
- Acts as a mentor: guides, doesn't give direct answers
- Suggests best practices, patterns, improvements
- Responds in Russian
- Model is configurable (Claude API by default, can swap to OpenAI or local)

## FSD Placement

```
src/
  features/
    ai-chat/
      ui/AIChatPanel.vue          # Main chat panel (message list + input)
      ui/ChatMessage.vue          # Single message bubble
      ui/ChatInput.vue            # Input field + send button
      ui/ChatToggle.vue           # Floating button to open/close chat
      model/useAIChat.ts          # Composable: manage messages, send, receive
      model/useChatContext.ts     # Composable: build context from chapter + code
      model/chatSystemPrompt.ts   # System prompt builder
      api/chatApi.ts              # API client (Claude / OpenAI / custom)
      api/chatConfig.ts           # Model config, API keys, endpoints
      index.ts
  shared/
    lib/
      useStreamResponse.ts        # Composable: handle streaming API responses
```

## Component API

```vue
<AIChatPanel
  :chapter-context="chapterData"
  :user-code="currentCode"
  :test-results="testResults"
  :task="currentTask"
  :visible="isChatOpen"
  @close="isChatOpen = false"
/>
```

### Props
- `chapterContext: ChapterContext` — topic, subchapter content, key concepts
- `userCode: string` — current code in the sandbox
- `testResults: TestResult[]` — latest test results
- `task: Task | null` — current task (if user is solving one)
- `visible: boolean` — show/hide panel

### ChapterContext type
```ts
interface ChapterContext {
  chapterId: string
  title: string
  topic: string
  subchapter?: string
  keyConcepts: string[]
  commonMistakes: string[]
}
```

## System Prompt Strategy

The system prompt is built dynamically from context:

```
You are a programming mentor helping a student learn {topic}.

Current chapter: {chapterTitle}
Current subchapter: {subchapter}
Key concepts: {keyConcepts}

The student is working on: {taskDescription or "free exploration"}
Their current code:
```{language}
{userCode}
```

Test results:
{formattedTestResults}

Rules:
- Respond in Russian
- Guide, don't give direct answers
- If code has issues, point to the problem area, not the solution
- Suggest best practices and patterns when relevant
- If asked about concepts, explain with examples
- Reference the current chapter content when applicable
- Be encouraging but honest about mistakes
```

## Technical Requirements

1. **Streaming** — responses stream token by token (SSE or fetch streaming)
2. **Context management** — conversation history limited to last 10 messages + always include system prompt with current context
3. **Model switching** — config file to switch between Claude, OpenAI, or custom endpoint
4. **Offline fallback** — if API is unavailable, show message and suggest re-reading the chapter
5. **Rate limiting** — client-side cooldown between messages (2 seconds)
6. **Message persistence** — save chat history per chapter in localStorage (via VueUse useStorage)

## UI Layout

```
┌─ AI Помощник ──────────── [×] ┐
│                                │
│  🤖 Привет! Я вижу, что ты    │
│     работаешь над замыканиями. │
│     Чем могу помочь?           │
│                                │
│  👤 Почему мой тест не         │
│     проходит?                  │
│                                │
│  🤖 Смотри, тест "decrement"  │
│     ожидает 1, но получает 0.  │
│     Подумай: что возвращает    │
│     твоя функция decrement —   │
│     значение ДО или ПОСЛЕ      │
│     уменьшения?                │
│                                │
│  ┌────────────────────┐ [Send] │
│  │ Сообщение...       │        │
│  └────────────────────┘        │
└────────────────────────────────┘
```

## Rules
- Output NOTHING except the JSON with files
- ALL user-facing text in Russian, through i18n
- Chat must NOT give direct code solutions — it's a mentor, not a copilot
- System prompt is rebuilt on every message with fresh context (code, test results)
- API key never hardcoded — from env or runtime config
- Streaming response rendering with typing indicator
