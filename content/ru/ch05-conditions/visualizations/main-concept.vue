<template>
  <div class="p-6 bg-gray-50 rounded-xl">
    <h2 class="text-xl font-bold text-gray-800 mb-2">Flow Control Visualizer</h2>
    <p class="text-sm text-gray-600 mb-4">Введите значение и посмотрите, как выполняется условная логика</p>

    <!-- Ввод -->
    <div class="flex gap-3 mb-6 items-end">
      <div>
        <label class="block text-xs text-gray-500 mb-1">Счёт (0-100)</label>
        <input
          v-model.number="score"
          type="range" min="0" max="100"
          class="w-48 accent-blue-600"
        />
        <span class="ml-2 text-sm font-mono font-bold text-blue-700">{{ score }}</span>
      </div>
      <div class="flex gap-2">
        <button
          v-for="mode in modes"
          :key="mode"
          @click="selectedMode = mode"
          class="px-3 py-1.5 rounded text-xs font-medium transition-colors"
          :class="selectedMode === mode ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'"
        >
          {{ mode }}
        </button>
      </div>
    </div>

    <!-- Граф условий -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Дерево решений -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Граф выполнения</h3>
        <div class="space-y-2 text-sm font-mono">
          <div
            v-for="node in flowNodes"
            :key="node.id"
            class="flex items-center gap-2 py-1 px-2 rounded transition-all"
            :class="[
              node.active ? 'bg-blue-50 border-l-4 border-blue-500' : 'opacity-40',
              node.isResult ? 'font-bold' : ''
            ]"
            :style="`margin-left: ${node.depth * 16}px`"
          >
            <span v-if="node.type === 'condition'" class="text-yellow-600">◆</span>
            <span v-else-if="node.isResult" :class="node.resultColor">●</span>
            <span v-else class="text-gray-400">→</span>
            <span :class="node.isResult ? node.resultColor : 'text-gray-700'">{{ node.text }}</span>
          </div>
        </div>
      </div>

      <!-- Результат -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-3">Результат</h3>
        <div class="text-center py-4">
          <div class="text-5xl font-bold mb-2" :class="gradeColor">{{ grade }}</div>
          <div class="text-sm text-gray-500">Оценка для счёта {{ score }}</div>
        </div>
        <div class="mt-4 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600">
          {{ codeSnippet }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const score = ref(75)
const selectedMode = ref('if/else')
const modes = ['if/else', 'switch', 'lookup']

// Вычисление оценки
const grade = computed(() => {
  if (score.value >= 90) return 'A'
  if (score.value >= 80) return 'B'
  if (score.value >= 70) return 'C'
  if (score.value >= 60) return 'D'
  return 'F'
})

const gradeColor = computed(() => ({
  'A': 'text-green-600',
  'B': 'text-blue-600',
  'C': 'text-yellow-600',
  'D': 'text-orange-600',
  'F': 'text-red-600',
}[grade.value]))

// Узлы графа выполнения
const flowNodes = computed(() => {
  const s = score.value
  return [
    { id: 1, type: 'condition', text: `score >= 90? (${s} >= 90 = ${s >= 90})`, active: true, depth: 0 },
    s >= 90
      ? { id: 2, type: 'result', text: "→ 'A'", active: true, isResult: true, resultColor: 'text-green-600', depth: 1 }
      : { id: 2, type: 'condition', text: `score >= 80? (${s} >= 80 = ${s >= 80})`, active: true, depth: 1 },
    ...(!( s >= 90) ? [
      s >= 80
        ? { id: 3, type: 'result', text: "→ 'B'", active: true, isResult: true, resultColor: 'text-blue-600', depth: 2 }
        : { id: 3, type: 'condition', text: `score >= 70? (${s} >= 70 = ${s >= 70})`, active: true, depth: 2 }
    ] : []),
    ...(!(s >= 90 || s >= 80) ? [
      s >= 70
        ? { id: 4, type: 'result', text: "→ 'C'", active: true, isResult: true, resultColor: 'text-yellow-600', depth: 3 }
        : { id: 4, type: 'condition', text: `score >= 60? (${s} >= 60 = ${s >= 60})`, active: true, depth: 3 }
    ] : []),
    ...(!(s >= 90 || s >= 80 || s >= 70) ? [
      s >= 60
        ? { id: 5, type: 'result', text: "→ 'D'", active: true, isResult: true, resultColor: 'text-orange-600', depth: 4 }
        : { id: 5, type: 'result', text: "→ 'F'", active: true, isResult: true, resultColor: 'text-red-600', depth: 4 }
    ] : []),
  ].filter(Boolean)
})

const codeSnippet = computed(() => {
  const s = score.value
  if (selectedMode.value === 'if/else') {
    return `if (score >= 90) return 'A';\nif (score >= 80) return 'B';\nif (score >= 70) return 'C';\nif (score >= 60) return 'D';\nreturn 'F'; // score = ${s}`
  }
  if (selectedMode.value === 'lookup') {
    return `const grades = [{min:90,g:'A'},{min:80,g:'B'},\n  {min:70,g:'C'},{min:60,g:'D'}];\nconst found = grades.find(t => ${s} >= t.min);\nreturn found?.g ?? 'F'; // = '${grade.value}'`
  }
  return `// switch не подходит для диапазонов\n// используйте switch(true):\nswitch(true) {\n  case score >= 90: return 'A';\n  // ...score = ${s} → '${grade.value}'\n}`
})
</script>
