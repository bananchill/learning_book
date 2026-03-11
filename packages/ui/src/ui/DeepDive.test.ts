import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DeepDive from './DeepDive.vue'

// Мокаем vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

// Мокаем useCollapsible
vi.mock('../lib/useCollapsible', () => ({
  useCollapsible: () => {
    const { ref } = require('vue')
    const isOpen = ref(false)
    return {
      isOpen,
      toggle: () => { isOpen.value = !isOpen.value },
      open: () => { isOpen.value = true },
      close: () => { isOpen.value = false },
    }
  },
}))

describe('DeepDive', () => {
  const mountDeepDive = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
    return mount(DeepDive, {
      props: { title: 'Углублённый разбор', ...props },
      slots: { default: 'Детальное содержимое', ...slots },
    })
  }

  it('отображается без ошибок', () => {
    const wrapper = mountDeepDive()
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('отображает заголовок', () => {
    const wrapper = mountDeepDive({ title: 'Как работает V8' })
    expect(wrapper.text()).toContain('Как работает V8')
  })

  it('содержимое скрыто по умолчанию (свёрнуто)', () => {
    const wrapper = mountDeepDive()
    // Когда свёрнуто, grid-rows-[0fr] скрывает контент
    const gridContainer = wrapper.find('.grid')
    expect(gridContainer.classes()).toContain('grid-rows-[0fr]')
  })

  it('раскрывает содержимое при клике на кнопку', async () => {
    const wrapper = mountDeepDive()
    await wrapper.find('button').trigger('click')
    const gridContainer = wrapper.find('.grid')
    expect(gridContainer.classes()).toContain('grid-rows-[1fr]')
  })

  it('отображает текст "expand" когда свёрнуто', () => {
    const wrapper = mountDeepDive()
    expect(wrapper.text()).toContain('deep_dive.expand')
  })

  it('отображает текст "collapse" когда развёрнуто', async () => {
    const wrapper = mountDeepDive()
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('deep_dive.collapse')
  })

  it('устанавливает aria-expanded=false по умолчанию', () => {
    const wrapper = mountDeepDive()
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('устанавливает aria-expanded=true после раскрытия', async () => {
    const wrapper = mountDeepDive()
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('отображает содержимое слота', () => {
    const wrapper = mountDeepDive({}, { default: 'Подробное объяснение замыканий' })
    expect(wrapper.html()).toContain('Подробное объяснение замыканий')
  })
})
