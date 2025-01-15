<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <Nav />
      </div>
    </header>
    <main class="max-w-7xl mx-auto py-6 px-4">
      <Headcoding />
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Nav from '@/components/Nav.vue';
import Headcoding from "@/components/Heading.vue"
</script>