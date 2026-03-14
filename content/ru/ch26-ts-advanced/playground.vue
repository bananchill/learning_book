<script setup lang="ts">
// Песочница для продвинутых типов TypeScript
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg">
    <p class="text-gray-600 text-sm">
      Поэкспериментируйте с Mapped Types, Conditional Types и Template Literal Types.
    </p>
    <pre class="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
// Попробуйте: создайте свой Utility Type
type MyPick&lt;T, K extends keyof T&gt; = {
  [P in K]: T[P]
}

interface User {
  id: number
  name: string
  email: string
  password: string
}

type PublicUser = MyPick&lt;User, 'id' | 'name' | 'email'&gt;
// { id: number, name: string, email: string }</pre>
  </div>
</template>
