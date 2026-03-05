<script setup lang="ts">
import { ref, provide } from 'vue'

const props = defineProps<{
  tabs: string[]
}>()

const activeTab = ref(props.tabs[0] ?? '')

provide('activeTab', activeTab)

const selectTab = (tab: string) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="my-4">
    <div class="flex gap-1 border-b border-border" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab"
        role="tab"
        :aria-selected="activeTab === tab"
        :class="[
          '-mb-px rounded-t-lg px-4 py-2 text-sm font-medium transition-colors duration-normal',
          activeTab === tab
            ? 'border-b-2 border-primary text-primary'
            : 'text-text-muted hover:text-text-secondary',
        ]"
        @click="selectTab(tab)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="pt-4">
      <slot />
    </div>
  </div>
</template>
