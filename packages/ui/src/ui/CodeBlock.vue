<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHighlight } from '../lib/useHighlight'
import { useCopyCode } from '../lib/useCopyCode'

const props = defineProps<{
  code: string
  language?: string
  highlightLines?: number[]
  showLineNumbers?: boolean
}>()

const { t } = useI18n()
const { html, loading } = useHighlight(
  toRef(() => props.code),
  toRef(() => props.language ?? 'javascript'),
)
const { copied, copyCode } = useCopyCode()

const highlightedLines = computed(() => new Set(props.highlightLines ?? []))
</script>

<template>
  <div class="group relative my-4 overflow-hidden rounded-lg border border-[var(--code-border)] bg-[var(--code-bg)]">
    <div class="flex items-center justify-between border-b border-[var(--code-border)] px-4 py-2">
      <span class="font-mono text-xs uppercase text-text-muted">
        {{ language ?? 'js' }}
      </span>
      <button
        class="rounded px-2 py-1 text-xs text-text-muted transition-colors duration-fast hover:bg-surface-muted hover:text-text-secondary"
        @click="copyCode(code)"
      >
        {{ copied ? t('common.copied') : t('common.copy') }}
      </button>
    </div>
    <div v-if="loading" class="animate-pulse-soft p-4 text-sm text-text-muted">
      {{ t('common.loading') }}
    </div>
    <div
      v-else
      class="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
      v-html="html"
    />
  </div>
</template>
