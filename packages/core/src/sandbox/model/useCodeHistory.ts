import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { CodeHistoryOptions } from '../lib/sandboxTypes'

const MAX_STACK_SIZE = 50

/**
 * Персистенция кода в localStorage + undo/redo стек.
 * Ключ хранения: `sandbox:${key}`
 */
export function useCodeHistory(
  key: string,
  initialCode: string,
  options: CodeHistoryOptions = {},
) {
  const { maxStackSize = MAX_STACK_SIZE } = options
  const storageKey = `sandbox:${key}`

  // Восстанавливаем последний сохранённый код или берём начальный
  const persisted = useLocalStorage(storageKey, initialCode)
  const code = ref(persisted.value)

  // Стек истории: массив снимков + указатель на текущий
  const history = ref<string[]>([code.value])
  const pointer = ref(0)

  const canUndo = computed(() => pointer.value > 0)
  const canRedo = computed(() => pointer.value < history.value.length - 1)

  /** Добавить новое состояние в стек */
  function push(newCode: string) {
    // Не дублируем одинаковые значения подряд
    if (newCode === history.value[pointer.value]) return

    // Обрезаем redo-ветку
    history.value = history.value.slice(0, pointer.value + 1)

    // Добавляем новое состояние
    history.value.push(newCode)

    // Ограничиваем размер стека
    if (history.value.length > maxStackSize) {
      history.value = history.value.slice(history.value.length - maxStackSize)
    }

    pointer.value = history.value.length - 1

    // Обновляем текущий код и сохраняем в localStorage
    code.value = newCode
    persisted.value = newCode
  }

  /** Отменить последнее изменение */
  function undo(): string | undefined {
    if (!canUndo.value) return undefined
    pointer.value--
    const restored = history.value[pointer.value]
    code.value = restored
    persisted.value = restored
    return restored
  }

  /** Повторить отменённое изменение */
  function redo(): string | undefined {
    if (!canRedo.value) return undefined
    pointer.value++
    const restored = history.value[pointer.value]
    code.value = restored
    persisted.value = restored
    return restored
  }

  /** Сброс к начальному коду + очистка стека */
  function reset(newInitialCode: string) {
    code.value = newInitialCode
    persisted.value = newInitialCode
    history.value = [newInitialCode]
    pointer.value = 0
  }

  /** Удалить запись из localStorage */
  function clear() {
    persisted.value = null as unknown as string
    localStorage.removeItem(storageKey)
  }

  return {
    code,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    reset,
    clear,
  }
}
