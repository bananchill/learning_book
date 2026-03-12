import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import type { ChatMessage, ChapterContext, Task, TestResult } from '@book/shared'
import { sendChatMessage } from '../api/chatApi'
import { buildSystemPrompt } from './useChatContext'

const COOLDOWN_MS = 2000
const MAX_HISTORY = 10

export interface UseAIChatOptions {
  chapterContext?: () => ChapterContext | undefined
  userCode?: () => string
  testResults?: () => TestResult[]
  task?: () => Task | null
}

// Генерация уникального ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function useAIChat(chapterId: string, options: UseAIChatOptions = {}) {
  // Персистентная история сообщений на главу
  const messages = useStorage<ChatMessage[]>(`book-chat-${chapterId}`, [])
  const isStreaming = ref(false)
  const error = ref<string | null>(null)
  const cooldown = ref(false)

  let abortController: AbortController | null = null

  const canSend = computed(() => !isStreaming.value && !cooldown.value)

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || !canSend.value) return

    // Сообщение пользователя
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    }
    messages.value = [...messages.value, userMsg]

    // Заглушка для ответа ассистента (будет заполняться потоком)
    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    messages.value = [...messages.value, assistantMsg]

    // Кулдаун
    cooldown.value = true
    setTimeout(() => { cooldown.value = false }, COOLDOWN_MS)

    // Системный промпт с актуальным контекстом
    const systemPrompt = buildSystemPrompt({
      chapterContext: options.chapterContext?.(),
      userCode: options.userCode?.(),
      testResults: options.testResults?.(),
      task: options.task?.(),
    })

    // Последние N сообщений для API
    const apiMessages = messages.value
      .filter((m) => m.content.length > 0)
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }))

    // Стриминг
    isStreaming.value = true
    error.value = null
    abortController = new AbortController()

    await sendChatMessage(
      systemPrompt,
      // Убираем пустое сообщение ассистента из API запроса
      apiMessages.filter((m, i) => !(i === apiMessages.length - 1 && m.role === 'assistant' && m.content === '')),
      {
        onToken(token) {
          // Обновляем последнее сообщение ассистента
          const msgs = [...messages.value]
          const last = msgs[msgs.length - 1]
          if (last && last.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content: last.content + token }
            messages.value = msgs
          }
        },
        onDone() {
          isStreaming.value = false
          abortController = null
        },
        onError(err) {
          error.value = err
          isStreaming.value = false
          abortController = null
          // Удаляем пустое сообщение ассистента при ошибке
          const msgs = [...messages.value]
          const last = msgs[msgs.length - 1]
          if (last && last.role === 'assistant' && last.content === '') {
            msgs.pop()
            messages.value = msgs
          }
        },
      },
      abortController.signal,
    )
  }

  function stop() {
    abortController?.abort()
    isStreaming.value = false
    abortController = null
  }

  function clear() {
    stop()
    messages.value = []
    error.value = null
  }

  return {
    messages,
    isStreaming,
    error,
    canSend,
    cooldown,
    send,
    stop,
    clear,
  }
}
