<template>
  <div class="p-6 bg-gray-50 rounded-xl space-y-6">
    <h3 class="text-lg font-semibold text-gray-800">Ссылки на объекты в памяти</h3>

    <!-- Управление -->
    <div class="flex gap-3 flex-wrap">
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="mode === 'reference' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
        @click="mode = 'reference'; reset()"
      >
        Ссылка (b = a)
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="mode === 'shallow' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
        @click="mode = 'shallow'; reset()"
      >
        Поверхностная копия
      </button>
      <button
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="mode === 'deep' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'"
        @click="mode = 'deep'; reset()"
      >
        Глубокая копия
      </button>
    </div>

    <!-- Визуализация памяти -->
    <div class="grid grid-cols-2 gap-6">
      <!-- Стек (переменные) -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Стек (переменные)</div>
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <span class="text-sm font-mono font-semibold text-purple-700 w-6">a</span>
            <div class="flex-1 bg-purple-50 border border-purple-200 rounded px-3 py-1.5 text-sm font-mono">
              → <span class="text-purple-600">{{ refA }}</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-mono font-semibold w-6" :class="mode === 'reference' ? 'text-purple-700' : 'text-green-700'">b</span>
            <div
              class="flex-1 border rounded px-3 py-1.5 text-sm font-mono"
              :class="mode === 'reference' ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200'"
            >
              → <span :class="mode === 'reference' ? 'text-purple-600' : 'text-green-600'">{{ refB }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Куча (объекты) -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Куча (объекты)</div>
        <div class="space-y-3">
          <!-- Объект A -->
          <div class="border border-purple-300 rounded-lg p-3 bg-purple-50">
            <div class="text-xs text-purple-600 font-semibold mb-2">{{ refA }}</div>
            <div class="space-y-1 text-sm font-mono">
              <div>name: <span class="text-blue-700">'{{ objA.name }}'</span></div>
              <div class="flex items-center gap-2">
                address: → <span class="text-orange-600">{{ refAddrA }}</span>
              </div>
            </div>
          </div>

          <!-- Объект B (только при глубокой копии) -->
          <div v-if="mode !== 'reference'" class="border border-green-300 rounded-lg p-3 bg-green-50">
            <div class="text-xs text-green-600 font-semibold mb-2">{{ refB }}</div>
            <div class="space-y-1 text-sm font-mono">
              <div>name: <span class="text-blue-700">'{{ objB.name }}'</span></div>
              <div class="flex items-center gap-2">
                address: →
                <span :class="mode === 'shallow' ? 'text-orange-600' : 'text-green-600'">
                  {{ mode === 'shallow' ? refAddrA : refAddrB }}
                </span>
              </div>
            </div>
          </div>

          <!-- Объект address A -->
          <div class="border border-orange-300 rounded-lg p-3 bg-orange-50">
            <div class="text-xs text-orange-600 font-semibold mb-2">{{ refAddrA }}</div>
            <div class="text-sm font-mono">city: <span class="text-blue-700">'{{ addrA.city }}'</span></div>
          </div>

          <!-- Объект address B (только при глубокой копии) -->
          <div v-if="mode === 'deep'" class="border border-green-300 rounded-lg p-3 bg-green-50">
            <div class="text-xs text-green-600 font-semibold mb-2">{{ refAddrB }}</div>
            <div class="text-sm font-mono">city: <span class="text-blue-700">'{{ addrB.city }}'</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Демонстрация мутации -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <div class="text-sm font-semibold text-gray-700 mb-3">Изменить через b:</div>
      <div class="flex gap-3 flex-wrap">
        <button
          @click="mutateName()"
          class="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 border border-yellow-300 rounded hover:bg-yellow-200 transition-colors"
        >
          b.name = 'Мария'
        </button>
        <button
          @click="mutateCity()"
          class="px-3 py-1.5 text-sm bg-red-100 text-red-800 border border-red-300 rounded hover:bg-red-200 transition-colors"
        >
          b.address.city = 'Питер'
        </button>
        <button
          @click="reset()"
          class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 border border-gray-200 rounded hover:bg-gray-200 transition-colors"
        >
          Сброс
        </button>
      </div>
    </div>

    <!-- Результат -->
    <div class="bg-gray-900 rounded-lg p-4 text-sm font-mono space-y-1">
      <div class="text-gray-400">// Результат</div>
      <div>
        <span class="text-blue-400">a.name</span>
        <span class="text-gray-400"> === </span>
        <span class="text-green-400">'{{ objA.name }}'</span>
        <span v-if="mode !== 'reference' && objA.name !== objB.name" class="text-yellow-400"> // b.name = '{{ objB.name }}'</span>
      </div>
      <div>
        <span class="text-blue-400">a.address.city</span>
        <span class="text-gray-400"> === </span>
        <span class="text-green-400">'{{ addrA.city }}'</span>
        <span v-if="mode === 'shallow' && addrA.city !== 'Москва'" class="text-red-400"> // изменилось!</span>
        <span v-if="mode === 'deep' && addrA.city !== addrB.city" class="text-yellow-400"> // b.address.city = '{{ addrB.city }}'</span>
      </div>
    </div>

    <!-- Объяснение -->
    <div class="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div v-if="mode === 'reference'">
        <strong>Ссылка:</strong> b = a — обе переменные указывают на один объект. Любое изменение через b меняет и a.
      </div>
      <div v-else-if="mode === 'shallow'">
        <strong>Поверхностная копия ({...a}):</strong> b.name — независимо. Но b.address — та же ссылка что и a.address. Изменение вложенного объекта затрагивает оба.
      </div>
      <div v-else>
        <strong>Глубокая копия (structuredClone):</strong> b полностью независимо. Изменение любого поля, включая вложенные объекты, не затрагивает a.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const mode = ref('reference')

// Состояние объектов
const objA = ref({ name: 'Иван' })
const objB = ref({ name: 'Иван' })
const addrA = ref({ city: 'Москва' })
const addrB = ref({ city: 'Москва' })

// Идентификаторы в "памяти"
const refA = computed(() => '#0x1A2B')
const refB = computed(() => mode.value === 'reference' ? '#0x1A2B' : '#0x3C4D')
const refAddrA = computed(() => '#0x5E6F')
const refAddrB = computed(() => '#0x7A8B')

function reset() {
  objA.value = { name: 'Иван' }
  objB.value = { name: 'Иван' }
  addrA.value = { city: 'Москва' }
  addrB.value = { city: 'Москва' }
}

function mutateName() {
  if (mode.value === 'reference') {
    // b === a, оба меняются
    objA.value = { ...objA.value, name: 'Мария' }
    objB.value = objA.value
  } else {
    // b — отдельный объект
    objB.value = { ...objB.value, name: 'Мария' }
  }
}

function mutateCity() {
  if (mode.value === 'reference' || mode.value === 'shallow') {
    // address — одна ссылка, меняется у обоих
    addrA.value = { city: 'Питер' }
    addrB.value = addrA.value
  } else {
    // deep clone — независимые объекты
    addrB.value = { city: 'Питер' }
  }
}
</script>
