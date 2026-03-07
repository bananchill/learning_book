<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton, BaseCard } from '@book/ui'
import { useChapterContent, ContentPlaceholder, ContentError } from '@/features/content-loader'
import { ChapterView } from '@/widgets/chapter-view'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
}>()

const { t } = useI18n()

const contentPath = computed(() => `${props.chapter.contentPath}/index.md`)
const { component: contentComponent, isLoading, error } = useChapterContent(
  () => contentPath.value,
)
</script>

<template>
  <ChapterView :chapter="chapter" :section-id="sectionId">
    <!-- Заголовок главы -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-[var(--color-text)] mb-3">{{ chapter.title }}</h1>
      <p class="text-[var(--color-text-secondary)] text-lg">{{ chapter.description }}</p>
    </div>

    <!-- MDX контент -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-4 bg-surface-muted rounded w-3/4" />
      <div class="h-4 bg-surface-muted rounded w-1/2" />
      <div class="h-4 bg-surface-muted rounded w-5/6" />
    </div>

    <div v-else-if="contentComponent" class="book-prose">
      <component :is="contentComponent" />
    </div>

    <ContentError v-else-if="error" :type="error" />
    <ContentPlaceholder v-else />

    <!-- Содержание подглав -->
    <div v-if="chapter.subchapters.length > 0" class="mt-10">
      <h2 class="text-xl font-semibold text-[var(--color-text)] mb-4">
        {{ t('chapter.contents') }}
      </h2>
      <div class="space-y-2">
        <router-link
          v-for="sub in chapter.subchapters"
          :key="sub.id"
          :to="`/${sectionId}/${chapter.id}/${sub.id}`"
          class="block"
        >
          <BaseCard :padding="false" class="p-4 hover:bg-[var(--color-surface-muted)] transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-[var(--color-primary)]">{{ sub.order }}.</span>
              <span class="text-sm font-medium text-[var(--color-text)]">{{ sub.title }}</span>
            </div>
          </BaseCard>
        </router-link>
      </div>
    </div>

    <!-- Быстрые ссылки -->
    <div class="flex flex-wrap gap-3 mt-8">
      <router-link :to="`/${sectionId}/${chapter.id}/tasks`">
        <BaseButton variant="secondary" size="sm">{{ t('chapter.go_tasks') }}</BaseButton>
      </router-link>
      <router-link :to="`/${sectionId}/${chapter.id}/playground`">
        <BaseButton variant="secondary" size="sm">{{ t('chapter.go_playground') }}</BaseButton>
      </router-link>
    </div>
  </ChapterView>
</template>
