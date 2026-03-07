<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { ChapterMeta } from '@book/shared'
import {
  QuizWidget,
  CodeWalkthrough,
  InterviewPrep,
  AIChatPanel,
  ChatToggle,
  useProgressStore,
} from '@book/core'
import { useChapterData } from '@/features/content-loader'

const props = defineProps<{
  chapter: ChapterMeta
  sectionId: string
}>()

const progress = useProgressStore()
const showChat = ref(false)

const { quiz, walkthrough, interview, isLoading } = useChapterData(
  () => props.chapter.contentPath,
)

// Обновить общее количество в прогрессе при загрузке данных
watchEffect(() => {
  if (!isLoading.value) {
    progress.setChapterTotals(props.chapter.id, {
      reading: props.chapter.subchapters.length,
      quiz: quiz.value?.questions.length ?? 0,
      interview: interview.value?.questions.length ?? 0,
    })
  }
})

const chapterContext = computed(() => ({
  chapterId: props.chapter.id,
  title: props.chapter.title,
  topic: props.chapter.title,
  keyConcepts: [] as string[],
  commonMistakes: [] as string[],
}))
</script>

<template>
  <div class="space-y-8">
    <!-- Основной контент (из router child) -->
    <slot />

    <!-- Фичи главы -->
    <template v-if="!isLoading">
      <section v-if="quiz" id="quiz">
        <QuizWidget
          :data="quiz"
          @complete="progress.saveQuizScore(chapter.id, $event.correct, $event.total)"
        />
      </section>

      <section v-if="walkthrough" id="walkthrough">
        <CodeWalkthrough :data="walkthrough" />
      </section>

      <section v-if="interview" id="interview">
        <InterviewPrep :data="interview" />
      </section>
    </template>

    <!-- AI Чат -->
    <ChatToggle :active="showChat" @toggle="showChat = !showChat" />
    <AIChatPanel
      :chapter-context="chapterContext"
      :visible="showChat"
      @close="showChat = false"
    />
  </div>
</template>
