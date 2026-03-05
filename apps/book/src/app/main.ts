import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from '@book/i18n'
import { router } from './router'
import App from './App.vue'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
app.use(router)

app.mount('#app')
