<script setup lang="ts">
import { ref } from 'vue'

// Этапы выполнения JS-кода
const stages = [
  {
    id: 'source',
    label: 'Исходный код',
    icon: '📝',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    description: 'JavaScript-код, который ты написал',
    example: 'function add(a, b) {\n  return a + b\n}',
  },
  {
    id: 'parsing',
    label: 'Parsing (AST)',
    icon: '🌳',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    description: 'Движок разбирает код и строит дерево AST',
    example: 'FunctionDeclaration\n  └─ Identifier: add\n  └─ BinaryExpression: +',
  },
  {
    id: 'compilation',
    label: 'Компиляция',
    icon: '⚙️',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    description: 'AST преобразуется в байткод (Ignition в V8)',
    example: 'LdaSmi [1]\nAdd r0\nReturn',
  },
  {
    id: 'execution',
    label: 'Выполнение',
    icon: '▶️',
    color: 'bg-green-100 border-green-300 text-green-800',
    description: 'Байткод выполняется, горячий код оптимизируется TurboFan',
    example: 'add(1, 2) → 3\nadd(3, 4) → 7\n... (оптимизация)',
  },
]

const activeStage = ref<number | null>(null)
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200">
    <h3 class="text-lg font-semibold text-gray-800 mb-4">
      Как движок выполняет JavaScript
    </h3>

    <div class="flex flex-col gap-2">
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="flex items-start gap-4 cursor-pointer"
        @click="activeStage = activeStage === index ? null : index"
      >
        <!-- Стрелка между этапами -->
        <div v-if="index > 0" class="flex justify-center w-full mb-1">
          <span class="text-gray-400 text-xl">↓</span>
        </div>

        <div
          class="w-full rounded-lg border-2 p-4 transition-all"
          :class="[stage.color, activeStage === index ? 'shadow-md' : 'opacity-80 hover:opacity-100']"
        >
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">{{ stage.icon }}</span>
            <span class="font-semibold">{{ stage.label }}</span>
          </div>
          <p class="text-sm mb-2">{{ stage.description }}</p>

          <!-- Детали при нажатии -->
          <Transition name="fade">
            <pre
              v-if="activeStage === index"
              class="text-xs font-mono bg-white bg-opacity-60 rounded p-2 mt-2"
            >{{ stage.example }}</pre>
          </Transition>
        </div>
      </div>
    </div>

    <p class="text-xs text-gray-500 mt-4 text-center">
      Нажми на этап, чтобы увидеть пример
    </p>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
