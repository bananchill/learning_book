<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  code: string
  activeLine?: number
  highlightLines?: number[]
}>()

const lines = computed(() => (props.code ?? '').split('\n'))

const gutterWidth = computed(() => `${String(lines.value.length).length + 1}ch`)

function lineClass(lineNum: number) {
  if (lineNum === props.activeLine) {
    return 'bg-primary border-l-2 border-primary'
  }
  if (props.highlightLines?.includes(lineNum)) {
    return 'bg-surface-muted/10 border-l-2 border-text-muted/20'
  }
  return 'border-l-2 border-transparent'
}

function gutterClass(lineNum: number) {
  if (lineNum === props.activeLine) {
    return 'text-text'
  }
  return 'text-text-muted/40'
}
</script>

<template>
  <div class="rounded-lg bg-[#1e1e2e] overflow-x-auto font-mono text-sm leading-6">
    <div class="min-w-fit">
      <div
        v-for="(line, i) in lines"
        :key="i"
        class="flex transition-colors duration-fast"
        :class="lineClass(i + 1)"
      >
        <span
          class="select-none text-right shrink-0 px-4 transition-colors"
          :class="gutterClass(i + 1)"
          :style="{ width: `calc(${gutterWidth} + 2rem)` }"
        >{{ i + 1 }}</span>
        <pre class="text-text whitespace-pre pr-4">{{ line }}</pre>
      </div>
    </div>
  </div>
</template>
