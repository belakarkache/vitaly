<script setup lang="ts">
import IconCalendar from './icons/IconCalendar.vue'
import IconHome from './icons/IconHome.vue'
import IconScale from './icons/IconScale.vue'
import { useRoute } from 'vue-router'

const menuItems = [
  { label: 'Hoje', icon: IconHome, to: '/home' },
  { label: 'Peso', icon: IconScale, to: '/peso' },
  { label: 'Histórico', icon: IconCalendar, to: '/historico' },
]

const route = useRoute()

const isActive = (item: { to: string }) => {
  return route.path === item.to
}
</script>

<template>
  <div class="fixed bottom-0 left-0 right-0 z-10 bg-zinc-900 border-t-zinc-800 border-t">
    <nav class="container flex items-center justify-center py-2.5!">
      <ul class="flex w-full justify-around">
        <li v-for="item in menuItems" :key="item.label">
          <RouterLink
            :to="item.to"
            class="flex flex-col items-center justify-center gap-1 p-1 w-18 h-18 rounded-sm"
            :class="isActive(item) ? 'text-primary-400 bg-primary-300/10' : 'text-zinc-700'"
          >
            <component :is="item.icon" :size="24" />
            <span class="text-xs font-semibold">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
