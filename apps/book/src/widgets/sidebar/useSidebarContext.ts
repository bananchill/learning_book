import { provide, inject, type InjectionKey, type Ref } from 'vue'

interface SidebarContext {
  sectionId: Ref<string>
  subsectionId: Ref<string>
  activeChapterId: Ref<string | undefined>
}

const SIDEBAR_KEY: InjectionKey<SidebarContext> = Symbol('sidebar-context')

export function provideSidebarContext(ctx: SidebarContext) {
  provide(SIDEBAR_KEY, ctx)
}

export function useSidebarContext(): SidebarContext {
  const ctx = inject(SIDEBAR_KEY)
  if (!ctx) throw new Error('useSidebarContext must be used inside a sidebar provider')
  return ctx
}
