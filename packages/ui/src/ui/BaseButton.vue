<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}>()

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-text-inverse hover:bg-primary-hover shadow-xs',
  secondary: 'bg-surface-muted text-text border-border border hover:bg-surface-inset',
  ghost: 'bg-transparent text-text-secondary hover:bg-surface-muted',
  danger: 'bg-danger text-text-inverse hover:bg-danger-hover shadow-xs',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}
</script>

<template>
  <button
    v-bind="$attrs"
    :class="[
      'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-normal focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2',
      variantClasses[variant ?? 'primary'],
      sizeClasses[size ?? 'md'],
      disabled && 'opacity-50 cursor-not-allowed',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
