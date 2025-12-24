import { createRouter, createWebHistory } from 'vue-router'
import { initAuth, session } from '@/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('@/views/Authentication.vue'),
      meta: { title: 'Autenticação', guestOnly: true },
    },

    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Hoje', requiresAuth: true },
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Configurações', requiresAuth: true },
    },
    {
      path: '/historico',
      name: 'historico',
      component: () => import('@/views/HistoryView.vue'),
      meta: { title: 'Histórico', requiresAuth: true },
    },
    {
      path: '/peso',
      name: 'peso',
      component: () => import('@/views/WeightView.vue'),
      meta: { title: 'Peso', requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  await initAuth()

  const isAuthed = !!session.value
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const guestOnly = to.matched.some((r) => r.meta.guestOnly)

  const isRecovery = to.name === 'auth' && to.query.reset === '1'

  if (requiresAuth && !isAuthed) {
    return { name: 'auth', query: { redirect: to.fullPath } }
  }

  if (guestOnly && isAuthed && !isRecovery) {
    return { name: 'home' }
  }
})

export default router
