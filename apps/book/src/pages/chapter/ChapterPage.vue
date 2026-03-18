<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton, BaseCard } from '@book/ui'
import { useChapterContent, ContentPlaceholder, ContentError } from '@/features/content-loader'
import { ChapterView } from '@/widgets/chapter-view'
import { usePageSeo, useArticleSchema, useBreadcrumbSchema } from '@/features/seo'
import { useRouterLinks } from '@/shared/lib/useRouterLinks'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const { t } = useI18n()

const chapterPath = computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}`)

usePageSeo({
  title: computed(() => props.chapter.title),
  description: computed(() => props.chapter.description),
  path: chapterPath,
  type: 'article',
})
useArticleSchema({
  title: computed(() => props.chapter.title),
  description: computed(() => props.chapter.description),
  path: chapterPath,
})
useBreadcrumbSchema([
  { name: t('nav.title'), path: '/' },
  { name: computed(() => props.chapter.title), path: chapterPath },
])

const contentPath = computed(() => `${props.chapter.contentPath}/index`)
const { component: contentComponent, isLoading, error } = useChapterContent(
  () => contentPath.value,
)

const basePath = computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}`)

const { onContentClick } = useRouterLinks()
</script>

<template>
  <ChapterView :chapter="chapter" :section-id="sectionId">
    <!-- Заголовок главы -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-text mb-3">{{ chapter.title }}</h1>
      <p class="text-text-secondary text-lg">{{ chapter.description }}</p>
    </div>

    <!-- MDX контент -->
    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-4 bg-surface-muted rounded w-3/4" />
      <div class="h-4 bg-surface-muted rounded w-1/2" />
      <div class="h-4 bg-surface-muted rounded w-5/6" />
    </div>

    <div v-else-if="contentComponent" class="book-prose" @click="onContentClick">
      <component :is="contentComponent" />
    </div>

    <ContentError v-else-if="error" :type="error" />
    <ContentPlaceholder v-else />

    <!-- Содержание подглав -->
    <div v-if="chapter.subchapters.length > 0" class="mt-10">
      <h2 class="text-xl font-semibold text-text mb-4">
        {{ t('chapter.contents') }}
      </h2>
      <div class="space-y-2">
        <router-link
          v-for="sub in chapter.subchapters"
          :key="sub.id"
          :to="`${basePath}/${sub.id}`"
          class="block"
        >
          <BaseCard :padding="false" class="p-4 hover:bg-surface-muted transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-sm font-medium text-primary">{{ sub.order }}.</span>
              <span class="text-sm font-medium text-text">{{ sub.title }}</span>
            </div>
          </BaseCard>
        </router-link>
      </div>
    </div>

    <!-- Быстрые ссылки -->
    <div
      v-if="chapter.hasTasks !== false || chapter.hasPlayground !== false || chapter.hasCodeReview !== false"
      class="flex flex-wrap gap-3 mt-8"
    >
      <router-link v-if="chapter.hasTasks !== false" :to="`${basePath}/tasks`">
        <BaseButton variant="secondary" size="sm">{{ t('chapter.go_tasks') }}</BaseButton>
      </router-link>
      <router-link v-if="chapter.hasPlayground !== false" :to="`${basePath}/playground`">
        <BaseButton variant="secondary" size="sm">{{ t('chapter.go_playground') }}</BaseButton>
      </router-link>
      <router-link v-if="chapter.hasCodeReview !== false" :to="`${basePath}/code-review`">
        <BaseButton variant="secondary" size="sm">{{ t('chapter.go_code_review') }}</BaseButton>
      </router-link>
    </div>
  </ChapterView>
</template>
