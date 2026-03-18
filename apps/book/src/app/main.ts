import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
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

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior,
})

const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(i18n)

// Глобальная регистрация компонентов для использования в markdown-контенте
app.component('DeepDive', DeepDive)
app.component('Callout', Callout)
app.component('CodeBlock', CodeBlock)
app.component('TabGroup', TabGroup)
app.component('TabPanel', TabPanel)
app.component('CrossLink', CrossLink)
app.component('EventLoopSimulator', EventLoopSimulator)

app.mount('#app')
