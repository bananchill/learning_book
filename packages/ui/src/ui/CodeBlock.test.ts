import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'

// Мокаем vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

// Мокаем useHighlight — возвращаем подсвеченный HTML с реальными ref
vi.mock('../lib/useHighlight', () => ({
  useHighlight: () => ({
    html: ref('<pre><code>const x = 1</code></pre>'),
    loading: ref(false),
  }),
}))

// Мокаем useCopyCode с реальными ref
const mockCopyCode = vi.fn()
vi.mock('../lib/useCopyCode', () => ({
  useCopyCode: () => ({
    copied: ref(false),
    copyCode: mockCopyCode,
  }),
}))

describe('CodeBlock', () => {
  const mountCodeBlock = (props: Record<string, unknown> = {}) => {
    return mount(CodeBlock, {
      props: { code: 'const x = 1', ...props },
    })
  }

  it('отображается без ошибок с обязательным пропсом code', () => {
    const wrapper = mountCodeBlock()
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('отображает язык программирования в заголовке', () => {
    const wrapper = mountCodeBlock({ language: 'typescript' })
    expect(wrapper.text()).toContain('typescript')
  })

  it('отображает "js" по умолчанию если язык не указан', () => {
    const wrapper = mountCodeBlock()
    expect(wrapper.text()).toContain('js')
  })

  it('отображает кнопку копирования', () => {
    const wrapper = mountCodeBlock()
    const copyButton = wrapper.find('button')
    expect(copyButton.exists()).toBe(true)
    // Кнопка показывает common.copy (не copied, т.к. copied = false)
    expect(copyButton.text()).toBe('common.copy')
  })

  it('вызывает copyCode при клике на кнопку копирования', async () => {
    mockCopyCode.mockClear()
    const wrapper = mountCodeBlock()
    const copyButton = wrapper.find('button')
    await copyButton.trigger('click')
    expect(mockCopyCode).toHaveBeenCalledWith('const x = 1')
  })

  it('отображает подсвеченный код через v-html когда loading=false', () => {
    const wrapper = mountCodeBlock()
    // Мок useHighlight возвращает loading=false, поэтому v-html блок рендерится
    expect(wrapper.html()).toContain('const x = 1')
  })

  it('не отображает индикатор загрузки когда loading=false', () => {
    const wrapper = mountCodeBlock()
    expect(wrapper.text()).not.toContain('common.loading')
  })
})
