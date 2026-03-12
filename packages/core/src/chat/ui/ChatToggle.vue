<script setup lang="ts">
import { useI18n } from '@book/i18n'

defineProps<{
  active?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

const { t } = useI18n()
</script>

<template>
  <button
    class="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-95"
    :class="active
      ? 'bg-primary text-text-inverse'
      : 'bg-surface-elevated border border-border text-text hover:border-primary'"
    :aria-label="active ? t('common.close') : t('chat.title')"
    @click="emit('toggle')"
  >
    {{ active ? '✕' : '💬' }}
  </button>
</template>
