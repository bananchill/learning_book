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

// Расширение редактора
const isExpanded = ref(false)
const editorHeight = ref(0)
const MIN_HEIGHT = 150
const MAX_HEIGHT = 800

onMounted(() => {
  editorHeight.value = parseInt(props.height) || 300
})

const currentHeight = computed(() =>
  isExpanded.value ? `${MAX_HEIGHT}px` : `${editorHeight.value}px`
)

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

// Ресайз перетаскиванием
let startY = 0
let startHeight = 0

function onResizeStart(e: PointerEvent) {
  if (isExpanded.value) return
  startY = e.clientY
  startHeight = editorHeight.value
  document.addEventListener('pointermove', onResizeMove)
  document.addEventListener('pointerup', onResizeEnd)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'row-resize'
}

function onResizeMove(e: PointerEvent) {
  const delta = e.clientY - startY
  editorHeight.value = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startHeight + delta))
}

function onResizeEnd() {
  document.removeEventListener('pointermove', onResizeMove)
  document.removeEventListener('pointerup', onResizeEnd)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

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

        <div class="w-px h-4 bg-border mx-1" />

        <!-- Развернуть / Свернуть -->
        <BaseButton
          size="sm"
          variant="ghost"
          :title="isExpanded ? t('sandbox.collapse') : t('sandbox.expand')"
          @click="toggleExpand"
        >
          <svg
            class="w-4 h-4 transition-transform"
            :class="{ 'rotate-180': isExpanded }"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M3 10L8 5L13 10" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 14L8 9L13 14" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </BaseButton>
      </div>
    </div>

    <!-- Редактор -->
    <MonacoEditor
      :model-value="code"
      :language="language"
      :read-only="readOnly"
      :height="currentHeight"
      @update:model-value="onCodeChange"
    />

    <!-- Ручка ресайза -->
    <div
      v-if="!isExpanded"
      class="h-1.5 cursor-row-resize bg-surface hover:bg-primary/20 transition-colors flex items-center justify-center group"
      :title="t('sandbox.resize')"
      @pointerdown="onResizeStart"
    >
      <div class="w-8 h-0.5 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
    </div>

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
