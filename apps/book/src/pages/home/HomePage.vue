<script setup lang="ts">
import { ref } from 'vue'
import { DeepDive, Callout, DifficultyBadge, CodeBlock, TabGroup, TabPanel, BaseButton, BaseCard } from '@book/ui'

const sampleCode = ref(`function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}`)
</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
    <div class="mx-auto max-w-3xl space-y-6">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        Learning Book
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        JS/TS, Architecture, Databases, DevOps
      </p>

      <div class="flex gap-2">
        <DifficultyBadge level="easy" />
        <DifficultyBadge level="medium" />
        <DifficultyBadge level="hard" />
      </div>

      <div class="flex gap-2">
        <BaseButton>Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="ghost">Ghost</BaseButton>
      </div>

      <Callout type="tip" title="Подсказка">
        Это пример callout-компонента с типом "tip".
      </Callout>

      <Callout type="warning" title="Внимание">
        Это пример callout-компонента с типом "warning".
      </Callout>

      <BaseCard>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Карточка</h2>
        <p class="text-gray-600 dark:text-gray-400">Пример BaseCard компонента.</p>
      </BaseCard>

      <CodeBlock :code="sampleCode" language="javascript" />

      <DeepDive title="Под капотом: замыкания в V8">
        <p>V8 создаёт объект Context для каждого scope, в котором хранятся переменные, захваченные замыканиями.</p>
      </DeepDive>

      <TabGroup :tabs="['var', 'let', 'const']">
        <TabPanel name="var">var объявляет переменную с функциональной областью видимости.</TabPanel>
        <TabPanel name="let">let создаёт блочную переменную.</TabPanel>
        <TabPanel name="const">const создаёт константу, которую нельзя переприсвоить.</TabPanel>
      </TabGroup>
    </div>
  </main>
</template>
