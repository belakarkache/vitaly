import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Hoje' },
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Configurações' },
    },
    {
      path: '/historico',
      name: 'historico',
      component: () => import('@/views/HistoryView.vue'),
      meta: { title: 'Histórico' },
    },
    {
      path: '/peso',
      name: 'peso',
      component: () => import('@/views/WeightView.vue'),
      meta: { title: 'Peso' },
    },
  ],
})

export default router
