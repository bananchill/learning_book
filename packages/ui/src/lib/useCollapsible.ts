import { ref, type Ref } from 'vue'

export interface UseCollapsibleOptions {
  initialOpen?: boolean
}

export interface UseCollapsibleReturn {
  isOpen: Ref<boolean>
  toggle: () => void
  open: () => void
  close: () => void
}

export function useCollapsible(options: UseCollapsibleOptions = {}): UseCollapsibleReturn {
  const isOpen = ref(options.initialOpen ?? false)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return { isOpen, toggle, open, close }
}
