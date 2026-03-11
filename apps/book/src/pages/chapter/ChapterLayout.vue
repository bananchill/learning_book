<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { useI18n } from '@book/i18n'
import { useBookConfig, useSidebarStore } from '@/features/navigation'
import { AppSidebar } from '@/widgets/sidebar'

const { t } = useI18n()
const route = useRoute()
const sidebar = useSidebarStore()
const { findChapter } = useBookConfig()

const sectionId = computed(() => route.params.section as string)
const subsectionId = computed(() => route.params.subsection as string)
const chapterId = computed(() => route.params.chapter as string)
const chapter = computed(() =>
  findChapter(sectionId.value, subsectionId.value, chapterId.value),
)

function checkMobile() {
  sidebar.setMobile(window.innerWidth < 1024)
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-3.5rem)]">
    <AppSidebar />

    <main
      class="flex-1 transition-all duration-300"
      :class="sidebar.isOpen && !sidebar.isMobile ? 'ml-72' : 'ml-0'"
    >
      <div class="max-w-4xl mx-auto px-6 py-8">
        <RouterView
          v-if="chapter"
          :chapter="chapter"
          :section-id="sectionId"
          :subsection-id="subsectionId"
        />

        <!-- Глава не найдена -->
        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
          <div class="text-5xl mb-4">🔍</div>
          <h2 class="text-xl font-semibold text-text mb-2">
            {{ t('content.not_found_title') }}
          </h2>
          <p class="text-text-secondary">
            {{ t('content.not_found_desc') }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
