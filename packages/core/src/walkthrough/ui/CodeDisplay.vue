<script setup lang="ts">
const props = defineProps<{
  code: string
  activeLine?: number
  highlightLines?: number[]
}>()

const lines = props.code.split('\n')

function lineClass(lineNum: number) {
  if (lineNum === props.activeLine) {
    return 'bg-primary-light border-l-2 border-primary'
  }
  if (props.highlightLines?.includes(lineNum)) {
    return 'bg-surface-muted border-l-2 border-border'
  }
  return 'border-l-2 border-transparent'
}
</script>

<template>
  <div class="font-mono text-sm overflow-x-auto">
    <div
      v-for="(line, i) in lines"
      :key="i"
      class="flex transition-colors duration-fast px-3 py-0.5"
      :class="lineClass(i + 1)"
    >
      <span class="text-text-muted w-8 text-right mr-4 select-none flex-shrink-0">{{ i + 1 }}</span>
      <pre class="text-text whitespace-pre">{{ line }}</pre>
    </div>
  </div>
</template>
