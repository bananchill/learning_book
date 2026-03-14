<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: var vs let</h3>
    <p class="text-sm text-gray-600 mb-3">Симуляция разницы в скоупе:</p>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <h4 class="text-sm font-mono font-medium mb-2 text-red-600">var (функциональный скоуп)</h4>
        <div class="bg-gray-900 rounded p-3 text-sm font-mono text-gray-300 space-y-1">
          <div>for (<span class="text-yellow-400">var</span> i = 0; i &lt; 3; i++) {</div>
          <div>&nbsp;&nbsp;setTimeout(() =&gt; log(i), 0);</div>
          <div>}</div>
          <div class="text-gray-500 mt-2">// Результат:</div>
          <div class="text-red-400">{{ varResult.join(', ') }}</div>
        </div>
      </div>
      <div>
        <h4 class="text-sm font-mono font-medium mb-2 text-green-600">let (блочный скоуп)</h4>
        <div class="bg-gray-900 rounded p-3 text-sm font-mono text-gray-300 space-y-1">
          <div>for (<span class="text-green-400">let</span> i = 0; i &lt; 3; i++) {</div>
          <div>&nbsp;&nbsp;setTimeout(() =&gt; log(i), 0);</div>
          <div>}</div>
          <div class="text-gray-500 mt-2">// Результат:</div>
          <div class="text-green-400">{{ letResult.join(', ') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Симуляция поведения var (все callbacks видят одну переменную)
const varResult = ref([3, 3, 3])

// Симуляция поведения let (каждый callback видит свою копию)
const letResult = ref([0, 1, 2])
</script>
