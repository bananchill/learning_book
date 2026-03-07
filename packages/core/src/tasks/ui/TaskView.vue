<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { DifficultyBadge } from '@book/ui'
import type { Task, TestResult } from '@book/shared'
import { CodeSandbox } from '../../sandbox'
import { useTask } from '../model/useTask'
import HintSystem from './HintSystem.vue'

const props = defineProps<{
  task: Task
  starterCode: string
  testCode: string
}>()

const emit = defineEmits<{
  solved: [taskId: string]
}>()

const { t } = useI18n()

const { isSolved, allPassed, onTestResults } = useTask(props.task)

function handleTestResults(results: TestResult[]) {
  onTestResults(results)
  if (allPassed.value) {
    emit('solved', props.task.id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Заголовок задачи -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-text">{{ task.title }}</h3>
        <p class="text-sm text-text-secondary mt-1">{{ task.description }}</p>
      </div>
      <div class="flex items-center gap-3">
        <DifficultyBadge :level="task.difficulty" />
        <span v-if="isSolved" class="text-success font-medium text-sm">
          {{ t('task.solved') }}
        </span>
      </div>
    </div>

    <!-- Песочница -->
    <CodeSandbox
      :starter-code="starterCode"
      :test-code="testCode"
      language="javascript"
      :auto-run="true"
      :debounce-ms="800"
      height="300px"
      @test-results="handleTestResults"
    />

    <!-- Подсказки -->
    <HintSystem v-if="task.hints.length > 0" :hints="task.hints" />
  </div>
</template>
