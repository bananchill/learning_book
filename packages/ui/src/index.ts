// @book/ui — переиспользуемые UI-компоненты

// Базовые компоненты
export { default as BaseButton } from './ui/BaseButton.vue'
export { default as BaseCard } from './ui/BaseCard.vue'
export { default as BaseModal } from './ui/BaseModal.vue'
export { default as IconLabel } from './ui/IconLabel.vue'

// Feature компоненты
export { default as DeepDive } from './ui/DeepDive.vue'
export { default as Callout } from './ui/Callout.vue'
export { default as DifficultyBadge } from './ui/DifficultyBadge.vue'
export { default as LevelBadge } from './ui/LevelBadge.vue'
export { default as CrossLink } from './ui/CrossLink.vue'
export { default as CheatsheetModal } from './ui/CheatsheetModal.vue'
export { default as CodeBlock } from './ui/CodeBlock.vue'
export { default as TabGroup } from './ui/TabGroup.vue'
export { default as TabPanel } from './ui/TabPanel.vue'

// Composables
export { useCollapsible } from './lib/useCollapsible'
export { useCopyCode } from './lib/useCopyCode'
export { useHighlight } from './lib/useHighlight'

// Типы
export type { CalloutType, ButtonVariant, ButtonSize } from './types/common'
