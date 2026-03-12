<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton } from '@book/ui'
import { useRouter, useRoute } from 'vue-router'
import { usePageSeo } from '@/features/seo'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

usePageSeo({
  title: t('not_found.title'),
  description: t('not_found.description'),
  path: route.path,
})
</script>

<template>
  <div class="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">
    <div class="text-6xl mb-6">404</div>
    <h1 class="text-2xl font-bold text-text mb-3">
      {{ t('not_found.title') }}
    </h1>
    <p class="text-text-secondary mb-8 max-w-md">
      {{ t('not_found.description') }}
    </p>
    <BaseButton variant="primary" @click="router.push('/')">
      {{ t('not_found.go_home') }}
    </BaseButton>
  </div>
</template>
