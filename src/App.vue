<script setup lang="ts">
import BottomMenu from './components/BottomMenu.vue'
import TopMenu from './components/TopMenu.vue'
</script>

<template>
  <TopMenu />

  <main class="container !mt-[60px] !pb-[calc(var(--nav-h)+var(--safe-bottom))]">
    <RouterView />
  </main>

  <BottomMenu />

  <!-- <div class="container m-auto p-5">Fruit icons created by Umeicon - Flaticon</div> -->
</template>

<style scoped></style>
