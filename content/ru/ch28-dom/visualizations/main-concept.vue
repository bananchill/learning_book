<script setup lang="ts">
import { ref } from 'vue'

// Визуализация DOM-дерева
interface TreeNode {
  type: 'element' | 'text' | 'comment'
  tag?: string
  text?: string
  children?: TreeNode[]
  expanded: boolean
}

const tree = ref<TreeNode>({
  type: 'element',
  tag: 'html',
  expanded: true,
  children: [
    {
      type: 'element',
      tag: 'head',
      expanded: true,
      children: [
        {
          type: 'element',
          tag: 'title',
          expanded: true,
          children: [{ type: 'text', text: 'Моя страница', expanded: true }]
        }
      ]
    },
    {
      type: 'element',
      tag: 'body',
      expanded: true,
      children: [
        {
          type: 'element',
          tag: 'h1',
          expanded: true,
          children: [{ type: 'text', text: 'Заголовок', expanded: true }]
        },
        {
          type: 'element',
          tag: 'ul',
          expanded: true,
          children: [
            {
              type: 'element',
              tag: 'li',
              expanded: true,
              children: [{ type: 'text', text: 'Элемент 1', expanded: true }]
            },
            {
              type: 'element',
              tag: 'li',
              expanded: true,
              children: [{ type: 'text', text: 'Элемент 2', expanded: true }]
            }
          ]
        }
      ]
    }
  ]
})

const selected = ref<string | null>(null)

const nodeTypeLabel = (type: string) => ({
  element: 'Element',
  text: 'Text',
  comment: 'Comment'
})[type] || type

const nodeColor = (type: string) => ({
  element: 'text-blue-600',
  text: 'text-green-600',
  comment: 'text-gray-400'
})[type] || ''
</script>

<template>
  <div class="p-6 bg-white rounded-xl border border-gray-200 max-w-2xl mx-auto">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Структура DOM-дерева</h3>

    <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm">
      <div class="text-xs text-gray-400 mb-3">Document</div>

      <!-- Рекурсивный компонент через template recursion -->
      <template v-if="tree">
        <div class="pl-4 border-l-2 border-gray-200">
          <div
            class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
            @click="tree.expanded = !tree.expanded"
          >
            <span class="text-gray-400">{{ tree.expanded ? '▼' : '▶' }}</span>
            <span class="text-blue-600 font-bold">&lt;{{ tree.tag }}&gt;</span>
            <span class="text-xs bg-blue-100 text-blue-600 px-1 rounded">Element</span>
          </div>

          <template v-if="tree.expanded">
            <div v-for="(child1, i1) in tree.children" :key="i1" class="pl-4 border-l-2 border-gray-200">
              <div
                class="flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
                @click="child1.expanded = !child1.expanded"
              >
                <span v-if="child1.children?.length" class="text-gray-400">{{ child1.expanded ? '▼' : '▶' }}</span>
                <span v-else class="text-gray-300">—</span>
                <span v-if="child1.type === 'element'" class="text-blue-600 font-bold">&lt;{{ child1.tag }}&gt;</span>
                <span v-else class="text-green-600">"{{ child1.text }}"</span>
                <span class="text-xs px-1 rounded" :class="nodeTypeLabel(child1.type) === 'Element' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                  {{ nodeTypeLabel(child1.type) }}
                </span>
              </div>

              <template v-if="child1.expanded && child1.children">
                <div v-for="(child2, i2) in child1.children" :key="i2" class="pl-4 border-l-2 border-gray-200">
                  <div class="flex items-center gap-2 py-1 px-2">
                    <span class="text-gray-300">—</span>
                    <span v-if="child2.type === 'element'" class="text-blue-600 font-bold">&lt;{{ child2.tag }}&gt;</span>
                    <span v-else class="text-green-600">"{{ child2.text }}"</span>
                    <span class="text-xs px-1 rounded" :class="child2.type === 'element' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'">
                      {{ nodeTypeLabel(child2.type) }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>

    <div class="mt-3 flex gap-4 text-xs text-gray-500">
      <span><span class="inline-block w-3 h-3 bg-blue-100 rounded mr-1"></span>Element узел</span>
      <span><span class="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>Text узел</span>
    </div>
  </div>
</template>
