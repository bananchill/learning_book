<script setup lang="ts">
// Песочница для DOM API
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с DOM API в браузерной консоли или в редакторе кода.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Создание элемента
const div = document.createElement('div')
div.className = 'card'
div.textContent = 'Привет, DOM!'

// Вставка в конец body
document.body.append(div)

// classList
div.classList.toggle('active')
div.classList.contains('active') // true

// data-атрибуты
div.dataset.userId = '42'
console.log(div.dataset.userId) // '42'</pre>
  </div>
</template>
