<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import { useRouter } from 'vue-router'

defineProps<{
  type: 'not_found' | 'load_error'
}>()

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="text-5xl mb-4">{{ type === 'not_found' ? '🔍' : '⚠️' }}</div>
    <h2 class="text-xl font-semibold text-[var(--color-text)] mb-2">
      {{ t(`content.${type}_title`) }}
    </h2>
    <p class="text-[var(--color-text-secondary)] mb-6">
      {{ t(`content.${type}_desc`) }}
    </p>
    <BaseButton variant="secondary" @click="router.push('/')">
      {{ t('content.back_home') }}
    </BaseButton>
  </div>
</template>
