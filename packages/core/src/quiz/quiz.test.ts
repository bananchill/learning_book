import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { calculateScore, isAnswerCorrect } from './lib/quizScoring'
import { useQuiz } from './model/useQuiz'
import QuestionCard from './ui/QuestionCard.vue'
import QuizResults from './ui/QuizResults.vue'
import QuizWidget from './ui/QuizWidget.vue'
import type { Quiz, QuizQuestion } from '@book/shared'

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

// --- Тестовые данные ---

function createQuiz(): Quiz {
  return {
    chapter: 'ch01',
    questions: [
      {
        id: 'q1',
        question: 'Что такое замыкание?',
        type: 'multiple-choice',
        options: ['Функция', 'Переменная', 'Функция с лексическим окружением', 'Класс'],
        correctAnswer: 2,
        explanation: 'Замыкание - это функция вместе с её лексическим окружением.',
      },
      {
        id: 'q2',
        question: 'let создаёт блочную область видимости',
        type: 'true-false',
        options: [],
        correctAnswer: 0, // true is index 0
        explanation: 'Да, let создаёт блочную область видимости.',
      },
      {
        id: 'q3',
        question: 'Что выведет console.log?',
        type: 'code-output',
        options: ['undefined', 'null', '1', 'ReferenceError'],
        correctAnswer: 0,
        explanation: 'Hoisting поднимает объявление, но не инициализацию.',
      },
    ],
  }
}

// --- Тесты calculateScore ---

describe('calculateScore', () => {
  it('возвращает нулевой счёт для пустого массива', () => {
    const score = calculateScore([])
    expect(score).toEqual({ total: 0, correct: 0, percentage: 0 })
  })

  it('считает правильные ответы', () => {
    const score = calculateScore([
      { questionId: 'q1', answer: 2, correct: true },
      { questionId: 'q2', answer: 1, correct: false },
      { questionId: 'q3', answer: 0, correct: true },
    ])
    expect(score.total).toBe(3)
    expect(score.correct).toBe(2)
    expect(score.percentage).toBe(67)
  })

  it('возвращает 100% при всех правильных ответах', () => {
    const score = calculateScore([
      { questionId: 'q1', answer: 0, correct: true },
      { questionId: 'q2', answer: 1, correct: true },
    ])
    expect(score.percentage).toBe(100)
  })

  it('возвращает 0% при всех неправильных ответах', () => {
    const score = calculateScore([
      { questionId: 'q1', answer: 0, correct: false },
      { questionId: 'q2', answer: 1, correct: false },
    ])
    expect(score.percentage).toBe(0)
  })

  it('округляет процент (1 из 3 = 33%)', () => {
    const score = calculateScore([
      { questionId: 'q1', answer: 0, correct: true },
      { questionId: 'q2', answer: 1, correct: false },
      { questionId: 'q3', answer: 2, correct: false },
    ])
    expect(score.percentage).toBe(33)
  })
})

// --- Тесты isAnswerCorrect ---

describe('isAnswerCorrect', () => {
  it('проверяет числовой ответ', () => {
    expect(isAnswerCorrect(2, 2)).toBe(true)
    expect(isAnswerCorrect(1, 2)).toBe(false)
  })

  it('проверяет булевый ответ', () => {
    expect(isAnswerCorrect(true, true)).toBe(true)
    expect(isAnswerCorrect(false, true)).toBe(false)
  })

  it('проверяет массив ответов', () => {
    expect(isAnswerCorrect([1, 2], [1, 2])).toBe(true)
    expect(isAnswerCorrect([1, 2], [2, 1])).toBe(true) // порядок не важен
    expect(isAnswerCorrect([1], [1, 2])).toBe(false)
  })

  it('не путает число и массив', () => {
    expect(isAnswerCorrect(1, [1])).toBe(false)
    expect(isAnswerCorrect([1], 1)).toBe(false)
  })

  it('пустые массивы равны', () => {
    expect(isAnswerCorrect([] as number[], [] as number[])).toBe(true)
  })

  it('проверяет строковый correctAnswer', () => {
    expect(isAnswerCorrect(0, '0')).toBe(false) // число !== строка
  })
})

// --- Тесты useQuiz ---

describe('useQuiz', () => {
  it('инициализируется с первым вопросом', () => {
    const quiz = createQuiz()
    const { currentIndex, currentQuestion, totalQuestions, isFinished } = useQuiz(quiz)

    expect(currentIndex.value).toBe(0)
    expect(currentQuestion.value).not.toBeNull()
    expect(currentQuestion.value!.id).toBe('q1')
    expect(totalQuestions.value).toBe(3)
    expect(isFinished.value).toBe(false)
  })

  it('submitAnswer записывает ответ', () => {
    const quiz = createQuiz()
    const { selectedAnswer, isAnswered, submitAnswer, answers } = useQuiz(quiz)

    selectedAnswer.value = 2
    submitAnswer()

    expect(isAnswered.value).toBe(true)
    expect(answers.value.length).toBe(1)
    expect(answers.value[0].correct).toBe(true)
  })

  it('не записывает ответ без выбора', () => {
    const quiz = createQuiz()
    const { submitAnswer, answers } = useQuiz(quiz)

    submitAnswer() // selectedAnswer === null
    expect(answers.value.length).toBe(0)
  })

  it('next переходит к следующему вопросу после ответа', () => {
    const quiz = createQuiz()
    const { selectedAnswer, submitAnswer, next, currentIndex, isAnswered } = useQuiz(quiz)

    selectedAnswer.value = 2
    submitAnswer()
    next()

    expect(currentIndex.value).toBe(1)
    expect(isAnswered.value).toBe(false)
  })

  it('next не переходит без ответа', () => {
    const quiz = createQuiz()
    const { next, currentIndex } = useQuiz(quiz)

    next()
    expect(currentIndex.value).toBe(0)
  })

  it('isLastQuestion определяется правильно', () => {
    const quiz = createQuiz()
    const { selectedAnswer, submitAnswer, next, isLastQuestion } = useQuiz(quiz)

    expect(isLastQuestion.value).toBe(false)

    // Проходим до последнего вопроса
    selectedAnswer.value = 2
    submitAnswer()
    next()
    selectedAnswer.value = 0
    submitAnswer()
    next()

    expect(isLastQuestion.value).toBe(true)
  })

  it('isFinished становится true после последнего вопроса', () => {
    const quiz = createQuiz()
    const { selectedAnswer, submitAnswer, next, isFinished } = useQuiz(quiz)

    // Проходим все вопросы
    selectedAnswer.value = 2
    submitAnswer()
    next()

    selectedAnswer.value = 0
    submitAnswer()
    next()

    selectedAnswer.value = 0
    submitAnswer()
    next()

    expect(isFinished.value).toBe(true)
  })

  it('retry сбрасывает состояние', () => {
    const quiz = createQuiz()
    const { selectedAnswer, submitAnswer, next, retry, currentIndex, isFinished, answers } = useQuiz(quiz)

    selectedAnswer.value = 2
    submitAnswer()
    next()

    retry()

    expect(currentIndex.value).toBe(0)
    expect(isFinished.value).toBe(false)
    expect(answers.value.length).toBe(0)
  })
})

// --- Тесты QuestionCard ---

describe('QuestionCard', () => {
  const question: QuizQuestion = {
    id: 'q1',
    question: 'Что такое замыкание?',
    type: 'multiple-choice',
    options: ['Функция', 'Переменная', 'Замыкание', 'Класс'],
    correctAnswer: 2,
    explanation: 'Замыкание = функция + окружение.',
  }

  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(QuestionCard, {
      props: { question, selectedAnswer: null, isAnswered: false },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает текст вопроса', () => {
    const wrapper = shallowMount(QuestionCard, {
      props: { question, selectedAnswer: null, isAnswered: false },
    })
    expect(wrapper.text()).toContain('Что такое замыкание?')
  })

  it('отображает варианты ответов для multiple-choice', () => {
    const wrapper = shallowMount(QuestionCard, {
      props: { question, selectedAnswer: null, isAnswered: false },
    })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(4)
    expect(buttons[0].text()).toContain('Функция')
  })

  it('эмитит select при клике на вариант', async () => {
    const wrapper = shallowMount(QuestionCard, {
      props: { question, selectedAnswer: null, isAnswered: false },
    })
    const buttons = wrapper.findAll('button')
    await buttons[1].trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([1])
  })

  it('показывает объяснение после ответа', () => {
    const wrapper = shallowMount(QuestionCard, {
      props: { question, selectedAnswer: 2, isAnswered: true },
    })
    expect(wrapper.text()).toContain('Замыкание = функция + окружение.')
  })

  it('отображает true/false кнопки для true-false вопроса', () => {
    const tfQuestion: QuizQuestion = {
      id: 'q2',
      question: 'let имеет блочную область видимости',
      type: 'true-false',
      options: [],
      correctAnswer: 0,
      explanation: 'Верно.',
    }
    const wrapper = shallowMount(QuestionCard, {
      props: { question: tfQuestion, selectedAnswer: null, isAnswered: false },
    })
    expect(wrapper.text()).toContain('quiz.true_label')
    expect(wrapper.text()).toContain('quiz.false_label')
  })
})

// --- Тесты QuizResults ---

describe('QuizResults', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(QuizResults, {
      props: { score: { total: 3, correct: 2, percentage: 67 } },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает счёт', () => {
    const wrapper = shallowMount(QuizResults, {
      props: { score: { total: 5, correct: 4, percentage: 80 } },
    })
    expect(wrapper.text()).toContain('4')
    expect(wrapper.text()).toContain('5')
  })

  it('эмитит retry при клике на кнопку', async () => {
    const wrapper = shallowMount(QuizResults, {
      props: { score: { total: 3, correct: 1, percentage: 33 } },
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
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })
})

// --- Тесты QuizWidget ---

describe('QuizWidget', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(QuizWidget, {
      props: { data: createQuiz() },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает прогресс-бар', () => {
    const wrapper = shallowMount(QuizWidget, {
      props: { data: createQuiz() },
    })
    // Прогресс-бар — div с динамическим width
    const progressBar = wrapper.find('.h-1')
    expect(progressBar.exists()).toBe(true)
  })
})
