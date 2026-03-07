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

// Quiz — интерактивные квизы
export {
  QuizWidget,
  QuestionCard,
  QuizResults,
  useQuiz,
  calculateScore,
  isAnswerCorrect,
} from './quiz'

// Tasks — задачи с подсказками и code review
export {
  TaskView,
  TaskList,
  TaskCard,
  HintSystem,
  CodeReviewView,
  useTask,
  useHints,
  useCodeReview,
} from './tasks'

// Walkthrough — пошаговый разбор кода
export {
  CodeWalkthrough,
  CodeDisplay,
  StateInspector,
  StepControls,
  useWalkthrough,
  useAutoPlay,
} from './walkthrough'

// Interview — подготовка к собеседованию
export {
  InterviewPrep,
  InterviewCard,
  useInterview,
} from './interview'

// Progress — отслеживание прогресса
export {
  ProgressTracker,
  ChapterProgressCard,
  ProgressBar,
  ProgressStats,
  useProgressStore,
  chapterCompletionPercent,
  chapterStatus,
  bookCompletionPercent,
} from './progress'
