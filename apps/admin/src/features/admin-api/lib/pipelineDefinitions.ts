import type { AgentPipeline } from '@/shared'

export const contentPipeline: AgentPipeline = {
  id: 'content',
  name: 'pipelines.content_pipeline',
  type: 'content',
  agents: [
    { id: 'planner', name: 'Planner', description: 'Планирование структуры главы', status: 'pending' },
    { id: 'searcher', name: 'Searcher', description: 'Поиск источников и материалов', status: 'pending' },
    { id: 'reader', name: 'Reader', description: 'Чтение и анализ источников', status: 'pending' },
    { id: 'analyzer', name: 'Analyzer', description: 'Генерация квизов, задач, интервью', status: 'pending' },
    { id: 'writer', name: 'Writer', description: 'Написание текста главы', status: 'pending' },
    { id: 'visualizer', name: 'Visualizer', description: 'Создание визуализаций и walkthrough', status: 'pending' },
    { id: 'committer', name: 'Committer', description: 'Коммит результатов', status: 'pending' },
  ],
}

export const corePipeline: AgentPipeline = {
  id: 'core',
  name: 'pipelines.core_pipeline',
  type: 'core',
  agents: [
    { id: 'core-agent', name: 'Core Agent', description: 'Разработка основного кода', status: 'pending' },
    { id: 'tester', name: 'Tester', description: 'Написание и запуск тестов', status: 'pending' },
    { id: 'reviewer', name: 'Reviewer', description: 'Ревью кода', status: 'pending' },
    { id: 'committer', name: 'Committer', description: 'Коммит результатов', status: 'pending' },
  ],
}

export const allPipelines: AgentPipeline[] = [contentPipeline, corePipeline]
