<script setup lang="ts">
// Песочница для Production Performance API
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с Performance API и requestAnimationFrame.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Измерение производительности
performance.mark('start')
const arr = Array.from({ length: 100000 }, (_, i) => i)
arr.sort(() => Math.random() - 0.5)
performance.mark('end')

performance.measure('shuffle', 'start', 'end')
const [m] = performance.getEntriesByName('shuffle')
console.log(`Перемешивание: ${m.duration.toFixed(2)} мс`)

// requestAnimationFrame
let count = 0
function frame(ts) {
  count++
  if (count < 60) requestAnimationFrame(frame)
  else console.log('60 кадров за ~1 секунду')
}
requestAnimationFrame(frame)</pre>
  </div>
</template>
