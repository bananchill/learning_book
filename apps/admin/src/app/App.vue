<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AdminSidebar } from '@/widgets/admin-sidebar'
import { AdminHeader } from '@/widgets/admin-header'
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex">
    <AdminSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <AdminHeader />
      <main class="flex-1 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
