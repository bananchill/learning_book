<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm select-none">
    <h2 class="text-lg font-bold mb-4 text-green-400">Прототипная цепочка</h2>

    <!-- Переключатель примера -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="ex in scenarios"
        :key="ex.id"
        @click="activeScenario = ex.id"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeScenario === ex.id
            ? 'bg-green-500 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ ex.label }}
      </button>
    </div>

    <!-- Цепочка объектов -->
    <div class="flex flex-col gap-1 mb-6">
      <div
        v-for="(node, idx) in currentChain"
        :key="node.name"
        class="flex items-start gap-3"
      >
        <!-- Стрелка -->
        <div v-if="idx > 0" class="flex flex-col items-center" style="margin-left: 20px">
          <div class="w-0.5 h-3 bg-gray-600"></div>
          <div class="text-gray-500 text-xs">[[Prototype]]</div>
          <div class="w-0.5 h-3 bg-gray-600"></div>
        </div>

        <!-- Блок объекта -->
        <div
          :class="[
            'flex-1 border rounded-lg p-3',
            node.highlighted
              ? 'border-green-400 bg-green-900/20'
              : 'border-gray-700 bg-gray-900'
          ]"
          :style="idx > 0 ? { marginLeft: '40px' } : {}"
        >
          <div class="flex items-center gap-2 mb-2">
            <span
              class="text-xs px-2 py-0.5 rounded font-semibold"
              :class="node.tagClass"
            >
              {{ node.type }}
            </span>
            <span class="font-bold text-white">{{ node.name }}</span>
            <span v-if="node.highlighted" class="ml-auto text-green-400 text-xs">← найдено здесь</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="prop in node.props"
              :key="prop.name"
              :class="[
                'text-xs px-2 py-0.5 rounded',
                prop.isMethod ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                'bg-gray-800 text-gray-300'
              ]"
            >
              <span class="text-gray-400">{{ prop.name }}</span>
              <span class="text-gray-600">: </span>
              <span>{{ prop.value }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Поиск -->
    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-xs text-gray-400 mb-1">Ищем:</div>
      <div class="text-green-300 font-bold mb-3">{{ currentSearch }}</div>
      <div class="space-y-1">
        <div
          v-for="(step, i) in currentSteps"
          :key="i"
          :class="[
            'text-xs px-3 py-1 rounded flex items-center gap-2',
            step.found
              ? 'bg-green-900/40 text-green-300'
              : step.error
              ? 'bg-red-900/40 text-red-300'
              : 'bg-gray-800 text-gray-500'
          ]"
        >
          {{ i + 1 }}. {{ step.text }}
          <span v-if="step.found" class="ml-auto text-green-400">✓</span>
          <span v-else-if="step.error" class="ml-auto text-red-400">✗</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Prop { name: string; value: string; isMethod?: boolean }
interface ChainNode {
  name: string
  type: string
  tagClass: string
  highlighted?: boolean
  props: Prop[]
}
interface Step { text: string; found?: boolean; error?: boolean }
interface Scenario {
  id: string
  label: string
  chain: ChainNode[]
  search: string
  steps: Step[]
}

const scenarios: Scenario[] = [
  {
    id: 'own',
    label: 'Собственный метод',
    search: 'rex.bark()',
    chain: [
      {
        name: 'rex',
        type: 'Instance',
        tagClass: 'bg-purple-900 text-purple-300',
        props: [{ name: 'name', value: '"Рекс"' }]
      },
      {
        name: 'Dog.prototype',
        type: 'Prototype',
        tagClass: 'bg-blue-900 text-blue-300',
        highlighted: true,
        props: [
          { name: 'bark', value: 'function()', isMethod: true }
        ]
      },
      {
        name: 'Animal.prototype',
        type: 'Prototype',
        tagClass: 'bg-teal-900 text-teal-300',
        props: [
          { name: 'speak', value: 'function()', isMethod: true }
        ]
      },
      {
        name: 'Object.prototype',
        type: 'Root',
        tagClass: 'bg-gray-700 text-gray-300',
        props: [
          { name: 'toString', value: 'function()', isMethod: true },
          { name: 'hasOwnProperty', value: 'function()', isMethod: true }
        ]
      }
    ],
    steps: [
      { text: 'rex: bark? → нет' },
      { text: 'Dog.prototype: bark? → есть!', found: true }
    ]
  },
  {
    id: 'inherited',
    label: 'Унаследованный метод',
    search: 'rex.speak()',
    chain: [
      {
        name: 'rex',
        type: 'Instance',
        tagClass: 'bg-purple-900 text-purple-300',
        props: [{ name: 'name', value: '"Рекс"' }]
      },
      {
        name: 'Dog.prototype',
        type: 'Prototype',
        tagClass: 'bg-blue-900 text-blue-300',
        props: [
          { name: 'bark', value: 'function()', isMethod: true }
        ]
      },
      {
        name: 'Animal.prototype',
        type: 'Prototype',
        tagClass: 'bg-teal-900 text-teal-300',
        highlighted: true,
        props: [
          { name: 'speak', value: 'function()', isMethod: true }
        ]
      },
      {
        name: 'Object.prototype',
        type: 'Root',
        tagClass: 'bg-gray-700 text-gray-300',
        props: [
          { name: 'toString', value: 'function()', isMethod: true }
        ]
      }
    ],
    steps: [
      { text: 'rex: speak? → нет' },
      { text: 'Dog.prototype: speak? → нет' },
      { text: 'Animal.prototype: speak? → есть!', found: true }
    ]
  },
  {
    id: 'missing',
    label: 'Несуществующее',
    search: 'rex.fly()',
    chain: [
      {
        name: 'rex',
        type: 'Instance',
        tagClass: 'bg-purple-900 text-purple-300',
        props: [{ name: 'name', value: '"Рекс"' }]
      },
      {
        name: 'Dog.prototype',
        type: 'Prototype',
        tagClass: 'bg-blue-900 text-blue-300',
        props: [{ name: 'bark', value: 'function()', isMethod: true }]
      },
      {
        name: 'Animal.prototype',
        type: 'Prototype',
        tagClass: 'bg-teal-900 text-teal-300',
        props: [{ name: 'speak', value: 'function()', isMethod: true }]
      },
      {
        name: 'Object.prototype',
        type: 'Root',
        tagClass: 'bg-gray-700 text-gray-300',
        props: [{ name: '...', value: '' }]
      }
    ],
    steps: [
      { text: 'rex: fly? → нет' },
      { text: 'Dog.prototype: fly? → нет' },
      { text: 'Animal.prototype: fly? → нет' },
      { text: 'Object.prototype: fly? → нет' },
      { text: 'null — конец цепочки → undefined', error: true }
    ]
  }
]

const activeScenario = ref('own')
const currentData = computed(() => scenarios.find(s => s.id === activeScenario.value)!)
const currentChain = computed(() => currentData.value.chain)
const currentSearch = computed(() => currentData.value.search)
const currentSteps = computed(() => currentData.value.steps)
</script>
