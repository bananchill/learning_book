<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const onOverlayClick = () => {
  emit('close')
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="props.open"
        class="fixed inset-0 z-modal flex items-center justify-center"
        @keydown="onKeydown"
      >
        <div
          class="absolute inset-0 bg-black/50"
          @click="onOverlayClick"
        />
        <div
          class="relative z-10 m-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-elevated shadow-xl"
          role="dialog"
          :aria-label="title"
        >
          <div
            v-if="title"
            class="flex items-center justify-between border-b border-border px-6 py-4"
          >
            <h2 class="text-lg font-semibold text-text">
              {{ title }}
            </h2>
            <button
              class="rounded-lg p-1.5 text-text-muted transition-colors duration-fast hover:bg-surface-muted hover:text-text-secondary"
              :aria-label="t('common.close')"
              @click="emit('close')"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
