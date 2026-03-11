import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { useTask } from './model/useTask'
import { useHints } from './model/useHints'
import { useCodeReview } from './model/useCodeReview'
import TaskCard from './ui/TaskCard.vue'
import TaskList from './ui/TaskList.vue'
import CodeReviewView from './ui/CodeReviewView.vue'
import HintSystem from './ui/HintSystem.vue'
import type { Task, TestResult, CodeReviewIssue } from '@book/shared'

// --- Мок зависимостей ---

vi.mock('@book/i18n', () => ({
  useI18n: () => ({ t: (key: string, params?: Record<string, unknown>) => key }),
}))

vi.mock('@book/ui', () => ({
  BaseButton: {
    name: 'BaseButton',
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot/></button>',
    props: ['variant', 'size', 'disabled'],
    emits: ['click'],
  },
  DifficultyBadge: {
    name: 'DifficultyBadge',
    template: '<span>{{ level }}</span>',
    props: ['level'],
  },
}))

// --- Тестовые данные ---

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-01',
    title: 'Реализуйте счётчик',
    difficulty: 'easy',
    description: 'Создайте функцию-счётчик с замыканием',
    file: 'counter.js',
    testFile: 'counter.test.js',
    concepts: ['closures'],
    hints: ['Используйте замыкание', 'Объявите переменную count', 'return ++count'],
    estimatedMinutes: 10,
    ...overrides,
  }
}

function createIssues(): CodeReviewIssue[] {
  return [
    { line: 3, type: 'bug', description: 'Переменная не объявлена', fix: 'Добавьте let' },
    { line: 7, type: 'performance', description: 'Пересоздание объекта в цикле', fix: 'Вынесите за цикл' },
  ]
}

// --- Тесты useTask ---

describe('useTask', () => {
  it('инициализируется как нерешённая', () => {
    const task = createTask()
    const { isSolved, allPassed, passedCount, totalCount } = useTask(task)

    expect(isSolved.value).toBe(false)
    expect(allPassed.value).toBe(false)
    expect(passedCount.value).toBe(0)
    expect(totalCount.value).toBe(0)
  })

  it('обновляет результаты тестов', () => {
    const task = createTask()
    const { onTestResults, lastResults, passedCount, totalCount } = useTask(task)

    const results: TestResult[] = [
      { name: 'test1', status: 'pass', duration: 5 },
      { name: 'test2', status: 'fail', message: 'wrong', duration: 3 },
    ]
    onTestResults(results)

    expect(lastResults.value.length).toBe(2)
    expect(passedCount.value).toBe(1)
    expect(totalCount.value).toBe(2)
  })

  it('отмечает как решённую при всех пройденных тестах', () => {
    const task = createTask()
    const { onTestResults, isSolved, allPassed } = useTask(task)

    const results: TestResult[] = [
      { name: 'test1', status: 'pass', duration: 5 },
      { name: 'test2', status: 'pass', duration: 3 },
    ]
    onTestResults(results)

    expect(allPassed.value).toBe(true)
    expect(isSolved.value).toBe(true)
  })

  it('не отмечает как решённую если есть проваленные тесты', () => {
    const task = createTask()
    const { onTestResults, isSolved } = useTask(task)

    const results: TestResult[] = [
      { name: 'test1', status: 'pass', duration: 5 },
      { name: 'test2', status: 'fail', message: 'err', duration: 3 },
    ]
    onTestResults(results)

    expect(isSolved.value).toBe(false)
  })

  it('reset сбрасывает состояние', () => {
    const task = createTask()
    const { onTestResults, reset, isSolved, lastResults } = useTask(task)

    onTestResults([{ name: 'test1', status: 'pass', duration: 5 }])
    reset()

    expect(isSolved.value).toBe(false)
    expect(lastResults.value.length).toBe(0)
  })
})

// --- Тесты useHints ---

describe('useHints', () => {
  const hints = ['Подсказка 1', 'Подсказка 2', 'Подсказка 3']

  it('начинается без открытых подсказок', () => {
    const { currentHints, hasMore, nextLevel } = useHints(hints)

    expect(currentHints.value).toEqual([])
    expect(hasMore.value).toBe(true)
    expect(nextLevel.value).toBe(1)
  })

  it('первая подсказка открывается бесплатно', () => {
    const { requestHint, currentHints, pendingConfirm } = useHints(hints)

    requestHint()

    expect(currentHints.value).toEqual(['Подсказка 1'])
    expect(pendingConfirm.value).toBe(false)
  })

  it('вторая подсказка требует подтверждения', () => {
    const { requestHint, pendingConfirm } = useHints(hints)

    requestHint() // Уровень 1 — бесплатно
    requestHint() // Уровень 2 — нужно подтверждение

    expect(pendingConfirm.value).toBe(true)
  })

  it('confirmHint открывает подсказку после подтверждения', () => {
    const { requestHint, confirmHint, currentHints } = useHints(hints)

    requestHint()
    requestHint()
    confirmHint()

    expect(currentHints.value).toEqual(['Подсказка 1', 'Подсказка 2'])
  })

  it('cancelHint отменяет подтверждение', () => {
    const { requestHint, cancelHint, pendingConfirm, currentHints } = useHints(hints)

    requestHint()
    requestHint()
    cancelHint()

    expect(pendingConfirm.value).toBe(false)
    expect(currentHints.value).toEqual(['Подсказка 1'])
  })

  it('hasMore === false после открытия всех подсказок', () => {
    const { requestHint, confirmHint, hasMore } = useHints(hints)

    requestHint()       // 1
    requestHint()       // confirm 2
    confirmHint()
    requestHint()       // confirm 3
    confirmHint()

    expect(hasMore.value).toBe(false)
  })

  it('reset возвращает в начальное состояние', () => {
    const { requestHint, reset, currentHints, hasMore } = useHints(hints)

    requestHint()
    reset()

    expect(currentHints.value).toEqual([])
    expect(hasMore.value).toBe(true)
  })
})

// --- Тесты useCodeReview ---

describe('useCodeReview', () => {
  it('инициализируется с пустым набором отмеченных строк', () => {
    const issues = createIssues()
    const { markedLines, isSubmitted } = useCodeReview(issues)

    expect(markedLines.value.size).toBe(0)
    expect(isSubmitted.value).toBe(false)
  })

  it('toggleLine добавляет и убирает строку', () => {
    const { toggleLine, markedLines } = useCodeReview(createIssues())

    toggleLine(3)
    expect(markedLines.value.has(3)).toBe(true)

    toggleLine(3)
    expect(markedLines.value.has(3)).toBe(false)
  })

  it('toggleLine не работает после submit', () => {
    const { toggleLine, submit, markedLines } = useCodeReview(createIssues())

    toggleLine(3)
    submit()
    toggleLine(3)

    expect(markedLines.value.has(3)).toBe(true) // Не удалилось
  })

  it('правильно вычисляет found / missed / falsePositives', () => {
    const issues = createIssues()
    const { toggleLine, submit, foundIssues, missedIssues, falsePositives, score } = useCodeReview(issues)

    toggleLine(3)  // Правильно (строка 3 — баг)
    toggleLine(5)  // Ложное срабатывание (строки 5 нет в issues)
    submit()

    expect(foundIssues.value.length).toBe(1)
    expect(foundIssues.value[0].line).toBe(3)
    expect(missedIssues.value.length).toBe(1)
    expect(missedIssues.value[0].line).toBe(7)
    expect(falsePositives.value).toEqual([5])
    expect(score.value).toEqual({ found: 1, total: 2 })
  })

  it('reset сбрасывает состояние', () => {
    const { toggleLine, submit, reset, markedLines, isSubmitted } = useCodeReview(createIssues())

    toggleLine(3)
    submit()
    reset()

    expect(markedLines.value.size).toBe(0)
    expect(isSubmitted.value).toBe(false)
  })
})

// --- Тесты TaskCard ---

describe('TaskCard', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask() },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает название задачи', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask() },
    })
    expect(wrapper.text()).toContain('Реализуйте счётчик')
  })

  it('отображает описание задачи', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask() },
    })
    expect(wrapper.text()).toContain('Создайте функцию-счётчик с замыканием')
  })

  it('эмитит select с taskId при клике', async () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask({ id: 'my-task' }) },
    })
    await wrapper.find('div').trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual(['my-task'])
  })

  it('показывает галочку при solved=true', () => {
    const wrapper = shallowMount(TaskCard, {
      props: { task: createTask(), solved: true },
    })
    expect(wrapper.text()).toContain('✅')
  })
})

// --- Тесты TaskList ---

describe('TaskList', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(TaskList, {
      props: { tasks: [createTask()] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает заголовок', () => {
    const wrapper = shallowMount(TaskList, {
      props: { tasks: [createTask()] },
    })
    expect(wrapper.text()).toContain('task.tasks_title')
  })

  it('рендерит TaskCard для каждой задачи', () => {
    const tasks = [
      createTask({ id: 'task-1', title: 'Task 1' }),
      createTask({ id: 'task-2', title: 'Task 2' }),
    ]
    const wrapper = shallowMount(TaskList, {
      props: { tasks },
    })
    const cards = wrapper.findAllComponents(TaskCard)
    expect(cards.length).toBe(2)
  })
})

// --- Тесты HintSystem ---

describe('HintSystem', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(HintSystem, {
      props: { hints: ['Подсказка 1', 'Подсказка 2'] },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('показывает кнопку для запроса подсказки', () => {
    const wrapper = shallowMount(HintSystem, {
      props: { hints: ['Подсказка 1'] },
      global: {
        stubs: {
          BaseButton: {
            template: '<button @click="$emit(\'click\')"><slot/></button>',
            props: ['variant', 'size', 'disabled'],
            emits: ['click'],
          },
        },
      },
    })
    expect(wrapper.text()).toContain('task.hint')
  })
})

// --- Тесты CodeReviewView ---

describe('CodeReviewView', () => {
  const code = 'const a = 1;\nlet b = 2;\nconsole.log(c);\nfor (let i = 0; i < 10; i++) {\n  // loop\n}\nconst obj = { key: "val" };\n'
  const issues = createIssues()

  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(CodeReviewView, {
      props: { code, issues },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает заголовок code review', () => {
    const wrapper = shallowMount(CodeReviewView, {
      props: { code, issues },
    })
    expect(wrapper.text()).toContain('code_review.title')
  })

  it('отображает строки кода', () => {
    const wrapper = shallowMount(CodeReviewView, {
      props: { code, issues },
    })
    expect(wrapper.text()).toContain('const a = 1;')
    expect(wrapper.text()).toContain('let b = 2;')
  })

  it('отображает номера строк', () => {
    const wrapper = shallowMount(CodeReviewView, {
      props: { code, issues },
    })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })
})
