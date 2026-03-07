<script setup lang="ts">
import type { ChatMessage } from '@book/shared'

defineProps<{
  message: ChatMessage
  isStreaming?: boolean
}>()

const isUser = (role: string) => role === 'user'
</script>

<template>
  <div
    class="flex gap-3"
    :class="isUser(message.role) ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- Аватар -->
    <div
      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
      :class="isUser(message.role)
        ? 'bg-primary-light text-primary'
        : 'bg-accent-light text-accent'"
    >
      {{ isUser(message.role) ? '👤' : '🤖' }}
    </div>

    <!-- Пузырь -->
    <div
      class="max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed"
      :class="isUser(message.role)
        ? 'bg-primary text-text-inverse rounded-tr-sm'
        : 'bg-surface-elevated border border-border text-text rounded-tl-sm'"
    >
      <!-- Простой рендеринг с поддержкой code и переносов -->
      <div class="whitespace-pre-wrap break-words" v-text="message.content" />

      <!-- Курсор при стриминге -->
      <span
        v-if="isStreaming && !isUser(message.role)"
        class="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom rounded-sm"
      />
    </div>
  </div>
</template>
