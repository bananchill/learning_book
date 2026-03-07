<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { TestResult } from '@book/shared'

const props = defineProps<{
  results: TestResult[]
  isRunning: boolean
}>()

const { t } = useI18n()

const summary = computed(() => {
  const passed = props.results.filter((r) => r.status === 'pass').length
  const total = props.results.length
  return { passed, total }
})

const allPassed = computed(() =>
  props.results.length > 0 && props.results.every((r) => r.status === 'pass'),
)

const statusIcon: Record<TestResult['status'], string> = {
  pass: '✅',
  fail: '❌',
  error: '⚠️',
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Заголовок -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
      <span class="text-sm font-medium text-text">{{ t('sandbox.tests') }}</span>
      <span v-if="isRunning" class="text-xs text-text-muted animate-pulse">
        {{ t('sandbox.running') }}
      </span>
      <span v-else-if="results.length > 0" class="text-xs" :class="allPassed ? 'text-success' : 'text-danger'">
        {{ t('sandbox.tests_count', summary) }}
      </span>
    </div>

    <!-- Баннер успеха -->
    <div
      v-if="allPassed && !isRunning"
      class="px-4 py-2 bg-success-light text-success text-sm font-medium"
    >
      {{ t('sandbox.all_passed') }}
    </div>

    <!-- Результаты -->
    <div class="divide-y divide-border-muted">
      <div
        v-for="(result, i) in results"
        :key="i"
        class="px-4 py-2.5 flex flex-col gap-1"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ statusIcon[result.status] }}</span>
            <span class="text-sm text-text">{{ result.name }}</span>
          </div>
          <span class="text-xs text-text-muted">{{ result.duration }}ms</span>
        </div>

        <!-- Детали ошибки -->
        <div
          v-if="result.status !== 'pass' && result.message"
          class="ml-7 text-xs text-danger bg-danger-light rounded px-2.5 py-1.5 font-mono"
        >
          {{ result.message }}
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div
      v-if="results.length === 0 && !isRunning"
      class="px-4 py-6 text-center text-sm text-text-muted"
    >
      {{ t('sandbox.no_tests') }}
    </div>
  </div>
</template>
