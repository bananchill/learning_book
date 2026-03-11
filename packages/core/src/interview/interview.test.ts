import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { useInterview } from './model/useInterview'
import InterviewCard from './ui/InterviewCard.vue'
import InterviewPrep from './ui/InterviewPrep.vue'
import type { Interview, InterviewQuestion } from '@book/shared'

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
  DeepDive: {
    name: 'DeepDive',
    template: '<div><slot/></div>',
  },
  LevelBadge: {
    name: 'LevelBadge',
    template: '<span>{{ level }}</span>',
    props: ['level'],
  },
}))

// --- Тестовые данные ---

function createInterview(): Interview {
  return {
    chapter: 'ch01',
    questions: [
      {
        id: 'iq-1',
        question: 'Что такое замыкание?',
        level: 'junior',
        goodAnswer: 'Функция + лексическое окружение.',
        whatInterviewerWants: 'Понимание scope chain.',
        commonMistakes: ['Путают с каррированием'],
        followUps: ['Где используются замыкания?'],
      },
      {
        id: 'iq-2',
        question: 'Объясните Event Loop',
        level: 'middle',
        goodAnswer: 'Механизм обработки асинхронных операций в JS.',
        whatInterviewerWants: 'Понимание call stack, task queue, microtask queue.',
        commonMistakes: ['Не упоминают microtasks'],
        followUps: ['Чем отличается microtask от macrotask?'],
      },
      {
        id: 'iq-3',
        question: 'Как работает Proxy?',
        level: 'senior',
        goodAnswer: 'Proxy перехватывает операции над объектом через traps.',
        whatInterviewerWants: 'Знание конкретных traps и use cases.',
        commonMistakes: [],
        followUps: [],
      },
    ],
  }
}

// --- Тесты useInterview ---

describe('useInterview', () => {
  it('инициализируется с пустыми ревью и оценками', () => {
    const data = createInterview()
    const { reviewedCount, totalCount, questions } = useInterview(data)

    expect(reviewedCount.value).toBe(0)
    expect(totalCount.value).toBe(3)
    expect(questions.value.length).toBe(3)
  })

  it('reveal открывает вопрос', () => {
    const { reveal, isRevealed, reviewedCount } = useInterview(createInterview())

    reveal('iq-1')

    expect(isRevealed('iq-1')).toBe(true)
    expect(isRevealed('iq-2')).toBe(false)
    expect(reviewedCount.value).toBe(1)
  })

  it('reveal не дублирует уже открытые вопросы', () => {
    const { reveal, reviewedCount } = useInterview(createInterview())

    reveal('iq-1')
    reveal('iq-1')

    expect(reviewedCount.value).toBe(1)
  })

  it('assess сохраняет самооценку', () => {
    const { assess, getAssessment } = useInterview(createInterview())

    assess('iq-1', 'good')
    expect(getAssessment('iq-1')).toBe('good')

    assess('iq-2', 'bad')
    expect(getAssessment('iq-2')).toBe('bad')
  })

  it('assess перезаписывает предыдущую оценку', () => {
    const { assess, getAssessment } = useInterview(createInterview())

    assess('iq-1', 'good')
    assess('iq-1', 'ok')
    expect(getAssessment('iq-1')).toBe('ok')
  })

  it('getAssessment возвращает null для неоцененных', () => {
    const { getAssessment } = useInterview(createInterview())
    expect(getAssessment('iq-1')).toBeNull()
  })

  it('reset сбрасывает все ревью и оценки', () => {
    const { reveal, assess, reset, reviewedCount, getAssessment, isRevealed } = useInterview(createInterview())

    reveal('iq-1')
    reveal('iq-2')
    assess('iq-1', 'good')

    reset()

    expect(reviewedCount.value).toBe(0)
    expect(isRevealed('iq-1')).toBe(false)
    expect(getAssessment('iq-1')).toBeNull()
  })
})

// --- Тесты InterviewCard ---

describe('InterviewCard', () => {
  const question: InterviewQuestion = {
    id: 'iq-1',
    question: 'Что такое замыкание?',
    level: 'junior',
    goodAnswer: 'Функция + лексическое окружение.',
    whatInterviewerWants: 'Понимание scope chain.',
    commonMistakes: ['Путают с каррированием'],
    followUps: ['Где используются замыкания?'],
  }

  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: false, assessment: null },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает текст вопроса', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: false, assessment: null },
    })
    expect(wrapper.text()).toContain('Что такое замыкание?')
  })

  it('показывает кнопку "показать ответ" когда не раскрыт', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: false, assessment: null },
      global: {
        stubs: {
          BaseButton: {
            template: '<button @click="$emit(\'click\')"><slot/></button>',
            props: ['variant', 'size', 'disabled'],
            emits: ['click'],
          },
          LevelBadge: { template: '<span>{{ level }}</span>', props: ['level'] },
        },
      },
    })
    expect(wrapper.text()).toContain('interview.show_answer')
  })

  it('не показывает кнопку "показать ответ" когда раскрыт', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    // Кнопка BaseButton с текстом show_answer не должна быть
    const buttons = wrapper.findAllComponents({ name: 'BaseButton' })
    const showAnswerBtn = buttons.filter(b => b.text().includes('interview.show_answer'))
    expect(showAnswerBtn.length).toBe(0)
  })

  it('показывает хороший ответ при раскрытии', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    expect(wrapper.text()).toContain('Функция + лексическое окружение.')
  })

  it('показывает частые ошибки при раскрытии', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    expect(wrapper.text()).toContain('Путают с каррированием')
  })

  it('показывает дополнительные вопросы при раскрытии', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    expect(wrapper.text()).toContain('Где используются замыкания?')
  })

  it('эмитит reveal при клике на кнопку показа', async () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: false, assessment: null },
    })
    // Ищем кнопку BaseButton
    const button = wrapper.findComponent({ name: 'BaseButton' })
    await button.trigger('click')
    expect(wrapper.emitted('reveal')).toBeTruthy()
  })

  it('показывает кнопки самооценки при раскрытии', () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    expect(wrapper.text()).toContain('interview.good')
    expect(wrapper.text()).toContain('interview.ok')
    expect(wrapper.text()).toContain('interview.bad')
  })

  it('эмитит assess при клике на оценку', async () => {
    const wrapper = shallowMount(InterviewCard, {
      props: { question, isRevealed: true, assessment: null },
    })
    // Ищем кнопки самооценки (обычные button, не BaseButton)
    const assessButtons = wrapper.findAll('.pt-2 button')
    await assessButtons[0].trigger('click') // 'good'
    expect(wrapper.emitted('assess')).toBeTruthy()
    expect(wrapper.emitted('assess')![0]).toEqual(['good'])
  })
})

// --- Тесты InterviewPrep ---

describe('InterviewPrep', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(InterviewPrep, {
      props: { data: createInterview() },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает заголовок', () => {
    const wrapper = shallowMount(InterviewPrep, {
      props: { data: createInterview() },
    })
    expect(wrapper.text()).toContain('interview.title')
  })

  it('отображает счётчик прогресса', () => {
    const wrapper = shallowMount(InterviewPrep, {
      props: { data: createInterview() },
    })
    // 0 / 3
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('3')
  })

  it('рендерит InterviewCard для каждого вопроса', () => {
    const wrapper = shallowMount(InterviewPrep, {
      props: { data: createInterview() },
    })
    const cards = wrapper.findAllComponents(InterviewCard)
    expect(cards.length).toBe(3)
  })
})
