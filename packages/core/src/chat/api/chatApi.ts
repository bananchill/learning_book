// Streaming API клиент для AI Chat

import { getChatConfig } from './chatConfig'

interface ApiMessage {
  role: 'user' | 'assistant'
  content: string
}

interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: string) => void
}

// Отправка сообщения с потоковым ответом
export async function sendChatMessage(
  systemPrompt: string,
  messages: ApiMessage[],
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const config = getChatConfig()

  if (!config.apiKey) {
    callbacks.onError('API ключ не настроен')
    return
  }

  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        system: systemPrompt,
        stream: true,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal,
    })

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      callbacks.onError(`HTTP ${response.status}: ${text || response.statusText}`)
      return
    }

    if (!response.body) {
      callbacks.onError('Пустой ответ от сервера')
      return
    }

    // Обработка SSE потока
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (data === '[DONE]') continue

        try {
          const event = JSON.parse(data)

          if (event.type === 'content_block_delta' && event.delta?.text) {
            callbacks.onToken(event.delta.text)
          }

          if (event.type === 'message_stop') {
            callbacks.onDone()
            return
          }

          if (event.type === 'error') {
            callbacks.onError(event.error?.message || 'Ошибка API')
            return
          }
        } catch {
          // Пропускаем невалидный JSON
        }
      }
    }

    callbacks.onDone()
  } catch (err) {
    if (signal?.aborted) return
    callbacks.onError(
      err instanceof TypeError
        ? 'Сервис недоступен'
        : err instanceof Error
          ? err.message
          : 'Неизвестная ошибка',
    )
  }
}
