<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <AppHeader />
    <RouterView />
  </div>
</template>
