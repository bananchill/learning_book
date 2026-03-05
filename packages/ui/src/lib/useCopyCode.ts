import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

export function useCopyCode() {
  const copied = ref(false)
  const { copy } = useClipboard()

  const copyCode = async (code: string) => {
    await copy(code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  return { copied, copyCode }
}
