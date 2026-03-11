import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CheatsheetModal from './CheatsheetModal.vue'

// Мокаем vue-i18n (используется внутри BaseModal)
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

describe('CheatsheetModal', () => {
  const mountCheatsheet = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => {
    return mount(CheatsheetModal, {
      props: { open: true, title: 'Шпаргалка', ...props },
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
    const wrapper = mountCheatsheet()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('не отображает содержимое при open=false', () => {
    const wrapper = mountCheatsheet({ open: false })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('передаёт title в BaseModal', () => {
    const wrapper = mountCheatsheet({ title: 'Closures Cheatsheet' })
    expect(wrapper.text()).toContain('Closures Cheatsheet')
  })

  it('отображает содержимое слота', () => {
    const wrapper = mountCheatsheet({}, { default: '<pre>const x = 1</pre>' })
    expect(wrapper.text()).toContain('const x = 1')
  })

  it('оборачивает слот в div с классом book-prose', () => {
    const wrapper = mountCheatsheet({}, { default: 'Контент' })
    expect(wrapper.find('.book-prose').exists()).toBe(true)
  })

  it('эмитит close при закрытии модала', async () => {
    const wrapper = mountCheatsheet()
    // Триггерим close через оверлей BaseModal
    const overlay = wrapper.find('.bg-black\\/50')
    await overlay.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
