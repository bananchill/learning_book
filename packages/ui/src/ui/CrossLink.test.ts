import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CrossLink from './CrossLink.vue'

describe('CrossLink', () => {
  it('отображается без ошибок с обязательным пропсом to', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures' },
    })
    expect(wrapper.find('a').exists()).toBe(true)
  })

  it('генерирует правильный href из пропса to', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures' },
    })
    expect(wrapper.find('a').attributes('href')).toBe('/ch01-closures')
  })

  it('отображает title если передан', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures', title: 'Замыкания' },
    })
    expect(wrapper.text()).toContain('Замыкания')
  })

  it('генерирует displayTitle из to если title не передан', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures' },
    })
    // ch01-closures → "closures"
    expect(wrapper.text()).toContain('closures')
  })

  it('заменяет дефисы на пробелы в автогенерируемом title', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch02-event-loop-basics' },
    })
    // ch02-event-loop-basics → "event loop basics"
    expect(wrapper.text()).toContain('event loop basics')
  })

  it('содержит SVG иконку стрелки', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('имеет корректные стилевые классы для ссылки', () => {
    const wrapper = mount(CrossLink, {
      props: { to: 'ch01-closures' },
    })
    expect(wrapper.find('a').classes()).toContain('text-primary')
    expect(wrapper.find('a').classes()).toContain('underline')
  })
})
