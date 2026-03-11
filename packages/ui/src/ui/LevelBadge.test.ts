import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LevelBadge from './LevelBadge.vue'

// Мокаем vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

describe('LevelBadge', () => {
  it('отображается без ошибок с level=junior', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'junior' },
    })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('отображает переведённый текст для junior', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'junior' },
    })
    expect(wrapper.text()).toContain('interview.level.junior')
  })

  it('отображает переведённый текст для middle', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'middle' },
    })
    expect(wrapper.text()).toContain('interview.level.middle')
  })

  it('отображает переведённый текст для senior', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'senior' },
    })
    expect(wrapper.text()).toContain('interview.level.senior')
  })

  it('применяет классы success для junior', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'junior' },
    })
    expect(wrapper.classes()).toContain('bg-success-light')
    expect(wrapper.classes()).toContain('text-success-text')
  })

  it('применяет классы warning для middle', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'middle' },
    })
    expect(wrapper.classes()).toContain('bg-warning-light')
    expect(wrapper.classes()).toContain('text-warning-text')
  })

  it('применяет классы danger для senior', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'senior' },
    })
    expect(wrapper.classes()).toContain('bg-danger-light')
    expect(wrapper.classes()).toContain('text-danger-text')
  })

  it('имеет базовые классы бейджа', () => {
    const wrapper = mount(LevelBadge, {
      props: { level: 'junior' },
    })
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-xs')
    expect(wrapper.classes()).toContain('font-medium')
  })
})
