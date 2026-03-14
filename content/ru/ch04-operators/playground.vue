<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: деструктуризация</h3>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h4 class="text-sm font-medium mb-2">Объект:</h4>
        <textarea v-model="objInput" rows="5"
          class="w-full border rounded px-3 py-2 text-sm font-mono"
          placeholder='{ "name": "Иван", "age": 25 }'></textarea>
      </div>
      <div>
        <h4 class="text-sm font-medium mb-2">Результат деструктуризации:</h4>
        <div class="bg-gray-900 rounded p-3 text-green-400 text-sm font-mono h-32 overflow-auto">
          <pre>{{ destructuredResult }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const objInput = ref('{ "name": "Иван", "age": 25, "role": "admin" }')

const destructuredResult = computed(() => {
  try {
    const obj = JSON.parse(objInput.value)
    const { name = 'Аноним', age = 0, role = 'user', ...rest } = obj
    return JSON.stringify({ name, age, role, rest }, null, 2)
  } catch {
    return 'Ошибка парсинга JSON'
  }
})
</script>
