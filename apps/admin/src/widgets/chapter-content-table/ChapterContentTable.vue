<script setup lang="ts">
import { useI18n } from '@book/i18n'

defineProps<{
  columns: { key: string; label: string }[]
  rows: Record<string, unknown>[]
  emptyText?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="overflow-x-auto">
    <table v-if="rows.length" class="w-full text-sm">
      <thead>
        <tr class="border-b border-border">
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left py-2 px-3 font-medium text-text-secondary"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="i"
          class="border-b border-border last:border-0 hover:bg-surface-muted"
        >
          <td v-for="col in columns" :key="col.key" class="py-2 px-3">
            <slot :name="col.key" :value="row[col.key]" :row="row">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-center py-8 text-text-secondary">
      {{ emptyText ?? t('admin.chapter_detail.no_data') }}
    </p>
  </div>
</template>
