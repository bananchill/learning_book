import { createI18n, useI18n as useVueI18n } from 'vue-i18n'
import ru from './locales/ru.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: { ru },
})

export const useI18n = useVueI18n
