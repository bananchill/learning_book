import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TabGroup from './TabGroup.vue'

describe('TabGroup', () => {
  const tabs = ['JavaScript', 'TypeScript', 'Vue']

  it('отображается без ошибок', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
  })

  it('отображает все переданные вкладки', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons.length).toBe(3)
    expect(tabButtons[0].text()).toBe('JavaScript')
    expect(tabButtons[1].text()).toBe('TypeScript')
    expect(tabButtons[2].text()).toBe('Vue')
  })

  it('выбирает первую вкладку по умолчанию', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    const firstTab = wrapper.findAll('[role="tab"]')[0]
    expect(firstTab.attributes('aria-selected')).toBe('true')
  })

  it('переключает активную вкладку при клике', async () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    const tabButtons = wrapper.findAll('[role="tab"]')

    await tabButtons[1].trigger('click')

    expect(tabButtons[0].attributes('aria-selected')).toBe('false')
    expect(tabButtons[1].attributes('aria-selected')).toBe('true')
  })

  it('применяет активные стили к выбранной вкладке', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    const firstTab = wrapper.findAll('[role="tab"]')[0]
    expect(firstTab.classes()).toContain('border-primary')
    expect(firstTab.classes()).toContain('text-primary')
  })

  it('применяет неактивные стили к невыбранным вкладкам', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    const secondTab = wrapper.findAll('[role="tab"]')[1]
    expect(secondTab.classes()).toContain('text-text-muted')
  })

  it('отображает содержимое слота', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
      slots: { default: '<div class="tab-content">Содержимое вкладки</div>' },
    })
    expect(wrapper.text()).toContain('Содержимое вкладки')
  })

  it('имеет role="tablist" на контейнере вкладок', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs },
    })
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
  })

  it('корректно работает с одной вкладкой', () => {
    const wrapper = mount(TabGroup, {
      props: { tabs: ['Единственная'] },
    })
    const tabButtons = wrapper.findAll('[role="tab"]')
    expect(tabButtons.length).toBe(1)
    expect(tabButtons[0].attributes('aria-selected')).toBe('true')
  })
})
