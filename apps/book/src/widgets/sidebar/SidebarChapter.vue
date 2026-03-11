<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@book/i18n'
import type { ChapterMeta } from '@book/shared'
import { useProgressStore } from '@book/core'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
  subsectionId: string
  isActive: boolean
}>()

const { t } = useI18n()
const route = useRoute()
const progress = useProgressStore()

const percent = computed(() => progress.getChapterPercent(props.chapter.id))
const isExpanded = ref(props.isActive)
const currentSubchapter = computed(() => route.params.subchapter as string | undefined)

const basePath = computed(() => `/${props.sectionId}/${props.subsectionId}/${props.chapter.id}`)
</script>

<template>
  <div>
    <router-link
      :to="basePath"
      class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors"
      :class="isActive
        ? 'bg-surface-muted text-text font-medium'
        : 'text-text-secondary hover:text-text hover:bg-surface-muted/50'"
      @click="isExpanded = !isExpanded"
    >
      <span class="flex-1 truncate">{{ chapter.title }}</span>
      <span v-if="percent > 0" class="text-xs text-text-muted">{{ percent }}%</span>
    </router-link>

    <!-- Подглавы -->
    <div v-if="isActive && isExpanded" class="ml-4 mt-0.5 space-y-0.5">
      <router-link
        v-for="sub in chapter.subchapters"
        :key="sub.id"
        :to="`${basePath}/${sub.id}`"
        class="block px-3 py-1 rounded text-xs transition-colors"
        :class="currentSubchapter === sub.id
          ? 'text-primary font-medium'
          : 'text-text-muted hover:text-text-secondary'"
      >
        {{ sub.title }}
      </router-link>

      <router-link
        :to="`${basePath}/tasks`"
        class="block px-3 py-1 rounded text-xs text-text-muted hover:text-text-secondary transition-colors"
      >
        {{ t('nav.tasks') }}
      </router-link>
      <router-link
        :to="`${basePath}/playground`"
        class="block px-3 py-1 rounded text-xs text-text-muted hover:text-text-secondary transition-colors"
      >
        {{ t('nav.playground') }}
      </router-link>
    </div>
  </div>
</template>
