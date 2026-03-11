import { describe, it, expect, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { buildSystemPrompt } from './model/useChatContext'
import ChatMessage from './ui/ChatMessage.vue'
import ChatInput from './ui/ChatInput.vue'
import ChatToggle from './ui/ChatToggle.vue'
import type { ChatMessage as ChatMessageType, ChapterContext, TestResult, Task } from '@book/shared'

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

// --- Тесты buildSystemPrompt ---

describe('buildSystemPrompt', () => {
  it('возвращает базовый промпт без контекста', () => {
    const result = buildSystemPrompt({})
    expect(result).toContain('Ты — программистский ментор')
    expect(result).toContain('Отвечай на русском языке')
  })

  it('включает информацию о главе при передаче chapterContext', () => {
    const context: ChapterContext = {
      chapterId: 'ch01',
      title: 'Замыкания',
      topic: 'JavaScript замыкания',
      subchapter: 'Scope Chain',
      keyConcepts: ['замыкание', 'scope'],
      commonMistakes: ['утечка памяти'],
    }

    const result = buildSystemPrompt({ chapterContext: context })
    expect(result).toContain('Замыкания')
    expect(result).toContain('JavaScript замыкания')
    expect(result).toContain('Scope Chain')
    expect(result).toContain('замыкание, scope')
    expect(result).toContain('утечка памяти')
  })

  it('включает информацию о задаче при передаче task', () => {
    const task: Task = {
      id: 'task-01',
      title: 'Создать счётчик',
      difficulty: 'easy',
      description: 'Реализуйте функцию счётчика',
      file: 'counter.js',
      testFile: 'counter.test.js',
      concepts: ['closures'],
      hints: ['Используйте замыкание'],
      estimatedMinutes: 10,
    }

    const result = buildSystemPrompt({ task })
    expect(result).toContain('Создать счётчик')
    expect(result).toContain('Реализуйте функцию счётчика')
    expect(result).toContain('easy')
  })

  it('включает код пользователя при передаче userCode', () => {
    const result = buildSystemPrompt({ userCode: 'function add(a, b) { return a + b }' })
    expect(result).toContain('Текущий код студента')
    expect(result).toContain('function add(a, b) { return a + b }')
  })

  it('включает результаты тестов при передаче testResults', () => {
    const testResults: TestResult[] = [
      { name: 'test add', status: 'pass', duration: 5 },
      { name: 'test sub', status: 'fail', message: 'Expected 3, got 2', duration: 3 },
    ]

    const result = buildSystemPrompt({ testResults })
    expect(result).toContain('Результаты тестов')
    expect(result).toContain('test add')
    expect(result).toContain('test sub')
    expect(result).toContain('Expected 3, got 2')
  })

  it('выводит свободный режим при отсутствии задачи', () => {
    const result = buildSystemPrompt({ task: null })
    expect(result).toContain('свободном режиме')
  })
})

// --- Тесты ChatMessage ---

describe('ChatMessage', () => {
  const userMessage: ChatMessageType = {
    id: 'msg-1',
    role: 'user',
    content: 'Что такое замыкание?',
    timestamp: Date.now(),
  }

  const assistantMessage: ChatMessageType = {
    id: 'msg-2',
    role: 'assistant',
    content: 'Замыкание — это функция вместе с её лексическим окружением.',
    timestamp: Date.now(),
  }

  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: userMessage },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает содержимое сообщения', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: userMessage },
    })
    expect(wrapper.text()).toContain('Что такое замыкание?')
  })

  it('показывает аватар пользователя для user-сообщения', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: userMessage },
    })
    // Для пользователя flex-row-reverse
    const container = wrapper.find('.flex')
    expect(container.classes()).toContain('flex-row-reverse')
  })

  it('показывает аватар ассистента для assistant-сообщения', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: assistantMessage },
    })
    const container = wrapper.find('.flex')
    expect(container.classes()).toContain('flex-row')
  })

  it('показывает курсор при стриминге для ассистента', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: assistantMessage, isStreaming: true },
    })
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('не показывает курсор при стриминге для пользователя', () => {
    const wrapper = shallowMount(ChatMessage, {
      props: { message: userMessage, isStreaming: true },
    })
    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
  })
})

// --- Тесты ChatInput ---

describe('ChatInput', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(ChatInput)
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает placeholder', () => {
    const wrapper = shallowMount(ChatInput)
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('chat.placeholder')
  })

  it('кнопка отправки заблокирована при пустом вводе', () => {
    const wrapper = shallowMount(ChatInput)
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('кнопка отправки заблокирована при disabled=true', () => {
    const wrapper = shallowMount(ChatInput, {
      props: { disabled: true },
    })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('эмитит "send" с текстом при клике на кнопку', async () => {
    const wrapper = shallowMount(ChatInput)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Привет!')
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted('send')).toBeTruthy()
    expect(wrapper.emitted('send')![0]).toEqual(['Привет!'])
  })

  it('очищает поле после отправки', async () => {
    const wrapper = shallowMount(ChatInput)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Тест')
    const button = wrapper.find('button')
    await button.trigger('click')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })
})

// --- Тесты ChatToggle ---

describe('ChatToggle', () => {
  it('рендерится без ошибок', () => {
    const wrapper = shallowMount(ChatToggle)
    expect(wrapper.exists()).toBe(true)
  })

  it('эмитит "toggle" при клике', async () => {
    const wrapper = shallowMount(ChatToggle)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle')).toBeTruthy()
  })

  it('применяет стили активного состояния при active=true', () => {
    const wrapper = shallowMount(ChatToggle, {
      props: { active: true },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-primary')
  })

  it('показывает иконку закрытия при active=true', () => {
    const wrapper = shallowMount(ChatToggle, {
      props: { active: true },
    })
    expect(wrapper.text()).toContain('✕')
  })

  it('показывает иконку чата при active=false', () => {
    const wrapper = shallowMount(ChatToggle, {
      props: { active: false },
    })
    expect(wrapper.text()).not.toContain('✕')
  })
})
