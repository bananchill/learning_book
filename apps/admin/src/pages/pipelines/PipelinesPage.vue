<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseCard } from '@book/ui'
import { allPipelines } from '@/features/admin-api'

const { t } = useI18n()

const statusColors: Record<string, string> = {
  pending: 'bg-surface-muted text-text-secondary',
  in_progress: 'bg-info/10 text-info',
  completed: 'bg-success/10 text-success',
  failed: 'bg-danger/10 text-danger',
}
</script>

<template>
  <div class="space-y-8">
    <!-- Информационное предупреждение -->
    <div class="px-4 py-3 rounded-lg bg-info/10 border border-info/20 text-sm text-info">
      {{ t('admin.pipelines.run_hint') }}
    </div>

    <!-- Пайплайны -->
    <div v-for="pipeline in allPipelines" :key="pipeline.id" class="space-y-4">
      <h2 class="text-lg font-semibold">
        {{ t(`admin.${pipeline.name}`) }}
      </h2>

      <BaseCard>
        <div class="flex items-center gap-3 overflow-x-auto pb-2">
          <template v-for="(agent, i) in pipeline.agents" :key="agent.id">
            <!-- Стрелка между шагами -->
            <div v-if="i > 0" class="shrink-0 text-text-secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <!-- Карточка агента -->
            <div class="shrink-0 w-40 p-3 rounded-lg border border-border bg-surface">
              <p class="font-medium text-sm">{{ agent.name }}</p>
              <p class="text-xs text-text-secondary mt-1">{{ agent.description }}</p>
              <span
                class="inline-block mt-2 text-xs px-2 py-0.5 rounded-full"
                :class="statusColors[agent.status]"
              >
                {{ t(`admin.pipelines.status_${agent.status}`) }}
              </span>
            </div>
          </template>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
