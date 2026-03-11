<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppHeader } from '@/widgets/app-header'
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <AppHeader />
    <RouterView />
  </div>
</template>
