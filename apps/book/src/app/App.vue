<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useTheme } from '@book/shared'
import { AppHeader } from '@/widgets/app-header'

const { isDark } = useTheme()
useHead({ htmlAttrs: { lang: 'ru', class: () => isDark.value ? 'dark' : '' } })
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <AppHeader />
    <RouterView />
  </div>
</template>
