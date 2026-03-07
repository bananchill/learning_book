<script setup lang="ts">
import { useI18n } from '@book/i18n'
import type { ConsoleEntry } from '@book/shared'

defineProps<{
  logs: ConsoleEntry[]
}>()

const emit = defineEmits<{
  clear: []
}>()

const { t } = useI18n()

const levelClass: Record<ConsoleEntry['level'], string> = {
  log: 'text-text',
  warn: 'text-warning',
  error: 'text-danger',
}

const levelPrefix: Record<ConsoleEntry['level'], string> = {
  log: '>',
  warn: '⚠',
  error: '✕',
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg
  if (arg === null) return 'null'
  if (arg === undefined) return 'undefined'
  try {
    return JSON.stringify(arg, null, 2)
  } catch {
    return String(arg)
  }
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Заголовок -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
      <span class="text-sm font-medium text-text">{{ t('sandbox.console') }}</span>
      <button
        v-if="logs.length > 0"
        class="text-xs text-text-muted hover:text-text transition-colors"
        @click="emit('clear')"
      >
        {{ t('sandbox.clear_console') }}
      </button>
    </div>

    <!-- Логи -->
    <div class="max-h-40 overflow-y-auto font-mono text-xs px-4 py-3 space-y-1 bg-surface-inset">
      <div
        v-for="(entry, i) in logs"
        :key="i"
        :class="['flex gap-2 leading-5', levelClass[entry.level]]"
      >
        <span class="flex-shrink-0 opacity-50 select-none">{{ levelPrefix[entry.level] }}</span>
        <span class="break-all whitespace-pre-wrap min-w-0">{{ entry.args.map(formatArg).join(' ') }}</span>
      </div>

      <div
        v-if="logs.length === 0"
        class="text-text-muted py-2 text-center"
      >
        —
      </div>
    </div>
  </div>
</template>
