<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-6 text-cyan-400">Proxy: поток операций</h2>

    <!-- Схема потока данных -->
    <div class="flex items-center justify-center gap-4 mb-6 flex-wrap">
      <div class="bg-gray-800 rounded-lg p-3 text-center min-w-24">
        <div class="text-xs text-gray-400 mb-1">Код</div>
        <div class="text-cyan-300 text-xs font-bold">proxy.prop</div>
      </div>
      <div class="text-gray-500 text-lg">→</div>
      <div class="bg-cyan-900 border border-cyan-500 rounded-lg p-3 text-center min-w-32">
        <div class="text-xs text-cyan-400 mb-1">Proxy handler</div>
        <div class="text-white text-xs font-bold">get trap</div>
      </div>
      <div class="text-gray-500 text-lg">→</div>
      <div class="bg-gray-800 rounded-lg p-3 text-center min-w-24">
        <div class="text-xs text-gray-400 mb-1">target</div>
        <div class="text-green-300 text-xs font-bold">{ prop: val }</div>
      </div>
    </div>

    <!-- Интерактивная демонстрация -->
    <div class="bg-gray-900 rounded-lg p-4 mb-4">
      <div class="text-cyan-400 text-xs font-semibold mb-3">Демо: ловушки в действии</div>
      <div class="grid grid-cols-2 gap-2 mb-3">
        <button v-for="op in operations" :key="op.id"
          @click="runOp(op)"
          class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs text-left transition-colors">
          <span class="text-cyan-300">{{ op.code }}</span>
        </button>
      </div>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <div v-for="(log, i) in logs" :key="i"
          class="flex items-start gap-2 text-xs">
          <span class="text-gray-600 shrink-0">{{ i + 1 }}.</span>
          <span :class="log.type === 'trap' ? 'text-cyan-400' : log.type === 'result' ? 'text-green-400' : 'text-red-400'">
            {{ log.message }}
          </span>
        </div>
        <div v-if="logs.length === 0" class="text-gray-600 text-xs italic">
          Нажми кнопку чтобы увидеть работу ловушек
        </div>
      </div>
    </div>

    <!-- Список ловушек -->
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-cyan-400 text-xs font-semibold mb-2">Доступные ловушки</div>
      <div class="grid grid-cols-2 gap-1">
        <div v-for="trap in traps" :key="trap.name" class="flex items-center gap-2 text-xs">
          <span class="text-yellow-400">{{ trap.name }}</span>
          <span class="text-gray-500">—</span>
          <span class="text-gray-400">{{ trap.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface LogEntry { type: 'trap' | 'result' | 'error'; message: string }

const logs = ref<LogEntry[]>([])

const operations = [
  { id: 'read', code: 'proxy.name', trap: 'get', result: '"Алиса"' },
  { id: 'write', code: 'proxy.age = 30', trap: 'set', result: 'true (успех)' },
  { id: 'check', code: '"name" in proxy', trap: 'has', result: 'true' },
  { id: 'delete', code: 'delete proxy.tmp', trap: 'deleteProperty', result: 'true' }
]

const traps = [
  { name: 'get', desc: 'obj.prop' },
  { name: 'set', desc: 'obj.prop = v' },
  { name: 'has', desc: 'prop in obj' },
  { name: 'deleteProperty', desc: 'delete obj.prop' },
  { name: 'apply', desc: 'fn()' },
  { name: 'construct', desc: 'new Cls()' }
]

function runOp(op: typeof operations[0]) {
  logs.value.push({ type: 'trap', message: `→ ловушка [${op.trap}] перехватила: ${op.code}` })
  logs.value.push({ type: 'result', message: `← результат: ${op.result}` })
}
</script>
