<template>
  <div class="p-4 space-y-4">
    <h3 class="font-semibold text-gray-800">Песочница: Строки</h3>
    <p class="text-sm text-gray-600">
      Попробуйте методы строк, шаблонные литералы и регулярные выражения.
    </p>
    <div class="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-700 space-y-1">
      <div>// Откройте DevTools (F12) → Console</div>
      <div>// и поэкспериментируйте со строками:</div>
      <div class="mt-2">const str = 'Hello, JavaScript World!'</div>
      <div>str.slice(7, 17)        // 'JavaScript'</div>
      <div>str.split(' ')          // ['Hello,', 'JavaScript', 'World!']</div>
      <div>str.replace(/\w+/g, w =&gt; w.toUpperCase())</div>
      <div class="mt-2">// Шаблонный литерал</div>
      <div>const name = 'Мир'</div>
      <div>`Привет, $&#123;name&#125;!`  // 'Привет, Мир!'</div>
    </div>
  </div>
</template>

<script setup>
// Интерактивная песочница для главы «Строки»
// Используйте консоль браузера для экспериментов
</script>
