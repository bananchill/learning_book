import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'
import { chapterCompletionPercent, chapterStatus, bookCompletionPercent } from './model/progressCalc'
import { useProgressStore } from './model/useProgressStore'
import ProgressBar from './ui/ProgressBar.vue'
import type { ChapterProgress } from '@book/shared'

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
}))

vi.mock('@vueuse/core', () => ({
  useStorage: (_key: string, initial: unknown) => ref(JSON.parse(JSON.stringify(initial))),
  useLocalStorage: (_key: string, initial: unknown) => ref(JSON.parse(JSON.stringify(initial))),
}))

// --- Тестовые данные ---

function createChapterProgress(overrides: Partial<ChapterProgress> = {}): ChapterProgress {
  return {
    chapterId: 'ch01',
    reading: { completed: [], total: 5 },
    tasks: { completed: [], total: 3 },
    quiz: { score: 0, total: 5, passed: false },
    interview: { reviewed: [], total: 4 },
    walkthrough: { completed: false },
    lastActivity: new Date().toISOString(),
    ...overrides,
  }
}

// --- Тесты chapterCompletionPercent ---

describe('chapterCompletionPercent', () => {
  it('возвращает 0 для полностью пустого прогресса', () => {
    const progress = createChapterProgress({
      reading: { completed: [], total: 0 },
      tasks: { completed: [], total: 0 },
      quiz: { score: 0, total: 0, passed: false },
    })
    expect(chapterCompletionPercent(progress)).toBe(0)
  })

  it('учитывает чтение', () => {
    const progress = createChapterProgress({
      reading: { completed: ['s1', 's2'], total: 4 },
      tasks: { completed: [], total: 0 },
      quiz: { score: 0, total: 0, passed: false },
    })
    expect(chapterCompletionPercent(progress)).toBe(50)
  })

  it('учитывает задачи', () => {
    const progress = createChapterProgress({
      reading: { completed: [], total: 0 },
      tasks: { completed: ['t1'], total: 2 },
      quiz: { score: 0, total: 0, passed: false },
    })
    expect(chapterCompletionPercent(progress)).toBe(50)
  })

  it('учитывает пройденный квиз', () => {
    const progress = createChapterProgress({
      reading: { completed: [], total: 0 },
      tasks: { completed: [], total: 0 },
      quiz: { score: 4, total: 5, passed: true },
    })
    expect(chapterCompletionPercent(progress)).toBe(100)
  })

  it('учитывает непройденный квиз', () => {
    const progress = createChapterProgress({
      reading: { completed: [], total: 0 },
      tasks: { completed: [], total: 0 },
      quiz: { score: 1, total: 5, passed: false },
    })
    expect(chapterCompletionPercent(progress)).toBe(0)
  })

  it('усредняет все составляющие', () => {
    const progress = createChapterProgress({
      reading: { completed: ['s1', 's2', 's3', 's4', 's5'], total: 5 }, // 100%
      tasks: { completed: ['t1'], total: 3 },                            // 33%
      quiz: { score: 4, total: 5, passed: true },                        // 100%
    })
    // (1 + 0.333 + 1) / 3 = 0.777... => 78%
    expect(chapterCompletionPercent(progress)).toBe(78)
  })

  it('возвращает 100 при полном прохождении', () => {
    const progress = createChapterProgress({
      reading: { completed: ['s1', 's2'], total: 2 },
      tasks: { completed: ['t1', 't2'], total: 2 },
      quiz: { score: 5, total: 5, passed: true },
    })
    expect(chapterCompletionPercent(progress)).toBe(100)
  })
})

// --- Тесты chapterStatus ---

describe('chapterStatus', () => {
  it('возвращает not_started для нулевого прогресса', () => {
    const progress = createChapterProgress({
      reading: { completed: [], total: 5 },
      tasks: { completed: [], total: 3 },
      quiz: { score: 0, total: 5, passed: false },
    })
    expect(chapterStatus(progress)).toBe('not_started')
  })

  it('возвращает in_progress для частичного прогресса', () => {
    const progress = createChapterProgress({
      reading: { completed: ['s1'], total: 5 },
      tasks: { completed: [], total: 3 },
      quiz: { score: 0, total: 5, passed: false },
    })
    expect(chapterStatus(progress)).toBe('in_progress')
  })

  it('возвращает completed для полного прогресса', () => {
    const progress = createChapterProgress({
      reading: { completed: ['s1', 's2'], total: 2 },
      tasks: { completed: ['t1', 't2'], total: 2 },
      quiz: { score: 5, total: 5, passed: true },
    })
    expect(chapterStatus(progress)).toBe('completed')
  })
})

// --- Тесты bookCompletionPercent ---

describe('bookCompletionPercent', () => {
  it('возвращает 0 для пустой книги', () => {
    expect(bookCompletionPercent({}, 5)).toBe(0)
  })

  it('возвращает 0 при totalChapters = 0', () => {
    expect(bookCompletionPercent({}, 0)).toBe(0)
  })

  it('считает процент завершённых глав', () => {
    const chapters: Record<string, ChapterProgress> = {
      ch01: createChapterProgress({
        chapterId: 'ch01',
        reading: { completed: ['s1'], total: 1 },
        tasks: { completed: ['t1'], total: 1 },
        quiz: { score: 5, total: 5, passed: true },
      }),
      ch02: createChapterProgress({
        chapterId: 'ch02',
        reading: { completed: [], total: 3 },
        tasks: { completed: [], total: 2 },
        quiz: { score: 0, total: 5, passed: false },
      }),
    }
    // 1 из 4 глав завершена = 25%
    expect(bookCompletionPercent(chapters, 4)).toBe(25)
  })
})

// --- Тесты useProgressStore ---

describe('useProgressStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('инициализируется с пустым прогрессом', () => {
    const store = useProgressStore()
    expect(Object.keys(store.allChapters)).toHaveLength(0)
  })

  it('getChapter создаёт запись для новой главы', () => {
    const store = useProgressStore()
    const ch = store.getChapter('ch01')
    expect(ch.chapterId).toBe('ch01')
    expect(ch.reading.completed).toEqual([])
  })

  it('markSubchapterRead добавляет подглаву в прочитанные', () => {
    const store = useProgressStore()
    store.markSubchapterRead('ch01', 'sub-1')
    const ch = store.getChapter('ch01')
    expect(ch.reading.completed).toContain('sub-1')
  })

  it('markSubchapterRead не дублирует записи', () => {
    const store = useProgressStore()
    store.markSubchapterRead('ch01', 'sub-1')
    store.markSubchapterRead('ch01', 'sub-1')
    const ch = store.getChapter('ch01')
    expect(ch.reading.completed.filter(s => s === 'sub-1')).toHaveLength(1)
  })

  it('markTaskCompleted добавляет задачу в завершённые', () => {
    const store = useProgressStore()
    store.markTaskCompleted('ch01', 'task-1')
    const ch = store.getChapter('ch01')
    expect(ch.tasks.completed).toContain('task-1')
  })

  it('saveQuizScore сохраняет результат квиза', () => {
    const store = useProgressStore()
    store.saveQuizScore('ch01', 4, 5)
    const ch = store.getChapter('ch01')
    expect(ch.quiz.score).toBe(4)
    expect(ch.quiz.total).toBe(5)
    expect(ch.quiz.passed).toBe(true)
  })

  it('saveQuizScore отмечает как не пройденный при низком балле', () => {
    const store = useProgressStore()
    store.saveQuizScore('ch01', 2, 5) // 40% < 60%
    const ch = store.getChapter('ch01')
    expect(ch.quiz.passed).toBe(false)
  })

  it('markInterviewReviewed добавляет вопрос в просмотренные', () => {
    const store = useProgressStore()
    store.markInterviewReviewed('ch01', 'q-1')
    const ch = store.getChapter('ch01')
    expect(ch.interview.reviewed).toContain('q-1')
  })

  it('markWalkthroughCompleted отмечает walkthrough как пройденный', () => {
    const store = useProgressStore()
    store.markWalkthroughCompleted('ch01')
    const ch = store.getChapter('ch01')
    expect(ch.walkthrough.completed).toBe(true)
  })

  it('setChapterTotals устанавливает общее количество', () => {
    const store = useProgressStore()
    store.setChapterTotals('ch01', { reading: 10, tasks: 5, quiz: 20, interview: 8 })
    const ch = store.getChapter('ch01')
    expect(ch.reading.total).toBe(10)
    expect(ch.tasks.total).toBe(5)
    expect(ch.quiz.total).toBe(20)
    expect(ch.interview.total).toBe(8)
  })

  it('getChapterPercent возвращает процент', () => {
    const store = useProgressStore()
    store.setChapterTotals('ch01', { reading: 2, tasks: 2, quiz: 5 })
    store.markSubchapterRead('ch01', 's1')
    store.markSubchapterRead('ch01', 's2')
    store.markTaskCompleted('ch01', 't1')
    store.markTaskCompleted('ch01', 't2')
    store.saveQuizScore('ch01', 5, 5)

    expect(store.getChapterPercent('ch01')).toBe(100)
  })

  it('getChapterStatus возвращает корректный статус', () => {
    const store = useProgressStore()
    expect(store.getChapterStatus('ch01')).toBe('not_started')

    store.setChapterTotals('ch01', { reading: 5 })
    store.markSubchapterRead('ch01', 's1')
    expect(store.getChapterStatus('ch01')).toBe('in_progress')
  })

  it('resetChapter удаляет прогресс главы', () => {
    const store = useProgressStore()
    store.markSubchapterRead('ch01', 's1')
    store.resetChapter('ch01')
    // getChapter создаёт новую запись
    const ch = store.getChapter('ch01')
    expect(ch.reading.completed).toEqual([])
  })

  it('resetAll очищает весь прогресс', () => {
    const store = useProgressStore()
    store.markSubchapterRead('ch01', 's1')
    store.markSubchapterRead('ch02', 's1')
    store.resetAll()
    expect(Object.keys(store.allChapters)).toHaveLength(0)
  })
})

// --- Тесты ProgressBar ---

describe('ProgressBar', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 50 },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('устанавливает ширину прогресс-бара', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 75, max: 100 },
    })
    const bar = wrapper.find('.h-full')
    expect(bar.attributes('style')).toContain('75%')
  })

  it('не превышает 100%', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 150, max: 100 },
    })
    const bar = wrapper.find('.h-full')
    expect(bar.attributes('style')).toContain('100%')
  })

  it('применяет bg-success при полном заполнении', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 100, max: 100 },
    })
    const bar = wrapper.find('.h-full')
    expect(bar.classes()).toContain('bg-success')
  })

  it('применяет bg-primary при неполном заполнении', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 50, max: 100 },
    })
    const bar = wrapper.find('.h-full')
    expect(bar.classes()).toContain('bg-primary')
  })

  it('размер sm делает бар тоньше', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 50, size: 'sm' },
    })
    const container = wrapper.find('.rounded-full')
    expect(container.classes()).toContain('h-1.5')
  })

  it('размер md делает бар стандартным', () => {
    const wrapper = shallowMount(ProgressBar, {
      props: { value: 50, size: 'md' },
    })
    const container = wrapper.find('.rounded-full')
    expect(container.classes()).toContain('h-2')
  })
})
