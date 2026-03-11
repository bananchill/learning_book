import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'
import { ref, computed, nextTick } from 'vue'
import { formatCode } from './lib/codeFormatter'
import CodeSandbox from './ui/CodeSandbox.vue'

// --- Мок зависимостей ---

vi.mock('@book/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
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
  useDebounceFn: (fn: Function) => fn,
  useLocalStorage: (_key: string, initial: unknown) => ref(initial),
  useStorage: (_key: string, initial: unknown) => ref(initial),
}))

// Мокаем useTestRunner, чтобы не поднимать Web Worker
vi.mock('./model/useTestRunner', () => ({
  useTestRunner: (_starterCode: any, _testCode: any, _options: any) => ({
    code: ref(''),
    isRunning: ref(false),
    error: ref(null),
    testResults: ref([]),
    consoleLogs: ref([]),
    canUndo: computed(() => false),
    canRedo: computed(() => false),
    run: vi.fn(),
    reset: vi.fn(),
    updateCode: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    format: vi.fn(),
  }),
}))

// --- Тесты форматирования кода ---

describe('formatCode', () => {
  it('удаляет trailing whitespace', () => {
    const result = formatCode('const x = 1   \nconst y = 2  ')
    expect(result).toBe('const x = 1\nconst y = 2\n')
  })

  it('схлопывает несколько пустых строк подряд в одну', () => {
    const result = formatCode('a\n\n\n\nb')
    expect(result).toBe('a\n\nb\n')
  })

  it('заменяет табы на 2 пробела', () => {
    const result = formatCode('\tconst x = 1')
    expect(result).toBe('  const x = 1\n')
  })

  it('убирает пустые строки в начале и конце', () => {
    const result = formatCode('\n\n  hello\n\n')
    expect(result).toBe('  hello\n')
  })

  it('добавляет финальный перенос строки', () => {
    const result = formatCode('const x = 1')
    expect(result).toBe('const x = 1\n')
  })

  it('обрабатывает пустую строку', () => {
    const result = formatCode('')
    expect(result).toBe('\n')
  })
})

// --- Тесты компонента CodeSandbox ---

describe('CodeSandbox', () => {
  it('рендерится без ошибок с дефолтными пропсами', () => {
    const wrapper = shallowMount(CodeSandbox)
    expect(wrapper.exists()).toBe(true)
  })

  it('рендерится с заданными пропсами', () => {
    const wrapper = shallowMount(CodeSandbox, {
      props: {
        starterCode: 'console.log("hello")',
        testCode: 'test("works", () => {})',
        language: 'typescript',
        readOnly: true,
        height: '400px',
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает метку языка', () => {
    const wrapper = shallowMount(CodeSandbox, {
      props: { language: 'typescript' },
    })
    const languageLabel = wrapper.find('.font-mono')
    expect(languageLabel.exists()).toBe(true)
    expect(languageLabel.text()).toBe('typescript')
  })

  it('показывает заголовок sandbox при наличии testCode', () => {
    const wrapper = shallowMount(CodeSandbox, {
      props: { testCode: 'test("example", () => {})' },
    })
    // Ищем текст sandbox.title (через мокнутый t())
    expect(wrapper.text()).toContain('sandbox.title')
  })

  it('не показывает заголовок sandbox без testCode', () => {
    const wrapper = shallowMount(CodeSandbox, {
      props: { testCode: '' },
    })
    expect(wrapper.text()).not.toContain('sandbox.title')
  })
})
