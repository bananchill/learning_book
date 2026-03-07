<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useI18n } from '@book/i18n'

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const { t } = useI18n()
const text = ref('')
const textarea = ref<HTMLTextAreaElement>()

function handleSend() {
  const trimmed = text.value.trim()
  if (!trimmed || props.disabled) return
  emit('send', trimmed)
  text.value = ''
  nextTick(resize)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function resize() {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}
</script>

<template>
  <div class="flex items-end gap-2 p-3 border-t border-border bg-surface">
    <textarea
      ref="textarea"
      v-model="text"
      :placeholder="t('chat.placeholder')"
      :disabled="disabled"
      rows="1"
      class="flex-1 resize-none rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
      @keydown="handleKeydown"
      @input="resize"
    />
    <button
      :disabled="disabled || !text.trim()"
      class="flex-shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-text-inverse hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      @click="handleSend"
    >
      {{ t('chat.send') }}
    </button>
  </div>
</template>
