<script setup lang="ts">
// Песочница для событий
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с делегированием событий и кастомными событиями.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Делегирование событий
const list = document.querySelector('ul')
list.addEventListener('click', (e) => {
  const item = e.target.closest('li')
  if (!item) return
  console.log('Клик на:', item.textContent)
})

// Кастомное событие
document.dispatchEvent(new CustomEvent('app:ready', {
  bubbles: true,
  detail: { version: '1.0' }
}))

document.addEventListener('app:ready', (e) => {
  console.log('Приложение готово:', e.detail)
})</pre>
  </div>
</template>
