// Конфигурация AI Chat — endpoint, модель, API ключ

export interface ChatConfig {
  endpoint: string
  model: string
  apiKey: string
  maxTokens: number
}

export function getChatConfig(): ChatConfig {
  return {
    endpoint: import.meta.env.VITE_CHAT_ENDPOINT || '/api/chat',
    model: import.meta.env.VITE_CHAT_MODEL || 'claude-sonnet-4-20250514',
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    maxTokens: Number(import.meta.env.VITE_CHAT_MAX_TOKENS) || 1024,
  }
}
