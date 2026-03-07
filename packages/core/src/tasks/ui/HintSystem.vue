<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import { useHints } from '../model/useHints'

const props = defineProps<{
  hints: string[]
}>()

const { t } = useI18n()

const {
  currentHints,
  hasMore,
  nextLevel,
  pendingConfirm,
  requestHint,
  confirmHint,
  cancelHint,
} = useHints(props.hints)

const levelColors = ['border-success', 'border-warning', 'border-danger']
const levelBg = ['bg-success-light', 'bg-warning-light', 'bg-danger-light']
</script>

<template>
  <div class="space-y-3">
    <!-- Открытые подсказки -->
    <div
      v-for="(hint, i) in currentHints"
      :key="i"
      class="rounded-lg border-l-4 px-4 py-3 text-sm"
      :class="[levelColors[i], levelBg[i]]"
    >
      <span class="font-medium text-text-secondary">
        {{ t('task.hint_level', { level: i + 1 }) }}
      </span>
      <p class="mt-1 text-text">{{ hint }}</p>
    </div>

    <!-- Кнопка следующей подсказки -->
    <div v-if="hasMore && !pendingConfirm">
      <BaseButton size="sm" variant="ghost" @click="requestHint">
        {{ t('task.hint') }} {{ nextLevel }}
      </BaseButton>
    </div>

    <!-- Подтверждение -->
    <div
      v-if="pendingConfirm"
      class="rounded-lg border border-warning bg-warning-light px-4 py-3 flex items-center justify-between"
    >
      <span class="text-sm text-text">
        {{ t('task.hint_confirm') }}
      </span>
      <div class="flex gap-2">
        <BaseButton size="sm" variant="ghost" @click="cancelHint">
          {{ t('common.close') }}
        </BaseButton>
        <BaseButton size="sm" variant="primary" @click="confirmHint">
          {{ t('task.hint') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
