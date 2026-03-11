import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('отображается без ошибок с пропсами по умолчанию', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Нажми меня' },
    })
    expect(wrapper.text()).toContain('Нажми меня')
  })

  it('применяет классы варианта primary по умолчанию', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.classes()).toContain('bg-primary')
  })

  it('применяет классы варианта secondary', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'secondary' },
    })
    expect(wrapper.classes()).toContain('bg-surface-muted')
  })

  it('применяет классы варианта ghost', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'ghost' },
    })
    expect(wrapper.classes()).toContain('bg-transparent')
  })

  it('применяет классы варианта danger', () => {
    const wrapper = mount(BaseButton, {
      props: { variant: 'danger' },
    })
    expect(wrapper.classes()).toContain('bg-danger')
  })

  it('применяет классы размера sm', () => {
    const wrapper = mount(BaseButton, {
      props: { size: 'sm' },
    })
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('py-1.5')
  })

  it('применяет классы размера md по умолчанию', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.classes()).toContain('px-4')
    expect(wrapper.classes()).toContain('py-2')
  })

  it('применяет классы размера lg', () => {
    const wrapper = mount(BaseButton, {
      props: { size: 'lg' },
    })
    expect(wrapper.classes()).toContain('px-6')
    expect(wrapper.classes()).toContain('py-3')
  })

  it('устанавливает атрибут disabled при передаче пропса', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('применяет классы для disabled состояния', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('opacity-50')
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })

  it('эмитит событие click при нажатии', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
