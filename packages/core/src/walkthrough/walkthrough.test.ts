import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { useWalkthrough } from './model/useWalkthrough'
import { useAutoPlay } from './model/useAutoPlay'
import StepControls from './ui/StepControls.vue'
import CodeDisplay from './ui/CodeDisplay.vue'
import StateInspector from './ui/StateInspector.vue'
import type { Walkthrough, WalkthroughStep } from '@book/shared'

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

// Мокаем onUnmounted для useAutoPlay, поскольку вызываем вне компонента
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual as object,
    onUnmounted: vi.fn(),
  }
})

// --- Тестовые данные ---

function createWalkthrough(): Walkthrough {
  return {
    title: 'Разбор замыканий',
    code: 'function counter() {\n  let count = 0;\n  return function() {\n    return ++count;\n  };\n}',
    steps: [
      {
        line: 1,
        description: 'Объявляем функцию counter',
        variables: {},
        callStack: ['global'],
      },
      {
        line: 2,
        description: 'Создаём переменную count = 0',
        variables: { count: '0' },
        callStack: ['global', 'counter'],
      },
      {
        line: 3,
        description: 'Возвращаем внутреннюю функцию',
        variables: { count: '0' },
        callStack: ['global', 'counter'],
      },
      {
        line: 4,
        description: 'Инкрементируем count и возвращаем',
        variables: { count: '1' },
        callStack: ['global', 'counter', '<anonymous>'],
      },
    ],
  }
}

// --- Тесты useWalkthrough ---

describe('useWalkthrough', () => {
  it('инициализируется с первым шагом', () => {
    const data = createWalkthrough()
    const w = useWalkthrough(data)

    expect(w.currentStepIndex.value).toBe(0)
    expect(w.totalSteps.value).toBe(4)
    expect(w.isFirst.value).toBe(true)
    expect(w.isLast.value).toBe(false)
    expect(w.currentStep.value).not.toBeNull()
    expect(w.currentStep.value!.line).toBe(1)
  })

  it('хранит код и заголовок', () => {
    const data = createWalkthrough()
    const w = useWalkthrough(data)

    expect(w.code).toBe(data.code)
    expect(w.title).toBe('Разбор замыканий')
  })

  it('next переходит к следующему шагу', () => {
    const w = useWalkthrough(createWalkthrough())

    w.next()
    expect(w.currentStepIndex.value).toBe(1)
    expect(w.currentStep.value!.line).toBe(2)
    expect(w.isFirst.value).toBe(false)
  })

  it('next не выходит за последний шаг', () => {
    const w = useWalkthrough(createWalkthrough())

    w.next()
    w.next()
    w.next()
    expect(w.isLast.value).toBe(true)

    w.next() // Попытка выйти за пределы
    expect(w.currentStepIndex.value).toBe(3)
  })

  it('prev переходит к предыдущему шагу', () => {
    const w = useWalkthrough(createWalkthrough())

    w.next()
    w.next()
    w.prev()

    expect(w.currentStepIndex.value).toBe(1)
  })

  it('prev не выходит за первый шаг', () => {
    const w = useWalkthrough(createWalkthrough())

    w.prev() // Уже на первом
    expect(w.currentStepIndex.value).toBe(0)
  })

  it('goTo переходит к указанному шагу', () => {
    const w = useWalkthrough(createWalkthrough())

    w.goTo(2)
    expect(w.currentStepIndex.value).toBe(2)
    expect(w.currentStep.value!.line).toBe(3)
  })

  it('goTo игнорирует невалидный индекс', () => {
    const w = useWalkthrough(createWalkthrough())

    w.goTo(-1)
    expect(w.currentStepIndex.value).toBe(0)

    w.goTo(100)
    expect(w.currentStepIndex.value).toBe(0)
  })

  it('reset возвращает к первому шагу', () => {
    const w = useWalkthrough(createWalkthrough())

    w.next()
    w.next()
    w.reset()

    expect(w.currentStepIndex.value).toBe(0)
    expect(w.isFirst.value).toBe(true)
  })
})

// --- Тесты useAutoPlay ---

describe('useAutoPlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('начинается в состоянии паузы', () => {
    const onTick = vi.fn()
    const { isPlaying } = useAutoPlay(onTick)
    expect(isPlaying.value).toBe(false)
  })

  it('play запускает воспроизведение', () => {
    const onTick = vi.fn()
    const { play, isPlaying } = useAutoPlay(onTick, 1000)

    play()
    expect(isPlaying.value).toBe(true)
  })

  it('вызывает onTick через заданный интервал', () => {
    const onTick = vi.fn()
    const { play } = useAutoPlay(onTick, 1000)

    play()
    vi.advanceTimersByTime(1000)
    expect(onTick).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(1000)
    expect(onTick).toHaveBeenCalledTimes(2)
  })

  it('pause останавливает воспроизведение', () => {
    const onTick = vi.fn()
    const { play, pause, isPlaying } = useAutoPlay(onTick, 1000)

    play()
    vi.advanceTimersByTime(500)
    pause()

    expect(isPlaying.value).toBe(false)
    vi.advanceTimersByTime(2000)
    expect(onTick).not.toHaveBeenCalled()
  })

  it('toggle переключает состояние', () => {
    const onTick = vi.fn()
    const { toggle, isPlaying } = useAutoPlay(onTick, 1000)

    toggle()
    expect(isPlaying.value).toBe(true)

    toggle()
    expect(isPlaying.value).toBe(false)
  })

  it('play не создаёт повторный интервал', () => {
    const onTick = vi.fn()
    const { play } = useAutoPlay(onTick, 1000)

    play()
    play() // Повторный вызов

    vi.advanceTimersByTime(1000)
    expect(onTick).toHaveBeenCalledTimes(1) // Только один интервал
  })
})

// --- Тесты StepControls ---

const stepControlsStubs = {
  BaseButton: {
    name: 'BaseButton',
    template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot/></button>',
    props: ['variant', 'size', 'disabled'],
    emits: ['click'],
  },
}

describe('StepControls', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 0,
        totalSteps: 4,
        isFirst: true,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает номер текущего шага', () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 1,
        totalSteps: 4,
        isFirst: false,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    // t('walkthrough.step_of', { current: 2, total: 4 })
    expect(wrapper.text()).toContain('walkthrough.step_of')
  })

  it('эмитит prev при клике на кнопку "назад"', async () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 1,
        totalSteps: 4,
        isFirst: false,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    const buttons = wrapper.findAll('button')
    // Кнопки: reset(0), prev(1), play(2), next(3)
    await buttons[1].trigger('click')
    expect(wrapper.emitted('prev')).toBeTruthy()
  })

  it('эмитит next при клике на кнопку "вперёд"', async () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 0,
        totalSteps: 4,
        isFirst: true,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    const buttons = wrapper.findAll('button')
    // Кнопки: reset(0), prev(1), play(2), next(3)
    await buttons[3].trigger('click')
    expect(wrapper.emitted('next')).toBeTruthy()
  })

  it('эмитит togglePlay при клике на кнопку play/pause', async () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 0,
        totalSteps: 4,
        isFirst: true,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    const buttons = wrapper.findAll('button')
    // Кнопки: reset(0), prev(1), play(2), next(3)
    await buttons[2].trigger('click')
    expect(wrapper.emitted('togglePlay')).toBeTruthy()
  })

  it('эмитит reset при клике на кнопку сброса', async () => {
    const wrapper = shallowMount(StepControls, {
      props: {
        currentStep: 2,
        totalSteps: 4,
        isFirst: false,
        isLast: false,
        isPlaying: false,
      },
      global: { stubs: stepControlsStubs },
    })
    const buttons = wrapper.findAll('button')
    // Кнопки: reset(0), prev(1), play(2), next(3)
    await buttons[0].trigger('click')
    expect(wrapper.emitted('reset')).toBeTruthy()
  })
})

// --- Тесты CodeDisplay ---

describe('CodeDisplay', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(CodeDisplay, {
      props: { code: 'const x = 1;\nconst y = 2;' },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает строки кода', () => {
    const code = 'let a = 1;\nlet b = 2;\nlet c = 3;'
    const wrapper = shallowMount(CodeDisplay, {
      props: { code },
    })
    expect(wrapper.text()).toContain('let a = 1;')
    expect(wrapper.text()).toContain('let b = 2;')
    expect(wrapper.text()).toContain('let c = 3;')
  })

  it('отображает номера строк', () => {
    const wrapper = shallowMount(CodeDisplay, {
      props: { code: 'a\nb\nc' },
    })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('3')
  })

  it('подсвечивает активную строку', () => {
    const wrapper = shallowMount(CodeDisplay, {
      props: { code: 'a\nb\nc', activeLine: 2 },
    })
    const lines = wrapper.findAll('.flex')
    // Строка 2 (index 1) должна иметь класс с bg-primary
    expect(lines[1].classes().join(' ')).toContain('bg-primary')
  })
})

// --- Тесты StateInspector ---

describe('StateInspector', () => {
  const step: WalkthroughStep = {
    line: 2,
    description: 'Создаём переменную count',
    variables: { count: '0', name: '"test"' },
    callStack: ['global', 'counter'],
  }

  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(StateInspector, {
      props: { step },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает переменные', () => {
    const wrapper = shallowMount(StateInspector, {
      props: { step },
    })
    expect(wrapper.text()).toContain('count')
    expect(wrapper.text()).toContain('0')
    expect(wrapper.text()).toContain('name')
    expect(wrapper.text()).toContain('"test"')
  })

  it('отображает call stack', () => {
    const wrapper = shallowMount(StateInspector, {
      props: { step },
    })
    expect(wrapper.text()).toContain('global')
    expect(wrapper.text()).toContain('counter')
  })

  it('отображает заголовки секций', () => {
    const wrapper = shallowMount(StateInspector, {
      props: { step },
    })
    expect(wrapper.text()).toContain('walkthrough.variables')
    expect(wrapper.text()).toContain('walkthrough.call_stack')
  })
})
