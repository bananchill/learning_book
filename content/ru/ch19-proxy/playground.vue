<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-cyan-400">Песочница: Proxy и Reflect</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="ex in examples" :key="ex.id" @click="select(ex)"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-cyan-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-cyan-400 text-xs font-semibold mb-2">Принцип:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'validation',
    label: 'Валидация',
    code: `const user = new Proxy({}, {
  set(target, prop, value, receiver) {
    if (prop === 'age') {
      if (typeof value !== 'number' || value < 0 || value > 150) {
        throw new TypeError(\`Невалидный возраст: \${value}\`)
      }
    }
    return Reflect.set(target, prop, value, receiver)
  }
})

user.age = 25   // OK
user.age = -5   // TypeError: Невалидный возраст: -5
user.name = 'Алиса' // OK — нет валидации для name`,
    explanation: 'Ловушка set перехватывает запись. Reflect.set выполняет стандартную запись и возвращает true/false. Всегда возвращай результат Reflect.set — это корректнее чем target[prop] = value + return true.'
  },
  {
    id: 'defaults',
    label: 'Значения по умолчанию',
    code: `// Счётчики с нулём по умолчанию
const stats = new Proxy({}, {
  get(target, prop, receiver) {
    // Если свойства нет — возвращаем 0
    if (!(prop in target)) return 0
    return Reflect.get(target, prop, receiver)
  }
})

stats.pageViews    // 0 (свойства нет)
stats.pageViews++  // 0 + 1 = 1 (записалось в target)
stats.clicks++     // 0 + 1 = 1
stats.pageViews    // 1`,
    explanation: 'Ловушка get может возвращать fallback-значения для несуществующих свойств. Это удобнее чем проверки || 0 в каждом месте использования.'
  },
  {
    id: 'reflect',
    label: 'Reflect API',
    code: `// БЕЗ Reflect — можно сломать прототипы
const badProxy = new Proxy(obj, {
  get(target, prop) {
    return target[prop] // this в геттерах = target!
  }
})

// С Reflect — корректное делегирование
const goodProxy = new Proxy(obj, {
  get(target, prop, receiver) {
    return Reflect.get(target, prop, receiver)
    // receiver передаётся в геттеры прототипной цепочки
  }
})

// Все методы Reflect:
Reflect.get(target, prop, receiver)
Reflect.set(target, prop, value, receiver) // → boolean
Reflect.has(target, prop)                  // как 'in'
Reflect.deleteProperty(target, prop)       // как delete`,
    explanation: 'Reflect предоставляет методы для всех операций с объектами. В ловушках Proxy всегда используй Reflect для делегирования — это корректно передаёт receiver в цепочку прототипов.'
  }
]

const activeId = ref('validation')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
