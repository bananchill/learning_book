<script setup lang="ts">
import BaseModal from './BaseModal.vue'

defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <BaseModal :open="open" :title="title" @close="emit('close')">
    <div class="book-prose">
      <slot />
    </div>
  </BaseModal>
</template>
