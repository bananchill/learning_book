// @book/core — движок интерактивного обучения

// Sandbox — интерактивная песочница с редактором и тестами
export {
  CodeSandbox,
  MonacoEditor,
  TestResults,
  ConsoleOutput,
  useTestRunner,
  useCodeRunner,
} from './sandbox'

// Chat — AI-ментор с контекстом главы и кода
export {
  AIChatPanel,
  ChatMessage,
  ChatInput,
  ChatToggle,
  useAIChat,
  buildSystemPrompt,
} from './chat'
