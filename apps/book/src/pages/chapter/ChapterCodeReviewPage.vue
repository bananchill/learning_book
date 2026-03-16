<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { BaseButton } from '@book/ui'
import { CodeReviewView } from '@book/core'
import { useChapterData, useCodeReviewCode, ContentPlaceholder } from '@/features/content-loader'
import { usePageSeo } from '@/features/seo'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
}>()

const { t } = useI18n()

usePageSeo({
  title: computed(() => `Code Review: ${props.chapter.title}`),
  description: computed(() => props.chapter.description),
  path: computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}/code-review`),
})

const { codeReviews, isLoading } = useChapterData(() => props.chapter.contentPath)

const selectedReviewId = ref<string | null>(null)
const selectedReview = computed(() =>
  codeReviews.value.find(r => r.id === selectedReviewId.value),
)

const { code, isLoading: isCodeLoading } = useCodeReviewCode(
  () => props.chapter.contentPath,
  () => selectedReview.value?.codeFile,
)

const nextReview = computed(() => {
  if (!selectedReviewId.value) return null
  const idx = codeReviews.value.findIndex(r => r.id === selectedReviewId.value)
  return idx >= 0 && idx < codeReviews.value.length - 1 ? codeReviews.value[idx + 1] : null
})

function handleSelect(reviewId: string) {
  selectedReviewId.value = reviewId
}

function goToNext() {
  if (nextReview.value) {
    selectedReviewId.value = nextReview.value.id
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-text mb-6">
      Code Review: {{ chapter.title }}
    </h1>

    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-20 bg-surface-muted rounded-xl" />
      <div class="h-20 bg-surface-muted rounded-xl" />
    </div>

    <template v-else-if="codeReviews.length > 0">
      <!-- Загрузка кода -->
      <div v-if="isCodeLoading && selectedReview" class="animate-pulse space-y-4">
        <div class="h-64 bg-surface-muted rounded-xl" />
      </div>

      <!-- Просмотр выбранного ревью -->
      <CodeReviewView
        v-else-if="selectedReview && code"
        :code="code"
        :issues="selectedReview.issues"
      />

      <!-- Список ревью -->
      <div v-else class="space-y-3">
        <button
          v-for="review in codeReviews"
          :key="review.id"
          class="w-full text-left rounded-xl border border-border bg-surface p-4 hover:bg-surface-muted transition-colors"
          @click="handleSelect(review.id)"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-text">{{ review.title }}</span>
            <span class="text-xs text-text-muted">
              {{ review.issues.length }} {{ t('code_review.issues_count', review.issues.length) }}
            </span>
          </div>
        </button>
      </div>

      <!-- Навигация -->
      <div v-if="selectedReview" class="mt-4 flex items-center justify-between">
        <BaseButton
          variant="ghost"
          size="sm"
          @click="selectedReviewId = null"
        >
          &larr; {{ t('code_review.back_to_list') }}
        </BaseButton>
        <BaseButton
          v-if="nextReview"
          variant="ghost"
          size="sm"
          @click="goToNext"
        >
          {{ t('code_review.next_review') }} &rarr;
        </BaseButton>
      </div>
    </template>

    <ContentPlaceholder v-else />
  </div>
</template>
