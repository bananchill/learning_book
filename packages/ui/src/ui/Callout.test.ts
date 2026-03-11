import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Callout from './Callout.vue'

describe('Callout', () => {
  it('отображается без ошибок с пропсами по умолчанию', () => {
    const wrapper = mount(Callout)
    expect(wrapper.find('[role="note"]').exists()).toBe(true)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mount(Callout, {
      slots: { default: 'Важная информация' },
    })
    expect(wrapper.text()).toContain('Важная информация')
  })

  it('применяет стили info по умолчанию', () => {
    const wrapper = mount(Callout)
    expect(wrapper.classes()).toContain('border-info')
    expect(wrapper.classes()).toContain('bg-info-light')
  })

  it('применяет стили для типа tip', () => {
    const wrapper = mount(Callout, {
      props: { type: 'tip' },
    })
    expect(wrapper.classes()).toContain('border-success')
    expect(wrapper.classes()).toContain('bg-success-light')
  })

  it('применяет стили для типа warning', () => {
    const wrapper = mount(Callout, {
      props: { type: 'warning' },
    })
    expect(wrapper.classes()).toContain('border-warning')
    expect(wrapper.classes()).toContain('bg-warning-light')
  })

  it('применяет стили для типа danger', () => {
    const wrapper = mount(Callout, {
      props: { type: 'danger' },
    })
    expect(wrapper.classes()).toContain('border-danger')
    expect(wrapper.classes()).toContain('bg-danger-light')
  })

  it('отображает заголовок если передан', () => {
    const wrapper = mount(Callout, {
      props: { title: 'Внимание!' },
    })
    expect(wrapper.text()).toContain('Внимание!')
  })

  it('не отображает заголовок если не передан', () => {
    const wrapper = mount(Callout)
    // Проверяем, что элемент заголовка (font-semibold) не отображается
    const titleElements = wrapper.findAll('.font-semibold')
    expect(titleElements.length).toBe(0)
  })

  it('отображает иконку с правильным символом для info', () => {
    const wrapper = mount(Callout, {
      props: { type: 'info' },
    })
    const icon = wrapper.find('[aria-hidden="true"]')
    expect(icon.text()).toBe('i')
  })

  it('отображает иконку с правильным символом для warning', () => {
    const wrapper = mount(Callout, {
      props: { type: 'warning' },
    })
    const icon = wrapper.find('[aria-hidden="true"]')
    expect(icon.text()).toBe('!')
  })

  it('имеет role="note" для доступности', () => {
    const wrapper = mount(Callout)
    expect(wrapper.find('[role="note"]').exists()).toBe(true)
  })
})
