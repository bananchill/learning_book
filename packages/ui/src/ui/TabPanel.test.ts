import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, nextTick } from 'vue'
import TabPanel from './TabPanel.vue'

describe('TabPanel', () => {
  const mountTabPanel = (name: string, activeTabValue: string = 'tab1') => {
    return mount(TabPanel, {
      props: { name },
      slots: { default: '<p>Содержимое панели</p>' },
      global: {
        provide: {
          activeTab: ref(activeTabValue),
        },
      },
    })
  }

  it('отображается без ошибок', () => {
    const wrapper = mountTabPanel('tab1')
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(true)
  })

  it('показывает содержимое когда панель активна', () => {
    const wrapper = mountTabPanel('tab1', 'tab1')
    const panel = wrapper.find('[role="tabpanel"]')
    // v-show работает через display: none, поэтому элемент всегда в DOM
    expect(panel.isVisible()).toBe(true)
  })

  it('скрывает содержимое когда панель неактивна', () => {
    const wrapper = mountTabPanel('tab2', 'tab1')
    const panel = wrapper.find('[role="tabpanel"]')
    expect(panel.isVisible()).toBe(false)
  })

  it('отображает содержимое слота', () => {
    const wrapper = mountTabPanel('tab1', 'tab1')
    expect(wrapper.text()).toContain('Содержимое панели')
  })

  it('имеет role="tabpanel"', () => {
    const wrapper = mountTabPanel('tab1')
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(true)
  })

  it('интегрируется с TabGroup и переключает видимость', async () => {
    // Тестируем через интеграцию с TabGroup для проверки реактивности provide/inject
    const TabGroup = (await import('./TabGroup.vue')).default
    const wrapper = mount(TabGroup, {
      props: { tabs: ['tab1', 'tab2'] },
      slots: {
        default: {
          template: `
            <TabPanel name="tab1"><p>Панель 1</p></TabPanel>
            <TabPanel name="tab2"><p>Панель 2</p></TabPanel>
          `,
          components: { TabPanel },
        },
      },
    })

    // Первая вкладка активна по умолчанию
    expect(wrapper.findAll('[role="tabpanel"]')[0].isVisible()).toBe(true)
    expect(wrapper.findAll('[role="tabpanel"]')[1].isVisible()).toBe(false)

    // Кликаем на вторую вкладку
    const tabButtons = wrapper.findAll('[role="tab"]')
    await tabButtons[1].trigger('click')

    // Проверяем, что aria-selected обновилось на кнопках вкладок
    expect(wrapper.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('false')
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true')

    // Проверяем стиль display напрямую, v-show ставит display: none
    const panelElements = wrapper.findAll('[role="tabpanel"]')
    expect(panelElements[0].attributes('style')).toContain('display: none')
    expect(panelElements[1].attributes('style')).not.toContain('display: none')
  })

  it('работает без provide (graceful degradation)', () => {
    const wrapper = mount(TabPanel, {
      props: { name: 'tab1' },
      slots: { default: 'Контент' },
    })
    // Без activeTab inject, isActive будет false, панель скрыта
    expect(wrapper.find('[role="tabpanel"]').isVisible()).toBe(false)
  })
})
