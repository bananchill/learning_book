<template>
  <div class="p-4">
    <h3 class="text-lg font-semibold mb-3">Песочница: compose и pipe</h3>
    <div class="flex gap-3 mb-3 items-center text-sm">
      <span>Входное значение:</span>
      <input v-model.number="inputVal" type="number" class="border rounded px-2 py-1 w-20 font-mono" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="text-xs text-gray-500 mb-1">compose(triple, double)({{ inputVal }}) — сначала double, потом triple</div>
        <div class="bg-gray-900 text-green-400 rounded p-3 font-mono text-sm">
          {{ inputVal }} → double({{ inputVal }}) = {{ inputVal * 2 }} → triple({{ inputVal * 2 }}) = {{ inputVal * 6 }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">pipe(double, triple)({{ inputVal }}) — сначала double, потом triple (читается слева направо)</div>
        <div class="bg-gray-900 text-blue-400 rounded p-3 font-mono text-sm">
          {{ inputVal }} → double({{ inputVal }}) = {{ inputVal * 2 }} → triple({{ inputVal * 2 }}) = {{ inputVal * 6 }}
        </div>
      </div>
    </div>
    <p class="text-xs text-gray-500 mt-2">compose применяет справа налево, pipe — слева направо</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputVal = ref(3)
</script>
