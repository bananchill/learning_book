<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'
import { AppHeader } from '@/widgets/app-header'

useHead({ htmlAttrs: { lang: 'ru' } })
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <AppHeader />
    <RouterView />
  </div>
</template>
