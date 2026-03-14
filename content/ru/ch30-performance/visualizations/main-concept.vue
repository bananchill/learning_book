<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

// Демонстрация разницы rAF vs setTimeout для анимации
const rafPosition = ref(0)
const setTimeoutPosition = ref(0)
const isRunning = ref(false)
const rafCount = ref(0)
const setTimeoutCount = ref(0)

let rafId: number | null = null
let timeoutId: ReturnType<typeof setTimeout> | null = null
let startTime = 0

const DURATION = 3000
const DISTANCE = 300

function startAnimation() {
  if (isRunning.value) return
  isRunning.value = true
  rafPosition.value = 0
  setTimeoutPosition.value = 0
  rafCount.value = 0
  setTimeoutCount.value = 0
  startTime = performance.now()

  // rAF анимация
  function rafFrame(timestamp: number) {
    const progress = Math.min((timestamp - startTime) / DURATION, 1)
    rafPosition.value = Math.round(progress * DISTANCE)
    rafCount.value++

    if (progress < 1) {
      rafId = requestAnimationFrame(rafFrame)
    }
  }
  rafId = requestAnimationFrame(rafFrame)

  // setTimeout анимация (каждые 16мс — имитация rAF)
  function setTimeoutFrame() {
    const now = performance.now()
    const progress = Math.min((now - startTime) / DURATION, 1)
    setTimeoutPosition.value = Math.round(progress * DISTANCE)
    setTimeoutCount.value++

    if (progress < 1) {
      timeoutId = setTimeout(setTimeoutFrame, 16)
    } else {
      isRunning.value = false
    }
  }
  setTimeoutFrame()
}

function reset() {
  if (rafId) cancelAnimationFrame(rafId)
  if (timeoutId) clearTimeout(timeoutId)
  isRunning.value = false
  rafPosition.value = 0
  setTimeoutPosition.value = 0
  rafCount.value = 0
  setTimeoutCount.value = 0
}

onUnmounted(reset)
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">requestAnimationFrame vs setTimeout</h3>

    <!-- Дорожки анимации -->
    <div class="space-y-4 mb-4">
      <div>
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>requestAnimationFrame</span>
          <span class="text-blue-600">{{ rafCount }} кадров</span>
        </div>
        <div class="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
          <div
            class="absolute top-1 h-6 w-8 bg-blue-500 rounded transition-none"
            :style="{ left: rafPosition + 'px' }"
          >
            <span class="text-white text-xs flex items-center justify-center h-full">rAF</span>
          </div>
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs text-gray-500 mb-1">
          <span>setTimeout (16ms)</span>
          <span class="text-orange-600">{{ setTimeoutCount }} тиков</span>
        </div>
        <div class="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
          <div
            class="absolute top-1 h-6 w-12 bg-orange-400 rounded transition-none"
            :style="{ left: setTimeoutPosition + 'px' }"
          >
            <span class="text-white text-xs flex items-center justify-center h-full">set</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Управление -->
    <div class="flex gap-2">
      <button
        @click="startAnimation"
        :disabled="isRunning"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        Запустить
      </button>
      <button
        @click="reset"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        Сброс
      </button>
    </div>

    <p class="mt-3 text-xs text-gray-500">
      rAF синхронизируется с частотой обновления экрана (60fps/120fps). setTimeout(16) может пропускать кадры при высокой нагрузке.
    </p>
  </div>
</template>
