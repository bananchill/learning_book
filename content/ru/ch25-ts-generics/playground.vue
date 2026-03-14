<script setup lang="ts">
// Песочница для дженериков TypeScript
// Попробуйте изменить код и наблюдайте за типами
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Откройте редактор кода и поэкспериментируйте с дженериками.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Попробуйте: изменить тип аргумента
function identity&lt;T&gt;(value: T): T {
  return value
}

const num = identity(42)        // T = number
const str = identity('hello')   // T = string
const arr = identity([1, 2, 3]) // T = number[]</pre>
  </div>
</template>
