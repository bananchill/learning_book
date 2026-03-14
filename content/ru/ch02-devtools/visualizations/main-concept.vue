<template>
  <div class="p-6 bg-gray-50 rounded-xl min-h-[400px]">
    <h2 class="text-xl font-bold text-gray-800 mb-4">DevTools: Console методы</h2>

    <!-- Панель управления -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="method in methods"
        :key="method.name"
        @click="executeMethod(method)"
        class="px-3 py-1.5 rounded-lg text-sm font-mono font-medium transition-colors"
        :class="[
          activeMethod === method.name
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        ]"
      >
        console.{{ method.name }}()
      </button>
    </div>

    <!-- Область кода -->
    <div class="bg-gray-900 rounded-lg p-4 mb-4">
      <pre class="text-green-400 text-sm font-mono leading-relaxed">{{ currentCode }}</pre>
    </div>

    <!-- Вывод в консоль -->
    <div class="bg-black rounded-lg p-4 min-h-[150px]">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div class="w-3 h-3 rounded-full bg-green-500"></div>
        <span class="text-gray-400 text-xs ml-2">Console</span>
      </div>
      <div v-if="output.length === 0" class="text-gray-500 text-sm font-mono">
        // Нажмите на метод выше чтобы увидеть результат
      </div>
      <div
        v-for="(line, idx) in output"
        :key="idx"
        class="font-mono text-sm mb-1"
        :class="line.type === 'warn' ? 'text-yellow-400' : line.type === 'error' ? 'text-red-400' : 'text-gray-200'"
      >
        <span class="text-gray-500 mr-2">{{ idx + 1 }}</span>{{ line.text }}
      </div>
    </div>

    <!-- Объяснение -->
    <div v-if="activeDescription" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-blue-800 text-sm">{{ activeDescription }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Методы console для демонстрации
const methods = [
  {
    name: 'log',
    code: `const user = { name: 'Иван', age: 25 };\nconsole.log('Пользователь:', user);`,
    output: [{ type: 'log', text: 'Пользователь: { name: "Иван", age: 25 }' }],
    description: 'console.log() — базовый метод вывода. Принимает несколько аргументов.'
  },
  {
    name: 'warn',
    code: `const age = -1;\nif (age < 0) {\n  console.warn('Возраст не может быть отрицательным!');\n}`,
    output: [{ type: 'warn', text: '⚠ Возраст не может быть отрицательным!' }],
    description: 'console.warn() — предупреждение. Выводится жёлтым цветом в DevTools.'
  },
  {
    name: 'error',
    code: `try {\n  JSON.parse('invalid json');\n} catch (e) {\n  console.error('Ошибка парсинга:', e.message);\n}`,
    output: [{ type: 'error', text: '✖ Ошибка парсинга: Unexpected token i in JSON' }],
    description: 'console.error() — ошибка. Выводится красным. Автоматически добавляет стек вызовов.'
  },
  {
    name: 'table',
    code: `const users = [\n  { name: 'Иван', age: 25 },\n  { name: 'Мария', age: 30 }\n];\nconsole.table(users);`,
    output: [
      { type: 'log', text: '┌─────────┬──────────┬─────┐' },
      { type: 'log', text: '│ (index) │   name   │ age │' },
      { type: 'log', text: '├─────────┼──────────┼─────┤' },
      { type: 'log', text: '│    0    │  "Иван"  │ 25  │' },
      { type: 'log', text: '│    1    │ "Мария"  │ 30  │' },
      { type: 'log', text: '└─────────┴──────────┴─────┘' }
    ],
    description: 'console.table() — отображает массив объектов в виде таблицы. Удобно для просмотра данных.'
  },
  {
    name: 'time',
    code: `console.time('сортировка');\nconst arr = Array.from({length: 1000}, () => Math.random());\narr.sort();\nconsole.timeEnd('сортировка');`,
    output: [{ type: 'log', text: 'сортировка: 0.842ms' }],
    description: 'console.time() / console.timeEnd() — измеряет время выполнения блока кода.'
  }
]

const activeMethod = ref(null)
const currentCode = ref('// Выберите метод console выше\n// чтобы увидеть пример')
const output = ref([])
const activeDescription = ref('')

// Выполняет выбранный метод
function executeMethod(method) {
  activeMethod.value = method.name
  currentCode.value = method.code
  output.value = method.output
  activeDescription.value = method.description
}
</script>
