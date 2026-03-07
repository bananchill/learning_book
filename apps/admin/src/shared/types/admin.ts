/** Агрегированная статистика для дашборда */
export interface AdminStats {
  totalSections: number
  totalChapters: number
  totalTasks: number
  totalQuizQuestions: number
  totalInterviewQuestions: number
  chaptersWithContent: number
  chaptersEmpty: number
  contentCoverage: {
    tasks: number
    quiz: number
    interview: number
    walkthrough: number
    codeReview: number
  }
}

/** Элемент списка глав */
export interface ChapterListItem {
  id: string
  title: string
  description: string
  section: string
  sectionTitle: string
  order: number
  hasQuiz: boolean
  hasTasks: boolean
  hasInterview: boolean
  hasWalkthrough: boolean
  taskCount: number
  quizQuestionCount: number
}

/** Полные данные главы */
export interface ChapterDetail {
  meta: Record<string, unknown> | null
  quiz: { questions: unknown[] } | null
  tasks: unknown[] | null
  interview: { questions: unknown[] } | null
  walkthrough: { title: string; code: string; steps: unknown[] } | null
  resources: unknown[] | null
  codeReview: { issues: unknown[] } | null
  subchapterFiles: string[]
}

/** Шаг агентского пайплайна */
export interface AgentStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

/** Агентский пайплайн */
export interface AgentPipeline {
  id: string
  name: string
  type: 'content' | 'core'
  agents: AgentStep[]
}
