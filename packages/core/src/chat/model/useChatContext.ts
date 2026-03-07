import type { ChapterContext, Task, TestResult } from '@book/shared'

// Построение системного промпта из контекста главы, кода и результатов тестов
export function buildSystemPrompt(options: {
  chapterContext?: ChapterContext
  userCode?: string
  testResults?: TestResult[]
  task?: Task | null
}): string {
  const { chapterContext, userCode, testResults, task } = options

  const parts: string[] = [
    'Ты — программистский ментор, помогающий студенту учиться.',
    '',
    'Правила:',
    '- Отвечай на русском языке',
    '- Направляй, но не давай готовых ответов',
    '- Если в коде есть ошибка, укажи на проблемную область, но не пиши решение',
    '- Предлагай лучшие практики и паттерны, когда уместно',
    '- Если спрашивают о концепциях, объясняй с примерами',
    '- Ссылайся на текущую главу, когда применимо',
    '- Будь поддерживающим, но честным в отношении ошибок',
  ]

  if (chapterContext) {
    parts.push(
      '',
      `Текущая глава: ${chapterContext.title}`,
      `Тема: ${chapterContext.topic}`,
    )
    if (chapterContext.subchapter) {
      parts.push(`Подраздел: ${chapterContext.subchapter}`)
    }
    if (chapterContext.keyConcepts.length > 0) {
      parts.push(`Ключевые концепции: ${chapterContext.keyConcepts.join(', ')}`)
    }
    if (chapterContext.commonMistakes.length > 0) {
      parts.push(`Частые ошибки: ${chapterContext.commonMistakes.join(', ')}`)
    }
  }

  if (task) {
    parts.push(
      '',
      `Студент решает задачу: ${task.title}`,
      `Описание: ${task.description}`,
      `Сложность: ${task.difficulty}`,
    )
  } else {
    parts.push('', 'Студент изучает материал в свободном режиме.')
  }

  if (userCode) {
    parts.push(
      '',
      'Текущий код студента:',
      '```',
      userCode,
      '```',
    )
  }

  if (testResults && testResults.length > 0) {
    parts.push('', 'Результаты тестов:')
    for (const result of testResults) {
      const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
      let line = `${icon} ${result.name}`
      if (result.message) line += ` — ${result.message}`
      parts.push(line)
    }
  }

  return parts.join('\n')
}
