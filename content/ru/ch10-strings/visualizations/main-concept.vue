<template>
  <div class="p-6 bg-gray-50 rounded-xl space-y-6">
    <h3 class="text-lg font-semibold text-gray-800">Интерактивный тестер регулярных выражений</h3>

    <!-- Ввод паттерна и флагов -->
    <div class="space-y-3">
      <div class="flex gap-3">
        <div class="flex-1">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Регулярное выражение
          </label>
          <div class="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
            <span class="px-3 py-2 text-gray-400 text-lg font-mono">/</span>
            <input
              v-model="pattern"
              class="flex-1 py-2 text-sm font-mono outline-none"
              placeholder="\\d+"
              spellcheck="false"
            />
            <span class="px-3 py-2 text-gray-400 text-lg font-mono">/</span>
            <input
              v-model="flags"
              class="w-16 py-2 px-2 text-sm font-mono outline-none border-l border-gray-200"
              placeholder="g"
              spellcheck="false"
            />
          </div>
        </div>
      </div>

      <!-- Тестовая строка -->
      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Тестовая строка
        </label>
        <textarea
          v-model="testString"
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono resize-none outline-none focus:border-blue-400"
          rows="3"
          placeholder="Введите текст для проверки..."
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Статус regex -->
    <div
      class="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
      :class="regexError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'"
    >
      <span class="font-mono text-xs">{{ regexError || `/${pattern}/${flags}` }}</span>
      <span class="ml-auto font-semibold">{{ regexError ? 'Ошибка' : `${matchCount} совпадений` }}</span>
    </div>

    <!-- Строка с подсветкой -->
    <div v-if="!regexError && testString" class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Результат</div>
      <div class="text-sm font-mono leading-relaxed whitespace-pre-wrap break-all" v-html="highlightedText" />
    </div>

    <!-- Список совпадений -->
    <div v-if="!regexError && matches.length > 0" class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        Совпадения ({{ matches.length }})
      </div>
      <div class="space-y-1 max-h-40 overflow-y-auto">
        <div
          v-for="(m, i) in matches"
          :key="i"
          class="flex items-center gap-3 text-sm"
        >
          <span class="text-gray-400 text-xs w-6 text-right">{{ i + 1 }}</span>
          <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-mono">{{ m.value }}</span>
          <span class="text-gray-400 text-xs">индекс {{ m.index }}</span>
          <span v-if="m.groups.length" class="text-xs text-blue-600">
            группы: {{ m.groups.map(g => `"${g}"`).join(', ') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Быстрые примеры -->
    <div class="space-y-2">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Примеры</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="ex in examples"
          :key="ex.label"
          @click="applyExample(ex)"
          class="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-mono"
        >
          /{{ ex.pattern }}/{{ ex.flags }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const pattern = ref('\\d+')
const flags = ref('g')
const testString = ref('Версия: 1.2.3, Дата: 2024-01-15, Порт: 3000')

const examples = [
  { label: 'числа', pattern: '\\d+', flags: 'g', text: 'Версия: 1.2.3, Дата: 2024-01-15, Порт: 3000' },
  { label: 'email', pattern: '[\\w.-]+@[\\w.-]+\\.\\w+', flags: 'g', text: 'Контакты: admin@example.com, user@test.ru' },
  { label: 'слова', pattern: '\\b\\w{4,}\\b', flags: 'g', text: 'The quick brown fox jumps over the lazy dog' },
  { label: 'дата', pattern: '(\\d{4})-(\\d{2})-(\\d{2})', flags: 'g', text: 'Сегодня 2024-01-15, завтра 2024-01-16' },
]

const regexError = computed(() => {
  if (!pattern.value) return null
  try {
    new RegExp(pattern.value, flags.value)
    return null
  } catch (e) {
    return e.message
  }
})

const matches = computed(() => {
  if (regexError.value || !pattern.value || !testString.value) return []
  try {
    const regex = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    const result = []
    let m
    // Сбрасываем lastIndex
    regex.lastIndex = 0
    while ((m = regex.exec(testString.value)) !== null) {
      result.push({
        value: m[0],
        index: m.index,
        groups: m.slice(1).filter(g => g !== undefined)
      })
      // Защита от бесконечного цикла при нулевой длине совпадения
      if (m[0].length === 0) {
        regex.lastIndex++
      }
      if (result.length > 100) break // ограничение
    }
    return result
  } catch {
    return []
  }
})

const matchCount = computed(() => matches.value.length)

const highlightedText = computed(() => {
  if (regexError.value || !pattern.value || !testString.value) {
    return escapeHtml(testString.value)
  }
  try {
    const regex = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    return testString.value.replace(regex, match =>
      `<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">${escapeHtml(match)}</mark>`
    )
  } catch {
    return escapeHtml(testString.value)
  }
})

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function applyExample(ex) {
  pattern.value = ex.pattern
  flags.value = ex.flags
  if (ex.text) testString.value = ex.text
}
</script>
