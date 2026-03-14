<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-red-400">Песочница: Обработка ошибок</h2>
    <div class="flex gap-2 mb-4 flex-wrap">
      <button v-for="ex in examples" :key="ex.id" @click="select(ex)"
        :class="['px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']">
        {{ ex.label }}
      </button>
    </div>
    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-red-400 text-xs font-semibold mb-2">Ключевой момент:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'custom-error',
    label: 'Кастомный Error',
    code: `class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError(
      'Неверный формат email',
      'email'
    )
  }
  return email
}

try {
  validateEmail('не-email')
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.field)    // 'email'
    console.log(error.message)  // 'Неверный формат email'
    // Подсветить поле в форме
  } else {
    throw error  // непредвиденная ошибка — пробрасываем
  }
}`,
    explanation: 'Кастомный класс ошибки позволяет добавить поле field. В catch можно проверить instanceof ValidationError и обработать специфически — например, показать ошибку рядом с нужным полем формы. Все другие ошибки пробрасываются.'
  },
  {
    id: 'result-type',
    label: 'Result паттерн',
    code: `// Явные ошибки через Result-тип
function parseJSON(str) {
  try {
    return { ok: true, value: JSON.parse(str) }
  } catch (e) {
    return { ok: false, error: e }
  }
}

// Вызывающий код ВЫНУЖДЕН проверить результат
const r1 = parseJSON('{"name":"Алиса"}')
if (r1.ok) console.log(r1.value.name) // "Алиса"

const r2 = parseJSON('плохой json')
if (!r2.ok) console.log(r2.error.message)

// Чейнинг через map
const result = parseJSON('{"x":5}')
if (result.ok) {
  const doubled = { ok: true, value: result.value.x * 2 }
  console.log(doubled.value) // 10
}`,
    explanation: 'Result тип делает ошибки явными: функция возвращает { ok, value/error } вместо бросания исключения. Вызывающий код ДОЛЖЕН проверить ok — нельзя случайно пропустить ошибку. Хорошо для ожидаемых сбоев (парсинг, валидация).'
  },
  {
    id: 'async-errors',
    label: 'Async ошибки',
    code: `// fetch не бросает при 4xx/5xx — важно!
async function getUser(id) {
  const response = await fetch(\`/api/users/\${id}\`)

  // Нужно проверить вручную
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
  }

  return response.json()
}

// Обработка через try/catch
async function loadProfile(id) {
  try {
    const user = await getUser(id)
    return user
  } catch (error) {
    if (error.message.startsWith('HTTP 404')) {
      return null  // не найден
    }
    throw error    // другие ошибки пробрасываем
  }
}`,
    explanation: 'fetch выбрасывает ошибку только при сетевом сбое (нет соединения). При 404, 500 и т.д. — возвращает Response с ok=false. Всегда проверяй response.ok после fetch. async/await позволяет использовать try/catch как с синхронным кодом.'
  }
]

const activeId = ref('custom-error')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
