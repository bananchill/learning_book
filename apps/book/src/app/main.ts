import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { i18n } from '@book/i18n'
import { routes, scrollBehavior } from './router'
import App from './App.vue'
import {
  DeepDive,
  Callout,
  CodeBlock,
  TabGroup,
  TabPanel,
  CrossLink,
  EventLoopSimulator,
} from '@book/ui'
import './styles/main.css'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  ({ app, initialState }) => {
    const pinia = createPinia()
    app.use(pinia)
    app.use(i18n)

    // Гидрация состояния Pinia при SSG
    if (import.meta.env.SSR) {
      initialState.pinia = pinia.state.value
    } else {
      if (initialState.pinia) {
        pinia.state.value = initialState.pinia
      }
    }

    // Глобальная регистрация компонентов для использования в markdown-контенте
    app.component('DeepDive', DeepDive)
    app.component('Callout', Callout)
    app.component('CodeBlock', CodeBlock)
    app.component('TabGroup', TabGroup)
    app.component('TabPanel', TabPanel)
    app.component('CrossLink', CrossLink)
    app.component('EventLoopSimulator', EventLoopSimulator)
  },
)
