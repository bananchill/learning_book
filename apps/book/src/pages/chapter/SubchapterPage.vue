<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton } from '@book/ui'
import { useProgressStore } from '@book/core'
import { useChapterContent, ContentPlaceholder, ContentError } from '@/features/content-loader'
import { useBookConfig } from '@/features/navigation'
import { usePageSeo, useArticleSchema, useBreadcrumbSchema } from '@/features/seo'
import { useRouterLinks } from '@/shared/lib/useRouterLinks'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const route = useRoute()
const { t } = useI18n()
const progress = useProgressStore()
const { findSubchapter } = useBookConfig()

const basePath = computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}`)
const subchapterId = computed(() => route.params.subchapter as string)
const subchapter = computed(() =>
  findSubchapter(props.sectionId, props.subsectionId, props.chapter.id, subchapterId.value),
)

const subPath = computed(() => `${basePath.value}/${subchapterId.value}`)
const subTitle = computed(() =>
  subchapter.value
    ? `${subchapter.value.title} — ${props.chapter.title}`
    : props.chapter.title,
)

usePageSeo({
  title: subTitle,
  description: computed(() => props.chapter.description),
  path: subPath,
  type: 'article',
})
useArticleSchema({
  title: subTitle,
  description: computed(() => props.chapter.description),
  path: subPath,
})
useBreadcrumbSchema([
  { name: t('nav.title'), path: '/' },
  { name: computed(() => props.chapter.title), path: basePath },
  { name: computed(() => subchapter.value?.title ?? ''), path: subPath },
])

const { onContentClick } = useRouterLinks()

const { component: contentComponent, isLoading, error } = useChapterContent(
  () => subchapter.value
    ? `${props.chapter.contentPath}/${subchapterId.value}`
    : undefined,
)

// Отметить как прочитанное
watch(contentComponent, (comp) => {
  if (comp && subchapterId.value) {
    progress.markSubchapterRead(props.chapter.id, subchapterId.value)
  }
})

// Навигация: предыдущая / следующая подглава
const currentIndex = computed(() =>
  props.chapter.subchapters.findIndex(s => s.id === subchapterId.value),
)
const prevSub = computed(() => props.chapter.subchapters[currentIndex.value - 1])
const nextSub = computed(() => props.chapter.subchapters[currentIndex.value + 1])
</script>

<template>
  <div>
    <div v-if="subchapter" class="mb-8">
      <h1 class="text-2xl font-bold text-text mb-2">{{ subchapter.title }}</h1>
    </div>

    <!-- Контент -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-4 bg-surface-muted rounded w-3/4" />
      <div class="h-4 bg-surface-muted rounded w-1/2" />
    </div>

    <div v-else-if="contentComponent" class="book-prose" @click="onContentClick">
      <component :is="contentComponent" />
    </div>

    <ContentError v-else-if="error" :type="error" />
    <ContentPlaceholder v-else />

    <!-- Навигация назад/вперёд -->
    <div class="flex items-center justify-between mt-12 pt-6 border-t border-border">
      <router-link v-if="prevSub" :to="`${basePath}/${prevSub.id}`">
        <BaseButton variant="ghost" size="sm">
          &larr; {{ prevSub.title }}
        </BaseButton>
      </router-link>
      <div v-else />

      <router-link
        v-if="nextSub"
        :to="`${basePath}/${nextSub.id}`"
      >
        <BaseButton variant="ghost" size="sm">
          {{ nextSub.title }} &rarr;
        </BaseButton>
      </router-link>
      <router-link
        v-else
        :to="`${basePath}/tasks`"
      >
        <BaseButton variant="primary" size="sm">
          {{ t('chapter.go_tasks') }} &rarr;
        </BaseButton>
      </router-link>
    </div>
  </div>
</template>
