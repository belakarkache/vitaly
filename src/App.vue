<script setup lang="ts">
import { computed } from 'vue'
import { session } from '@/auth'

import BottomMenu from './components/BottomMenu.vue'
import TopMenu from './components/TopMenu.vue'

const isLogged = computed(() => !!session.value)
</script>

<template>
  <TopMenu v-if="isLogged" />

  <main class="container h-full" :class="{ 'mt-15! pb-30!': isLogged }">
    <Toast position="bottom-center" />
    <RouterView />
  </main>

  <BottomMenu v-if="isLogged" />
</template>
