import { ref, watch, readonly } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'book-theme'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return null
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

// Глобальное состояние — разделяется между всеми вызовами useTheme
const theme = ref<Theme>(getStoredTheme() ?? getSystemTheme())

// Применяем при инициализации
applyTheme(theme.value)

// Синхронизируем изменения с DOM и localStorage
watch(theme, (value) => {
  applyTheme(value)
  localStorage.setItem(STORAGE_KEY, value)
})

// Слушаем изменения системной темы (если пользователь не выбрал вручную)
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      theme.value = e.matches ? 'dark' : 'light'
    }
  })
}

export function useTheme() {
  const isDark = ref(theme.value === 'dark')

  watch(theme, (value) => {
    isDark.value = value === 'dark'
  })

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(value: Theme) {
    theme.value = value
  }

  return {
    theme: readonly(theme),
    isDark: readonly(isDark),
    toggle,
    setTheme,
  }
}
