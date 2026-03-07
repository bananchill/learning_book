import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isOpen = ref(true)
  const isMobile = ref(false)

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function setMobile(value: boolean) {
    isMobile.value = value
    if (value) isOpen.value = false
  }

  return { isOpen, isMobile, toggle, open, close, setMobile }
})
