import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/ui',
  'packages/core',
  'packages/shared',
  'packages/i18n',
])
