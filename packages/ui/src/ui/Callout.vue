<script setup lang="ts">
type CalloutType = 'info' | 'tip' | 'warning' | 'danger'

defineProps<{
  type?: CalloutType
  title?: string
}>()

const styles: Record<CalloutType, { border: string; bg: string; icon: string; titleColor: string }> = {
  info: {
    border: 'border-info',
    bg: 'bg-info-light',
    icon: 'i',
    titleColor: 'text-info-text',
  },
  tip: {
    border: 'border-success',
    bg: 'bg-success-light',
    icon: '!',
    titleColor: 'text-success-text',
  },
  warning: {
    border: 'border-warning',
    bg: 'bg-warning-light',
    icon: '!',
    titleColor: 'text-warning-text',
  },
  danger: {
    border: 'border-danger',
    bg: 'bg-danger-light',
    icon: '!',
    titleColor: 'text-danger-text',
  },
}

const iconBg: Record<CalloutType, string> = {
  info: 'bg-info text-white',
  tip: 'bg-success text-white',
  warning: 'bg-warning text-white',
  danger: 'bg-danger text-white',
}
</script>

<template>
  <div
    :class="[
      'my-4 flex gap-3 rounded-lg border-l-4 p-4',
      styles[type ?? 'info'].border,
      styles[type ?? 'info'].bg,
    ]"
    role="note"
  >
    <div
      :class="[
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5',
        iconBg[type ?? 'info'],
      ]"
      aria-hidden="true"
    >
      {{ styles[type ?? 'info'].icon }}
    </div>
    <div class="min-w-0">
      <div v-if="title" :class="['mb-1 font-semibold', styles[type ?? 'info'].titleColor]">
        {{ title }}
      </div>
      <div class="text-sm text-text-secondary">
        <slot />
      </div>
    </div>
  </div>
</template>
