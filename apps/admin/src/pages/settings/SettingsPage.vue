<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from '@book/i18n'
import { BaseCard, BaseButton } from '@book/ui'
import { useBookConfigAdmin } from '@/features/admin-api'
import type { SectionMeta, ChapterMeta } from '@book/shared'

const { t } = useI18n()
const { config, sections, isLoading, loadConfig, saveConfig } = useBookConfigAdmin()
const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

onMounted(() => {
  loadConfig()
})

/** Подсчёт всех глав в секции */
function countChapters(section: SectionMeta): number {
  let count = 0
  for (const sub of section.subsections) {
    for (const group of sub.groups) {
      count += group.chapters.length
    }
  }
  return count
}

/** Плоский список глав секции */
function flatChapters(section: SectionMeta): ChapterMeta[] {
  const result: ChapterMeta[] = []
  for (const sub of section.subsections) {
    for (const group of sub.groups) {
      result.push(...group.chapters)
    }
  }
  return result
}

async function handleSave() {
  saveStatus.value = 'saving'
  const ok = await saveConfig()
  saveStatus.value = ok ? 'saved' : 'error'
  setTimeout(() => { saveStatus.value = 'idle' }, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="text-[var(--color-text-secondary)]">
      {{ t('common.loading') }}
    </div>

    <template v-else-if="config">
      <BaseCard>
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">{{ t('admin.settings.book_config') }}</h3>
          <div class="flex items-center gap-3">
            <span
              v-if="saveStatus === 'saved'"
              class="text-sm text-[var(--color-success)]"
            >
              {{ t('admin.settings.saved') }}
            </span>
            <span
              v-else-if="saveStatus === 'error'"
              class="text-sm text-[var(--color-danger)]"
            >
              {{ t('admin.settings.save_error') }}
            </span>
            <BaseButton size="sm" @click="handleSave" :disabled="saveStatus === 'saving'">
              {{ t('admin.settings.save') }}
            </BaseButton>
          </div>
        </div>

        <div class="space-y-4">
          <div v-for="section in sections" :key="section.id" class="border border-[var(--color-border)] rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <h4 class="font-medium">{{ section.title }}</h4>
                <p class="text-xs text-[var(--color-text-secondary)]">{{ section.id }}</p>
              </div>
              <span class="text-sm text-[var(--color-text-secondary)]">
                {{ t('admin.settings.chapters_count', { n: countChapters(section) }) }}
              </span>
            </div>

            <div v-if="flatChapters(section).length" class="space-y-2 ml-4">
              <div
                v-for="ch in flatChapters(section)"
                :key="ch.id"
                class="flex items-center justify-between px-3 py-2 rounded bg-[var(--color-surface-muted)] text-sm"
              >
                <div>
                  <span class="font-medium">{{ ch.title }}</span>
                  <span class="text-[var(--color-text-secondary)] ml-2">{{ ch.id }}</span>
                </div>
                <span class="text-xs text-[var(--color-text-secondary)]">
                  {{ ch.subchapters.length }} {{ t('admin.chapters.subchapters').toLowerCase() }}
                </span>
              </div>
            </div>
            <p v-else class="text-sm text-[var(--color-text-secondary)] ml-4">
              {{ t('admin.chapters.no_chapters') }}
            </p>
          </div>
        </div>
      </BaseCard>
    </template>
  </div>
</template>
