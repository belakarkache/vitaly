// main.ts
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'
import '@/assets/main.css'
import { createPinia } from 'pinia'
import { pt_BR } from 'primelocale/js/pt_BR.js'
import { initAuth } from '@/auth'
import { ToastService } from 'primevue'

async function bootstrap() {
  await initAuth()

  const pinia = createPinia()
  const app = createApp(App)

  app.use(pinia)
  app.use(router)

  app.use(PrimeVue, {
    theme: { preset: Aura },
    options: { darkModeSelector: 'html' },
    locale: pt_BR,
  })

  app.use(ToastService)

  await router.isReady()

  app.mount('#app')
}

bootstrap()
