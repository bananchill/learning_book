<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@book/i18n'
import { BaseCard, DifficultyBadge } from '@book/ui'
import { useChaptersStore } from '@/features/admin-api'
import { ChapterContentTable } from '@/widgets/chapter-content-table'

const { t } = useI18n()
const route = useRoute()
const chaptersStore = useChaptersStore()
const activeTab = ref('meta')

const chapterId = computed(() => route.params.chapterId as string)

const tabs = [
  { id: 'meta', label: 'admin.chapter_detail.tab_meta' },
  { id: 'subchapters', label: 'admin.chapter_detail.tab_subchapters' },
  { id: 'tasks', label: 'admin.chapter_detail.tab_tasks' },
  { id: 'quiz', label: 'admin.chapter_detail.tab_quiz' },
  { id: 'interview', label: 'admin.chapter_detail.tab_interview' },
  { id: 'walkthrough', label: 'admin.chapter_detail.tab_walkthrough' },
  { id: 'resources', label: 'admin.chapter_detail.tab_resources' },
]

const chapter = computed(() => chaptersStore.currentChapter)

const taskColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: t('admin.chapters.tasks') },
  { key: 'difficulty', label: t('difficulty.easy') },
  { key: 'estimatedMinutes', label: t('admin.chapter_detail.estimated_time') },
]

const quizColumns = [
  { key: 'id', label: 'ID' },
  { key: 'question', label: t('admin.chapters.quiz') },
  { key: 'type', label: 'Type' },
  { key: 'difficulty', label: t('difficulty.easy') },
]

const interviewColumns = [
  { key: 'id', label: 'ID' },
  { key: 'question', label: t('admin.chapters.interview') },
  { key: 'level', label: 'Level' },
]

onMounted(() => {
  chaptersStore.fetchChapter(chapterId.value)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Табы -->
    <div class="flex gap-1 border-b border-[var(--color-border)]">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
        :class="[
          activeTab === tab.id
            ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
            : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
        ]"
        @click="activeTab = tab.id"
      >
        {{ t(tab.label) }}
      </button>
    </div>

    <div v-if="chaptersStore.isLoading" class="text-[var(--color-text-secondary)]">
      {{ t('common.loading') }}
    </div>

    <template v-else-if="chapter">
      <!-- Мета -->
      <BaseCard v-if="activeTab === 'meta'">
        <div v-if="chapter.meta" class="space-y-3">
          <div v-for="(value, key) in chapter.meta" :key="String(key)" class="flex gap-4">
            <span class="text-sm font-medium text-[var(--color-text-secondary)] w-40 shrink-0">{{ String(key) }}</span>
            <span class="text-sm">
              <template v-if="Array.isArray(value)">{{ (value as unknown[]).join(', ') }}</template>
              <template v-else>{{ String(value) }}</template>
            </span>
          </div>
        </div>
        <p v-else class="text-[var(--color-text-secondary)]">{{ t('admin.chapter_detail.no_data') }}</p>
      </BaseCard>

      <!-- Подглавы -->
      <BaseCard v-if="activeTab === 'subchapters'">
        <div v-if="chapter.subchapterFiles.length" class="space-y-2">
          <div
            v-for="file in chapter.subchapterFiles"
            :key="file"
            class="px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] text-sm font-mono"
          >
            {{ file }}.md
          </div>
        </div>
        <p v-else class="text-[var(--color-text-secondary)]">{{ t('admin.chapter_detail.no_data') }}</p>
      </BaseCard>

      <!-- Задачи -->
      <BaseCard v-if="activeTab === 'tasks'" :padding="false">
        <div class="p-6">
          <ChapterContentTable
            :columns="taskColumns"
            :rows="(chapter.tasks as Record<string, unknown>[]) ?? []"
          >
            <template #difficulty="{ value }">
              <DifficultyBadge :level="(value as 'easy' | 'medium' | 'hard')" />
            </template>
            <template #estimatedMinutes="{ value }">
              {{ t('admin.chapter_detail.minutes', { n: value }) }}
            </template>
          </ChapterContentTable>
        </div>
      </BaseCard>

      <!-- Квиз -->
      <BaseCard v-if="activeTab === 'quiz'" :padding="false">
        <div class="p-6">
          <ChapterContentTable
            :columns="quizColumns"
            :rows="(chapter.quiz?.questions as Record<string, unknown>[]) ?? []"
          />
        </div>
      </BaseCard>

      <!-- Интервью -->
      <BaseCard v-if="activeTab === 'interview'" :padding="false">
        <div class="p-6">
          <ChapterContentTable
            :columns="interviewColumns"
            :rows="(chapter.interview?.questions as Record<string, unknown>[]) ?? []"
          />
        </div>
      </BaseCard>

      <!-- Walkthrough -->
      <BaseCard v-if="activeTab === 'walkthrough'">
        <div v-if="chapter.walkthrough" class="space-y-3">
          <p><span class="font-medium">Title:</span> {{ chapter.walkthrough.title }}</p>
          <p>
            <span class="font-medium">{{ t('admin.chapter_detail.steps') }}:</span>
            {{ chapter.walkthrough.steps.length }}
          </p>
          <pre class="text-xs bg-[var(--color-surface-muted)] p-4 rounded-lg overflow-x-auto font-mono">{{ chapter.walkthrough.code }}</pre>
        </div>
        <p v-else class="text-[var(--color-text-secondary)]">{{ t('admin.chapter_detail.no_data') }}</p>
      </BaseCard>

      <!-- Ресурсы -->
      <BaseCard v-if="activeTab === 'resources'">
        <div v-if="chapter.resources && (chapter.resources as unknown[]).length" class="space-y-2">
          <div
            v-for="(res, i) in (chapter.resources as Record<string, unknown>[])"
            :key="i"
            class="px-3 py-2 rounded-lg bg-[var(--color-surface-muted)] text-sm"
          >
            <p class="font-medium">{{ res.title ?? res.name }}</p>
            <p v-if="res.url" class="text-[var(--color-text-secondary)] text-xs truncate">{{ res.url }}</p>
          </div>
        </div>
        <p v-else class="text-[var(--color-text-secondary)]">{{ t('admin.chapter_detail.no_data') }}</p>
      </BaseCard>
    </template>
  </div>
</template>
