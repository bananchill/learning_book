<script setup lang="ts">
// Песочница для Web APIs
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с Fetch API, IntersectionObserver и Web Storage.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Fetch с таймаутом
const ctrl = new AbortController()
setTimeout(() => ctrl.abort(), 3000)

fetch('https://jsonplaceholder.typicode.com/users/1', {
  signal: ctrl.signal
})
  .then(res => { if (!res.ok) throw new Error(res.status); return res.json() })
  .then(user => console.log(user.name))
  .catch(e => e.name === 'AbortError' ? 'Timeout' : console.error(e))

// localStorage
localStorage.setItem('user', JSON.stringify({ name: 'Иван', theme: 'dark' }))
const user = JSON.parse(localStorage.getItem('user') || 'null')
console.log(user?.theme) // 'dark'</pre>
  </div>
</template>
