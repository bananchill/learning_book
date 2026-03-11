import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconLabel from './IconLabel.vue'

describe('IconLabel', () => {
  it('отображается без ошибок с пропсами по умолчанию', () => {
    const wrapper = mount(IconLabel)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mount(IconLabel, {
      slots: { default: 'Название метки' },
    })
    expect(wrapper.text()).toContain('Название метки')
  })

  it('отображает иконку если передан проп icon', () => {
    const wrapper = mount(IconLabel, {
      props: { icon: '&#128218;' },
    })
    const iconSpans = wrapper.findAll('span')
    // Первый span — обёртка, внутри — span иконки и slot
    const iconSpan = iconSpans.find(s => s.attributes('aria-hidden') === 'true')
    expect(iconSpan).toBeDefined()
  })

  it('не отображает иконку если проп icon не передан', () => {
    const wrapper = mount(IconLabel)
    const iconSpan = wrapper.findAll('span').find(s => s.attributes('aria-hidden') === 'true')
    expect(iconSpan).toBeUndefined()
  })

  it('устанавливает aria-hidden="true" на иконке', () => {
    const wrapper = mount(IconLabel, {
      props: { icon: '!' },
    })
    const iconSpan = wrapper.find('[aria-hidden="true"]')
    expect(iconSpan.exists()).toBe(true)
  })

  it('рендерит icon через v-html', () => {
    const wrapper = mount(IconLabel, {
      props: { icon: '<b>X</b>' },
    })
    const iconSpan = wrapper.find('[aria-hidden="true"]')
    expect(iconSpan.html()).toContain('<b>X</b>')
  })

  it('имеет базовые стилевые классы', () => {
    const wrapper = mount(IconLabel)
    const outerSpan = wrapper.find('span')
    expect(outerSpan.classes()).toContain('inline-flex')
    expect(outerSpan.classes()).toContain('items-center')
    expect(outerSpan.classes()).toContain('text-sm')
  })
})
