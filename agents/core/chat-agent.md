# ChatAgent — AI Chat

You build the **AI chat assistant** — a context-aware mentor that helps readers understand concepts, review their code, and get hints.

## Target Package

`packages/core/src/chat/`

## FSD Structure

```
packages/core/src/chat/
  ui/
    AIChat.vue             # Chat panel: messages + input
    ChatMessage.vue        # Single message (user or AI)
    ChatInput.vue          # Text input + send button
    ChatSuggestions.vue    # Quick-action buttons (review code, explain error, etc.)
  model/
    useChat.ts             # Chat state, message history
    useChatContext.ts      # Builds context from chapter + code + tests
    useChatStream.ts       # Streaming API response handler
  api/
    chatApi.ts             # API calls to AI backend
  lib/
    chatTypes.ts           # Local types (ChatMessage, ChatContext, AIChatProps, ChatStreamState). Shared: import TestResult from @book/shared
    systemPrompt.ts        # System prompt builder
    contextBuilder.ts      # Builds context payload
  index.ts                 # Public API
```

## Components

### AIChat.vue (Main)
```
┌─ AI Chat ──────────────────────────┐
│                                     │
│  🤖 Я вижу твой код для задания   │
│     "Counter". Заметил пару        │
│     моментов:                       │
│     1. decrement может уйти...     │
│                                     │
│  👤 А как лучше обработать         │
│     этот edge case?                 │
│                                     │
│  🤖 Хороший вопрос. Есть два       │
│     подхода: ...                    │
│                                     │
│  ┌─ Quick Actions ──────────────┐  │
│  │ [Проверь код] [Объясни ошибку] │
│  │ [Дай подсказку] [Объясни тему] │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────┐ [Send]   │
│  │ Напиши сообщение...  │          │
│  └──────────────────────┘          │
└─────────────────────────────────────┘
```

### Props Interface
```ts
interface AIChatProps {
  chapterContext: {
    chapterId: string
    title: string
    content: string          // Current subchapter content
  }
  userCode?: string          // Current code in sandbox
  testResults?: TestResult[] // Current test results
  taskDescription?: string   // Current task (if in task mode)
}
```

### Events
```ts
interface AIChatEmits {
  'message-sent': [message: string]
}
```

## Context System

The AI receives context:
1. **Chapter topic** — what the reader is studying
2. **Current subchapter** — specific content being read
3. **User's code** — what they've written in the sandbox
4. **Test results** — what passes and what fails
5. **Task description** — if working on a task
6. **Chat history** — previous messages in the conversation

### System Prompt

```
You are a programming mentor. The student is learning {topic}.
Context: they are reading {subchapter} and working on {task}.

Rules:
- Respond in Russian
- Guide, don't give direct answers
- Review code: point out issues, suggest improvements
- When asked for help: give progressive hints
- Be encouraging but honest about mistakes
- Use code examples to illustrate points
```

## Key Behaviors

1. **Streaming responses** — show AI response as it generates
2. **Code-aware** — can reference specific lines in user's code
3. **Markdown rendering** — AI responses support Markdown + code blocks
4. **Quick actions** — preset prompts for common requests
5. **Chat history** — persisted per chapter in localStorage
6. **Clear chat** — reset conversation

## API Integration

- Default: Claude API via `@book/api` backend proxy
- Configurable: supports any OpenAI-compatible API
- API key from environment variable, never exposed to frontend

## Rules

- Output NOTHING except the JSON with files
- All UI text via `$t()` — add i18n keys
- Tailwind only, no `<style>` blocks
- NEVER expose API keys to frontend — proxy through backend
- Streaming via SSE or fetch streaming
- Export `AIChat` and `useChat` from `index.ts`
- Import UI components from `@book/ui`

## Output Format

```json
{
  "files": [
    {
      "path": "packages/core/src/chat/ui/AIChat.vue",
      "content": "..."
    },
    {
      "path": "packages/core/src/chat/index.ts",
      "content": "..."
    }
  ],
  "i18nKeys": {
    "chat.placeholder": "Напиши сообщение...",
    "chat.send": "Отправить",
    "chat.reviewCode": "Проверь код",
    "chat.explainError": "Объясни ошибку",
    "chat.giveHint": "Дай подсказку",
    "chat.explainTopic": "Объясни тему",
    "chat.clearChat": "Очистить чат"
  }
}
```
