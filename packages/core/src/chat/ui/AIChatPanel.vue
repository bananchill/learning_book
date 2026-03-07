<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterContext, Task, TestResult } from '@book/shared'
import { useAIChat } from '../model/useAIChat'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'

const props = withDefaults(defineProps<{
  chapterContext?: ChapterContext
  userCode?: string
  testResults?: TestResult[]
  task?: Task | null
  visible?: boolean
}>(), {
  userCode: '',
  testResults: () => [],
  task: null,
  visible: false,
})

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const messagesContainer = ref<HTMLDivElement>()

const chapterId = ref(props.chapterContext?.chapterId || 'default')

const {
  messages,
  isStreaming,
  error,
  canSend,
  cooldown,
  send,
  clear,
} = useAIChat(chapterId.value, {
  chapterContext: () => props.chapterContext,
  userCode: () => props.userCode,
  testResults: () => props.testResults,
  task: () => props.task,
})

// Авто-скролл вниз при новых сообщениях
watch(
  () => messages.value.length > 0 ? messages.value[messages.value.length - 1]?.content : '',
  () => {
    nextTick(() => {
      const el = messagesContainer.value
      if (el) el.scrollTop = el.scrollHeight
    })
  },
)
</script>

<template>
  <Transition name="slide-right-">
    <div
      v-if="visible"
      class="fixed right-0 top-0 h-full w-full sm:w-96 z-50 flex flex-col bg-bg border-l border-border shadow-lg"
    >
      <!-- Шапка -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <h3 class="text-sm font-semibold text-text">{{ t('chat.title') }}</h3>
        <div class="flex items-center gap-2">
          <button
            v-if="messages.length > 0"
            class="text-xs text-text-muted hover:text-text transition-colors"
            @click="clear"
          >
            {{ t('chat.clear') }}
          </button>
          <button
            class="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-muted transition-colors"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Сообщения -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        <!-- Приветствие, если нет сообщений -->
        <div
          v-if="messages.length === 0"
          class="flex gap-3"
        >
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-sm">
            🤖
          </div>
          <div class="max-w-[80%] rounded-xl rounded-tl-sm bg-surface-elevated border border-border px-4 py-2.5 text-sm text-text leading-relaxed">
            {{ t('chat.mentor_greeting') }}
          </div>
        </div>

        <ChatMessage
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :is-streaming="isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === 'assistant'"
        />

        <!-- Индикатор «думаю» -->
        <div
          v-if="isStreaming && messages.length > 0 && messages[messages.length - 1]?.content === ''"
          class="flex gap-3"
        >
          <div class="flex-shrink-0 w-8 h-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-sm">
            🤖
          </div>
          <div class="rounded-xl rounded-tl-sm bg-surface-elevated border border-border px-4 py-2.5 text-sm text-text-muted">
            {{ t('chat.thinking') }}
          </div>
        </div>
      </div>

      <!-- Ошибка -->
      <div
        v-if="error"
        class="px-4 py-2 bg-danger-light text-danger text-xs border-t border-border"
      >
        {{ error }}
      </div>

      <!-- Кулдаун -->
      <div
        v-if="cooldown && !isStreaming"
        class="px-4 py-1 text-xs text-text-muted text-center"
      >
        {{ t('chat.cooldown') }}
      </div>

      <!-- Ввод -->
      <ChatInput
        :disabled="!canSend"
        @send="send"
      />
    </div>
  </Transition>
</template>
