<script setup lang="ts">
import { useI18n } from '@book/i18n'
import { BaseButton, BaseCard, IconLabel } from '@book/ui'

const { t } = useI18n()

// Заглушка — будет заменена ProgressStore
const hasProgress = false

const sections = [
  {
    key: 'js',
    icon: '⚡',
    color: 'text-accent',
    bg: 'bg-accent-light',
    chapters: 18,
  },
  {
    key: 'architecture',
    icon: '🏛',
    color: 'text-deep',
    bg: 'bg-deep-light',
    chapters: 8,
  },
  {
    key: 'databases',
    icon: '🗄',
    color: 'text-success',
    bg: 'bg-success-light',
    chapters: 7,
  },
  {
    key: 'devops',
    icon: '🚀',
    color: 'text-info',
    bg: 'bg-info-light',
    chapters: 6,
  },
] as const

const features = [
  { key: 'sandbox', icon: '🖥' },
  { key: 'ai', icon: '🤖' },
  { key: 'quizzes', icon: '✅' },
  { key: 'debugger', icon: '🔍' },
  { key: 'tasks', icon: '💡' },
  { key: 'depth', icon: '🔭' },
] as const
</script>

<template>
  <main class="min-h-screen bg-bg text-text">

    <!-- ==================== HERO ==================== -->
    <section class="relative overflow-hidden">
      <!-- Градиентный фон -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-light/50 to-bg pointer-events-none" />

      <div class="relative mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28 lg:py-36">
        <div class="flex flex-col lg:flex-row lg:items-center lg:gap-16">

          <!-- Текст -->
          <div class="flex-1 animate-slide-up">
            <!-- Бейдж -->
            <div class="inline-flex items-center gap-2 rounded-pill bg-primary-light px-3 py-1 mb-6">
              <span class="text-primary text-xs font-semibold tracking-wide uppercase">
                {{ t('home.badge') }}
              </span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-tight mb-6">
              {{ t('home.hero.title') }}
            </h1>

            <p class="text-lg sm:text-xl text-text-secondary max-w-xl mb-8 leading-relaxed">
              {{ t('home.hero.subtitle') }}
            </p>

            <!-- CTA кнопки -->
            <div class="flex flex-wrap gap-3 mb-10">
              <BaseButton size="lg" variant="primary">
                {{ t('home.hero.cta_start') }}
              </BaseButton>
              <BaseButton size="lg" variant="secondary">
                {{ t('home.hero.cta_browse') }}
              </BaseButton>
            </div>

            <!-- Статистика -->
            <div class="flex flex-wrap gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">39</div>
                <div class="text-sm text-text-secondary">глав</div>
              </div>
              <div class="w-px bg-border" />
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">120+</div>
                <div class="text-sm text-text-secondary">задач</div>
              </div>
              <div class="w-px bg-border" />
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">60+</div>
                <div class="text-sm text-text-secondary">квизов</div>
              </div>
            </div>
          </div>

          <!-- Декоративный код-блок -->
          <div class="hidden lg:block flex-shrink-0 w-96 animate-scale-in">
            <div class="rounded-xl border border-border bg-surface-elevated shadow-lg overflow-hidden">
              <!-- Заголовок окна -->
              <div class="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
                <span class="w-3 h-3 rounded-full bg-danger-light border border-danger/30" />
                <span class="w-3 h-3 rounded-full bg-warning-light border border-warning/30" />
                <span class="w-3 h-3 rounded-full bg-success-light border border-success/30" />
                <span class="ml-3 text-xs text-text-muted font-mono">closures.ts</span>
              </div>

              <!-- Код с ручной подсветкой -->
              <pre class="p-5 text-sm font-mono leading-relaxed overflow-x-auto"><code><span class="text-text-muted">// замыкание даёт доступ к внешним переменным</span>
<span class="text-deep">function</span> <span class="text-accent">makeCounter</span><span class="text-text-secondary">()</span> <span class="text-text-secondary">{</span>
  <span class="text-deep">let</span> <span class="text-text">count</span> <span class="text-primary">=</span> <span class="text-success">0</span>

  <span class="text-deep">return</span> <span class="text-text-secondary">() =&gt;</span> <span class="text-primary">++</span><span class="text-text">count</span>
<span class="text-text-secondary">}</span>

<span class="text-deep">const</span> <span class="text-text">counter</span> <span class="text-primary">=</span> <span class="text-accent">makeCounter</span><span class="text-text-secondary">()</span>
<span class="text-accent">counter</span><span class="text-text-secondary">()</span> <span class="text-text-muted">// 1</span>
<span class="text-accent">counter</span><span class="text-text-secondary">()</span> <span class="text-text-muted">// 2</span>
<span class="text-accent">counter</span><span class="text-text-secondary">()</span> <span class="text-text-muted">// 3</span>
</code></pre>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==================== РАЗДЕЛЫ КНИГИ ==================== -->
    <section class="mx-auto max-w-6xl px-5 sm:px-6 py-16 sm:py-20">
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-10">
        {{ t('home.sections.title') }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <BaseCard
          v-for="section in sections"
          :key="section.key"
          :padding="false"
          class="p-6 sm:p-7 group cursor-pointer transition-all duration-normal hover:-translate-y-1 hover:shadow-md"
        >
          <div class="flex items-start gap-4 sm:gap-5">
            <!-- Иконка -->
            <div :class="['flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center text-xl', section.bg]">
              {{ section.icon }}
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-text mb-1">
                {{ t(`home.sections.${section.key}.title`) }}
              </h3>
              <p class="text-sm text-text-secondary leading-relaxed mb-4">
                {{ t(`home.sections.${section.key}.description`) }}
              </p>

              <!-- Счётчик и прогресс-бар -->
              <div class="flex items-center justify-between mb-1.5">
                <IconLabel>
                  {{ t(`home.sections.${section.key}.chapters`) }}
                </IconLabel>
                <span class="text-xs text-text-muted">0%</span>
              </div>
              <div class="h-1.5 bg-surface-muted rounded-full overflow-hidden">
                <div class="h-full w-0 bg-primary rounded-full transition-all duration-slow" />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>

    <!-- ==================== ФИЧИ ==================== -->
    <section class="bg-surface py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-text mb-10">
          {{ t('home.features.title') }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="rounded-xl border border-border bg-surface-elevated p-6 shadow-sm"
          >
            <div class="text-2xl mb-3">{{ feature.icon }}</div>
            <h3 class="font-semibold text-text mb-1.5">
              {{ t(`home.features.${feature.key}.title`) }}
            </h3>
            <p class="text-sm text-text-secondary leading-relaxed">
              {{ t(`home.features.${feature.key}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== ПРОДОЛЖИТЬ ==================== -->
    <section class="mx-auto max-w-6xl px-5 sm:px-6 py-16 sm:py-20">
      <h2 class="text-2xl sm:text-3xl font-bold text-text mb-8">
        {{ t('home.continue.title') }}
      </h2>

      <!-- Пустое состояние -->
      <div
        v-if="!hasProgress"
        class="rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div class="text-4xl mb-4">📖</div>
        <p class="text-text-secondary mb-6">
          {{ t('home.continue.empty') }}
        </p>
        <BaseButton variant="primary">
          {{ t('home.continue.empty_cta') }}
        </BaseButton>
      </div>
    </section>

  </main>
</template>
