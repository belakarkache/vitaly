import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import App from './App.vue'
import router from './router'
import 'primeicons/primeicons.css'
import '@/assets/main.css'
import { definePreset } from '@primeuix/themes'

const preset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}',
    },
    surface: {
      0: '#ffffff',
      50: '{gray.50}',
      100: '{gray.100}',
      200: '{gray.200}',
      300: '{gray.300}',
      400: '{gray.400}',
      500: '{gray.500}',
      600: '{gray.600}',
      700: '{gray.700}',
      800: '{gray.800}',
      900: '{gray.900}',
      950: '{gray.950}',
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: preset,
  },
  options: {
    darkModeSelector: 'html',
  },
})

app.mount('#app')
