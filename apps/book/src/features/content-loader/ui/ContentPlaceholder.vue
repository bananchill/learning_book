<script setup lang="ts">
import { useI18n } from '@book/i18n'

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6">
    <!-- Информационное сообщение -->
    <div class="flex items-start gap-4 rounded-xl border border-border bg-surface-elevated p-5">
      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light">
        <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
      <div>
        <h3 class="font-semibold text-text mb-1">{{ t('content.coming_soon') }}</h3>
        <p class="text-sm text-text-secondary">{{ t('content.coming_soon_desc') }}</p>
      </div>
    </div>

    <!-- Скелет контента — визуальное представление будущей главы -->
    <div class="space-y-5 opacity-30 select-none" aria-hidden="true">
      <!-- Параграф -->
      <div class="space-y-2.5">
        <div class="h-4 bg-surface-muted rounded-md w-full" />
        <div class="h-4 bg-surface-muted rounded-md w-11/12" />
        <div class="h-4 bg-surface-muted rounded-md w-4/5" />
      </div>

      <!-- Блок кода -->
      <div class="rounded-lg border border-border-muted bg-surface-inset p-4 space-y-2">
        <div class="h-3 bg-surface-muted rounded w-1/3" />
        <div class="h-3 bg-surface-muted rounded w-2/3" />
        <div class="h-3 bg-surface-muted rounded w-1/2" />
        <div class="h-3 bg-surface-muted rounded w-1/4" />
      </div>

      <!-- Параграф -->
      <div class="space-y-2.5">
        <div class="h-4 bg-surface-muted rounded-md w-full" />
        <div class="h-4 bg-surface-muted rounded-md w-3/4" />
      </div>

      <!-- Callout -->
      <div class="rounded-lg border-l-4 border-primary-muted bg-primary-light p-4 space-y-2">
        <div class="h-3.5 bg-surface-muted rounded w-1/4" />
        <div class="h-3 bg-surface-muted rounded w-5/6" />
        <div class="h-3 bg-surface-muted rounded w-2/3" />
      </div>

      <!-- Параграф -->
      <div class="space-y-2.5">
        <div class="h-4 bg-surface-muted rounded-md w-full" />
        <div class="h-4 bg-surface-muted rounded-md w-5/6" />
        <div class="h-4 bg-surface-muted rounded-md w-3/5" />
      </div>
    </div>
  </div>
</template>
