<script setup lang="ts">
import { useI18n } from '@book/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center">
    <div class="text-5xl mb-4">📝</div>
    <h2 class="text-xl font-semibold text-[var(--color-text)] mb-2">
      {{ t('content.coming_soon') }}
    </h2>
    <p class="text-[var(--color-text-secondary)] max-w-md">
      {{ t('content.coming_soon_desc') }}
    </p>
  </div>
</template>
