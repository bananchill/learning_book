<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm select-none">
    <h2 class="text-lg font-bold mb-4 text-orange-400">Четыре правила привязки this</h2>

    <!-- Выбор сценария -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="rule in rules"
        :key="rule.id"
        @click="activeRule = rule.id"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeRule === rule.id
            ? 'bg-orange-400 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ rule.label }}
      </button>
    </div>

    <!-- Текущее правило -->
    <div v-if="current" class="space-y-4">
      <!-- Приоритет -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Приоритет:</span>
        <div class="flex gap-1">
          <div
            v-for="n in 4"
            :key="n"
            :class="[
              'w-3 h-3 rounded-sm',
              n <= current.priority ? 'bg-orange-400' : 'bg-gray-700'
            ]"
          ></div>
        </div>
        <span class="text-xs text-orange-300">{{ current.priorityLabel }}</span>
      </div>

      <!-- Код -->
      <div class="bg-gray-900 rounded-lg p-4">
        <div class="text-xs text-gray-500 mb-2">Пример:</div>
        <pre class="text-xs leading-relaxed text-green-300">{{ current.code }}</pre>
      </div>

      <!-- Результат -->
      <div class="bg-gray-900 rounded-lg p-3 flex items-center gap-3">
        <span class="text-orange-400 text-xs font-semibold">this =</span>
        <span class="text-white font-bold">{{ current.result }}</span>
      </div>

      <!-- Объяснение -->
      <div class="bg-orange-900/20 border border-orange-800 rounded-lg p-3">
        <p class="text-orange-200 text-xs leading-relaxed">{{ current.explanation }}</p>
      </div>
    </div>

    <!-- Сводная таблица -->
    <div class="mt-6 border border-gray-700 rounded-lg overflow-hidden">
      <div class="bg-gray-900 px-4 py-2 text-xs text-gray-400 font-semibold">Все правила</div>
      <div
        v-for="rule in rules"
        :key="rule.id"
        :class="[
          'flex items-center gap-4 px-4 py-2 text-xs border-t border-gray-800 cursor-pointer transition-colors',
          activeRule === rule.id ? 'bg-orange-900/20' : 'hover:bg-gray-900'
        ]"
        @click="activeRule = rule.id"
      >
        <div class="flex gap-1 flex-shrink-0">
          <div v-for="n in 4" :key="n" :class="['w-2 h-2 rounded-sm', n <= rule.priority ? 'bg-orange-400' : 'bg-gray-700']"></div>
        </div>
        <span class="text-gray-300 w-32 flex-shrink-0">{{ rule.label }}</span>
        <span class="text-gray-500">{{ rule.pattern }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Rule {
  id: string
  label: string
  priority: number
  priorityLabel: string
  pattern: string
  code: string
  result: string
  explanation: string
}

const rules: Rule[] = [
  {
    id: 'new',
    label: 'new',
    priority: 4,
    priorityLabel: 'Наивысший',
    pattern: 'new Fn()',
    code: `function Person(name) {
  this.name = name
}
const alice = new Person('Алиса')
// this внутри Person → новый объект`,
    result: 'новый объект {}',
    explanation: 'При вызове с new: 1) создаётся новый пустой объект, 2) его [[Prototype]] устанавливается на Fn.prototype, 3) this = этот объект, 4) если функция не возвращает объект явно — возвращается this.'
  },
  {
    id: 'explicit',
    label: 'call / apply / bind',
    priority: 3,
    priorityLabel: 'Высокий',
    pattern: 'fn.call(obj)',
    code: `function greet() {
  return 'Привет, ' + this.name
}
greet.call({ name: 'Алиса' })
// this → { name: 'Алиса' }`,
    result: '{ name: "Алиса" }',
    explanation: 'call, apply, bind явно задают this. Это правило с высшим приоритетом среди трёх (кроме new). bind создаёт жёсткую привязку — нельзя переопределить даже через call.'
  },
  {
    id: 'implicit',
    label: 'obj.method()',
    priority: 2,
    priorityLabel: 'Средний',
    pattern: 'obj.fn()',
    code: `const user = {
  name: 'Боб',
  greet() { return this.name }
}
user.greet()
// this → user`,
    result: 'user (объект перед точкой)',
    explanation: 'Когда функция вызывается как метод объекта, this === объект перед точкой. Важно: только непосредственный объект, не вся цепочка. Если метод оторвать от объекта — this потеряется.'
  },
  {
    id: 'default',
    label: 'fn() — по умолчанию',
    priority: 1,
    priorityLabel: 'Низший',
    pattern: 'fn()',
    code: `'use strict'
function showThis() {
  return this
}
showThis()
// this → undefined (strict)
// this → window (non-strict)`,
    result: 'undefined (strict) / window',
    explanation: 'Если ни одно из предыдущих правил не применимо — привязка по умолчанию. В строгом режиме this === undefined, без строгого — глобальный объект. Самый частый источник ошибок при потере контекста.'
  }
]

const activeRule = ref('new')
const current = computed(() => rules.find(r => r.id === activeRule.value))
</script>
