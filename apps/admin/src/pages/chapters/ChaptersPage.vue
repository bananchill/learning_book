<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from '@book/i18n'
import { BaseCard } from '@book/ui'
import { useChaptersStore } from '@/features/admin-api'

const { t } = useI18n()
const chaptersStore = useChaptersStore()

onMounted(() => {
  chaptersStore.fetchChapters()
})

/** Группировка глав по секции */
const groupedChapters = computed(() => {
  const groups = new Map<string, { sectionTitle: string; chapters: typeof chaptersStore.chapters }>()
  for (const ch of chaptersStore.chapters) {
    if (!groups.has(ch.section)) {
      groups.set(ch.section, { sectionTitle: ch.sectionTitle, chapters: [] })
    }
    groups.get(ch.section)!.chapters.push(ch)
  }
  return groups
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="chaptersStore.isLoading" class="text-[var(--color-text-secondary)]">
      {{ t('common.loading') }}
    </div>

    <template v-else-if="chaptersStore.chapters.length">
      <div v-for="[sectionId, group] in groupedChapters" :key="sectionId" class="space-y-3">
        <h2 class="text-lg font-semibold text-[var(--color-text)]">{{ group.sectionTitle }}</h2>

        <div class="grid gap-3">
          <BaseCard v-for="ch in group.chapters" :key="ch.id">
            <router-link
              :to="{ name: 'chapter-detail', params: { chapterId: ch.id } }"
              class="block"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-medium">{{ ch.title }}</h3>
                  <p class="text-sm text-[var(--color-text-secondary)] mt-1">{{ ch.description }}</p>
                </div>
                <div class="flex items-center gap-2 ml-4 shrink-0">
                  <span
                    v-if="ch.hasTasks"
                    class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]"
                  >
                    {{ ch.taskCount }} {{ t('admin.chapters.tasks').toLowerCase() }}
                  </span>
                  <span
                    v-if="ch.hasQuiz"
                    class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-info)]/10 text-[var(--color-info)]"
                  >
                    {{ t('admin.chapters.quiz') }}
                  </span>
                  <span
                    v-if="ch.hasInterview"
                    class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  >
                    {{ t('admin.chapters.interview') }}
                  </span>
                  <span
                    v-if="ch.hasWalkthrough"
                    class="text-xs px-2 py-0.5 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                  >
                    {{ t('admin.chapters.walkthrough') }}
                  </span>
                </div>
              </div>
            </router-link>
          </BaseCard>
        </div>
      </div>
    </template>

    <p v-else class="text-center py-12 text-[var(--color-text-secondary)]">
      {{ t('admin.chapters.no_chapters') }}
    </p>
  </div>
</template>
