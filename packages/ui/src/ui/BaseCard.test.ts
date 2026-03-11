import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseCard from './BaseCard.vue'

describe('BaseCard', () => {
  it('отображается без ошибок с пропсами по умолчанию', () => {
    const wrapper = mount(BaseCard)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mount(BaseCard, {
      slots: { default: '<p>Контент карточки</p>' },
    })
    expect(wrapper.text()).toContain('Контент карточки')
  })

  it('применяет padding при padding=true', () => {
    const wrapper = mount(BaseCard, {
      props: { padding: true },
    })
    expect(wrapper.classes()).toContain('p-6')
  })

  it('не применяет padding при padding=false', () => {
    const wrapper = mount(BaseCard, {
      props: { padding: false },
    })
    expect(wrapper.classes()).not.toContain('p-6')
  })

  it('не применяет padding когда проп не передан (Vue boolean casting)', () => {
    const wrapper = mount(BaseCard)
    // Vue 3 приводит необязательный boolean проп к false, если не передан
    // (false ?? true) => false, значит p-6 не применяется
    expect(wrapper.classes()).not.toContain('p-6')
  })

  it('имеет базовые стилевые классы карточки', () => {
    const wrapper = mount(BaseCard)
    expect(wrapper.classes()).toContain('rounded-xl')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('border-border')
    expect(wrapper.classes()).toContain('bg-surface-elevated')
    expect(wrapper.classes()).toContain('shadow-sm')
  })
})
