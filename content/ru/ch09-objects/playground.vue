<template>
  <div class="p-4 space-y-4">
    <h3 class="font-semibold text-gray-800">Песочница: Объекты</h3>
    <p class="text-sm text-gray-600">
      Попробуйте деструктуризацию, Object.entries, spread и другие операции с объектами.
    </p>
    <div class="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-700 space-y-1">
      <div>// Откройте DevTools (F12) → Console</div>
      <div>// и поэкспериментируйте с объектами:</div>
      <div class="mt-2">const user = &#123; name: 'Иван', age: 25, role: 'admin' &#125;</div>
      <div>const &#123; name, ...rest &#125; = user</div>
      <div>console.log(name, rest)</div>
      <div class="mt-2">Object.entries(user).forEach(([k, v]) =&gt; console.log(k, v))</div>
    </div>
  </div>
</template>

<script setup>
// Интерактивная песочница для главы «Объекты»
// Используйте консоль браузера для экспериментов
</script>
