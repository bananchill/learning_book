import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EventLoopSimulator from './EventLoopSimulator.vue'

// Мокаем @book/i18n
vi.mock('@book/i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

describe('EventLoopSimulator', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mountSimulator = () => {
    return mount(EventLoopSimulator)
  }

  it('отображается без ошибок', () => {
    const wrapper = mountSimulator()
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('отображает заголовок "Event Loop Simulator"', () => {
    const wrapper = mountSimulator()
    expect(wrapper.text()).toContain('Event Loop Simulator')
  })

  it('отображает кнопки переключения режимов', () => {
    const wrapper = mountSimulator()
    const buttons = wrapper.findAll('button')
    // Должны быть кнопки для Code/Viz режимов, пресетов, навигации
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('отображает пресеты', () => {
    const wrapper = mountSimulator()
    // 4 пресета: Базовый, Вложенный Promise, Микро в микро, Всё вместе
    expect(wrapper.text()).toContain('Базовый')
    expect(wrapper.text()).toContain('Вложенный Promise')
  })

  it('отображает секции очередей в режиме визуализации', () => {
    const wrapper = mountSimulator()
    expect(wrapper.text()).toContain('Call Stack')
    expect(wrapper.text()).toContain('Microtask Queue')
    expect(wrapper.text()).toContain('Macrotask Queue')
    expect(wrapper.text()).toContain('Web APIs')
  })

  it('отображает секцию Console', () => {
    const wrapper = mountSimulator()
    expect(wrapper.text()).toContain('Console')
  })

  it('отображает счётчик шагов', () => {
    const wrapper = mountSimulator()
    // Формат "1/N"
    expect(wrapper.text()).toMatch(/1\/\d+/)
  })

  it('переключается в режим редактирования при клике', async () => {
    const wrapper = mountSimulator()
    // Находим кнопку с текстом event_loop.code_tab (режим Code)
    const buttons = wrapper.findAll('button')
    const codeButton = buttons.find(b => b.text().includes('event_loop.code_tab'))
    if (codeButton) {
      await codeButton.trigger('click')
      // В режиме редактирования должен появиться textarea
      expect(wrapper.find('textarea').exists()).toBe(true)
    }
  })

  it('загружает пресет при клике на кнопку пресета', async () => {
    const wrapper = mountSimulator()
    const buttons = wrapper.findAll('button')
    const presetButton = buttons.find(b => b.text() === 'Микро в микро')
    if (presetButton) {
      await presetButton.trigger('click')
      // После загрузки пресета счётчик шагов сбрасывается на 1
      expect(wrapper.text()).toMatch(/1\/\d+/)
    }
  })

  it('отображает навигационные кнопки', () => {
    const wrapper = mountSimulator()
    // Должны быть кнопки: reset, prev, play/auto, next
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(4)
  })
})
