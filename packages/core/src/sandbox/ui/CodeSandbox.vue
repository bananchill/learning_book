<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import type { TestResult } from '@book/shared'
import { useTestRunner } from '../model/useTestRunner'
import MonacoEditor from './MonacoEditor.vue'
import TestResults from './TestResults.vue'
import ConsoleOutput from './ConsoleOutput.vue'

const props = withDefaults(defineProps<{
  starterCode?: string
  testCode?: string
  language?: 'javascript' | 'typescript' | 'sql' | 'yaml'
  autoRun?: boolean
  debounceMs?: number
  readOnly?: boolean
  height?: string
  showConsole?: boolean
  persistenceKey?: string
}>(), {
  starterCode: '',
  testCode: '',
  language: 'javascript',
  autoRun: true,
  debounceMs: 800,
  readOnly: false,
  height: '300px',
  showConsole: true,
})

const emit = defineEmits<{
  'code-change': [code: string]
  'test-results': [results: TestResult[]]
}>()

const { t } = useI18n()

const {
  code,
  isRunning,
  error,
  testResults,
  consoleLogs,
  canUndo,
  canRedo,
  run,
  reset,
  updateCode,
  undo,
  redo,
  format,
} = useTestRunner(
  () => props.starterCode,
  () => props.testCode,
  {
    autoRun: props.autoRun,
    debounceMs: props.debounceMs,
    persistenceKey: props.persistenceKey,
  },
)

// Нижняя панель: тесты или консоль
const activeTab = ref<'tests' | 'console'>('tests')
const hasTests = computed(() => props.testCode.trim().length > 0)

function onCodeChange(value: string) {
  updateCode(value)
  emit('code-change', value)
}

function onRun() {
  run()
}

function onReset() {
  reset()
  emit('code-change', code.value)
}

function onUndo() {
  undo()
  emit('code-change', code.value)
}

function onRedo() {
  redo()
  emit('code-change', code.value)
}

function onFormat() {
  format()
  emit('code-change', code.value)
}

function clearConsole() {
  consoleLogs.value = []
}

// Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z
function handleKeydown(e: KeyboardEvent) {
  if (!e.ctrlKey && !e.metaKey) return

  if (e.key === 'z' && !e.shiftKey) {
    e.preventDefault()
    onUndo()
  } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
    e.preventDefault()
    onRedo()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Передаём результаты тестов наверх при изменении
watch(testResults, (results) => {
  if (results.length > 0) {
    emit('test-results', results)
  }
})
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-elevated shadow-sm overflow-hidden">

    <!-- Тулбар -->
    <div class="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-text-muted px-2 py-0.5 bg-surface-muted rounded">
          {{ language }}
        </span>
        <span v-if="hasTests" class="text-xs text-text-muted">
          {{ t('sandbox.title') }}
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <!-- Undo / Redo -->
        <BaseButton
          size="sm"
          variant="ghost"
          :disabled="!canUndo"
          :title="t('sandbox.undo')"
          @click="onUndo"
        >
          ↩
        </BaseButton>
        <BaseButton
          size="sm"
          variant="ghost"
          :disabled="!canRedo"
          :title="t('sandbox.redo')"
          @click="onRedo"
        >
          ↪
        </BaseButton>

        <div class="w-px h-4 bg-border mx-1" />

        <!-- Форматировать -->
        <BaseButton size="sm" variant="ghost" :title="t('sandbox.format')" @click="onFormat">
          {{ t('sandbox.format') }}
        </BaseButton>

        <!-- Сбросить -->
        <BaseButton size="sm" variant="ghost" @click="onReset">
          {{ t('sandbox.reset') }}
        </BaseButton>

        <!-- Запустить -->
        <BaseButton size="sm" variant="primary" :disabled="isRunning" @click="onRun">
          {{ isRunning ? t('sandbox.running') : t('sandbox.run') }}
        </BaseButton>
      </div>
    </div>

    <!-- Редактор -->
    <MonacoEditor
      :model-value="code"
      :language="language"
      :read-only="readOnly"
      :height="height"
      @update:model-value="onCodeChange"
    />

    <!-- Ошибка -->
    <div
      v-if="error"
      class="px-4 py-2.5 bg-danger-light text-danger text-sm font-mono border-t border-border"
    >
      {{ error }}
    </div>

    <!-- Нижняя панель -->
    <div v-if="hasTests || showConsole" class="border-t border-border">

      <!-- Табы -->
      <div v-if="hasTests && showConsole" class="flex border-b border-border">
        <button
          class="px-4 py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'tests'
            ? 'text-primary border-b-2 border-primary -mb-px'
            : 'text-text-muted hover:text-text'"
          @click="activeTab = 'tests'"
        >
          {{ t('sandbox.tests') }}
          <span
            v-if="testResults.length > 0"
            class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full"
            :class="testResults.every(r => r.status === 'pass')
              ? 'bg-success-light text-success'
              : 'bg-danger-light text-danger'"
          >
            {{ testResults.filter(r => r.status === 'pass').length }}/{{ testResults.length }}
          </span>
        </button>
        <button
          class="px-4 py-2 text-xs font-medium transition-colors"
          :class="activeTab === 'console'
            ? 'text-primary border-b-2 border-primary -mb-px'
            : 'text-text-muted hover:text-text'"
          @click="activeTab = 'console'"
        >
          {{ t('sandbox.console') }}
          <span
            v-if="consoleLogs.length > 0"
            class="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-muted text-text-muted"
          >
            {{ consoleLogs.length }}
          </span>
        </button>
      </div>

      <!-- Контент -->
      <TestResults
        v-if="hasTests && activeTab === 'tests'"
        :results="testResults"
        :is-running="isRunning"
      />
      <ConsoleOutput
        v-if="showConsole && (activeTab === 'console' || !hasTests)"
        :logs="consoleLogs"
        @clear="clearConsole"
      />
    </div>
  </div>
</template>
