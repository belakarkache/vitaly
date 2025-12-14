<script setup lang="ts">
import BottomMenu from './components/BottomMenu.vue'
import TopMenu from './components/TopMenu.vue'
</script>

<template>
  <TopMenu />

  <main class="container mt-15! pb-30!">
    <RouterView />
  </main>

  <BottomMenu />
</template>

<style scoped></style>
