<script setup lang="ts">
// Песочница для декораторов
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с декораторами — логирование, мемоизация, валидация.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Декоратор логирования
function log(target, key, descriptor) {
  const original = descriptor.value
  descriptor.value = function (...args) {
    console.log(`Вызов ${key}(${args})`)
    const result = original.apply(this, args)
    console.log(`${key} → ${result}`)
    return result
  }
  return descriptor
}

class Math {
  // @log (в playground-режиме)
  add(a, b) { return a + b }
}</pre>
  </div>
</template>
