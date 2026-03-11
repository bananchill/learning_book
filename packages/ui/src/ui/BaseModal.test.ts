import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseModal from './BaseModal.vue'

// Мокаем vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

describe('BaseModal', () => {
  const mountModal = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
    return mount(BaseModal, {
      props: { open: true, ...props },
      slots,
      global: {
        stubs: {
          Teleport: true,
          Transition: false,
        },
      },
    })
  }

  it('отображается без ошибок при open=true', () => {
    const wrapper = mountModal()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('не отображает содержимое при open=false', () => {
    const wrapper = mountModal({ open: false })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('отображает заголовок если передан title', () => {
    const wrapper = mountModal({ title: 'Тестовый заголовок' })
    expect(wrapper.text()).toContain('Тестовый заголовок')
  })

  it('не отображает заголовок если title не передан', () => {
    const wrapper = mountModal()
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mountModal({}, { default: '<p>Содержимое модала</p>' })
    expect(wrapper.text()).toContain('Содержимое модала')
  })

  it('эмитит close при клике на оверлей', async () => {
    const wrapper = mountModal()
    // Оверлей — это div с bg-black/50
    const overlay = wrapper.find('.bg-black\\/50')
    await overlay.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('эмитит close при клике на кнопку закрытия', async () => {
    const wrapper = mountModal({ title: 'Заголовок' })
    const closeButton = wrapper.find('button[aria-label="common.close"]')
    await closeButton.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('устанавливает aria-label на диалоге из title', () => {
    const wrapper = mountModal({ title: 'Модальное окно' })
    expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe('Модальное окно')
  })
})
