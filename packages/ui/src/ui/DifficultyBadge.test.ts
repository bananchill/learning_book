import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DifficultyBadge from './DifficultyBadge.vue'

// Мокаем vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

// Мокаем @book/shared — тип Difficulty используется внутри
vi.mock('@book/shared', () => ({}))

describe('DifficultyBadge', () => {
  it('отображается без ошибок с level=easy', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'easy' },
    })
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('отображает переведённый текст для easy', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'easy' },
    })
    expect(wrapper.text()).toContain('difficulty.easy')
  })

  it('отображает переведённый текст для medium', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'medium' },
    })
    expect(wrapper.text()).toContain('difficulty.medium')
  })

  it('отображает переведённый текст для hard', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'hard' },
    })
    expect(wrapper.text()).toContain('difficulty.hard')
  })

  it('применяет классы success для easy', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'easy' },
    })
    expect(wrapper.classes()).toContain('bg-success-light')
    expect(wrapper.classes()).toContain('text-success-text')
  })

  it('применяет классы warning для medium', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'medium' },
    })
    expect(wrapper.classes()).toContain('bg-warning-light')
    expect(wrapper.classes()).toContain('text-warning-text')
  })

  it('применяет классы danger для hard', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'hard' },
    })
    expect(wrapper.classes()).toContain('bg-danger-light')
    expect(wrapper.classes()).toContain('text-danger-text')
  })

  it('имеет базовые классы бейджа', () => {
    const wrapper = mount(DifficultyBadge, {
      props: { level: 'easy' },
    })
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-xs')
    expect(wrapper.classes()).toContain('font-medium')
  })
})
