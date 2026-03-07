<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  language?: string
  readOnly?: boolean
  height?: string
}>(), {
  language: 'javascript',
  readOnly: false,
  height: '300px',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const container = ref<HTMLDivElement>()
const editorInstance = shallowRef<import('monaco-editor').editor.IStandaloneCodeEditor>()
let monaco: typeof import('monaco-editor') | null = null

// Тема, соответствующая дизайн-системе
function defineBookThemes(m: typeof import('monaco-editor')) {
  m.editor.defineTheme('book-light', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#1e293b',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#475569',
      'editor.lineHighlightBackground': '#f1f5f9',
      'editor.selectionBackground': '#818cf833',
      'editorCursor.foreground': '#4f46e5',
    },
  })

  m.editor.defineTheme('book-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e293b',
      'editor.foreground': '#e2e8f0',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94a3b8',
      'editor.lineHighlightBackground': '#334155',
      'editor.selectionBackground': '#818cf833',
      'editorCursor.foreground': '#818cf8',
    },
  })
}

function getTheme(): string {
  return document.documentElement.classList.contains('dark') ? 'book-dark' : 'book-light'
}

// Следим за сменой темы
let themeObserver: MutationObserver | null = null

function watchTheme() {
  themeObserver = new MutationObserver(() => {
    if (editorInstance.value && monaco) {
      monaco.editor.setTheme(getTheme())
    }
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
}

onMounted(async () => {
  // Ленивая загрузка Monaco
  monaco = await import('monaco-editor')

  defineBookThemes(monaco)

  if (!container.value) return

  const editor = monaco.editor.create(container.value, {
    value: props.modelValue,
    language: props.language,
    theme: getTheme(),
    readOnly: props.readOnly,
    minimap: { enabled: false },
    lineNumbers: 'on',
    wordWrap: 'on',
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    renderLineHighlight: 'line',
    padding: { top: 12, bottom: 12 },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
  })

  editorInstance.value = editor

  // Синхронизация: editor → parent
  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()
    if (value !== props.modelValue) {
      emit('update:modelValue', value)
    }
  })

  watchTheme()
})

// Синхронизация: parent → editor
watch(() => props.modelValue, (newVal) => {
  if (editorInstance.value && editorInstance.value.getValue() !== newVal) {
    editorInstance.value.setValue(newVal)
  }
})

watch(() => props.language, (lang) => {
  if (editorInstance.value && monaco) {
    const model = editorInstance.value.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, lang)
    }
  }
})

watch(() => props.readOnly, (val) => {
  editorInstance.value?.updateOptions({ readOnly: val })
})

onUnmounted(() => {
  themeObserver?.disconnect()
  editorInstance.value?.dispose()
})
</script>

<template>
  <div
    ref="container"
    class="w-full rounded-lg overflow-hidden border border-border"
    :style="{ height }"
  />
</template>
