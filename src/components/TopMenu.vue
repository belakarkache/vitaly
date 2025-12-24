<script setup lang="ts">
import { Button } from 'primevue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'
import IconLogo from './icons/IconLogo.vue'

const router = useRouter()
const toast = useToast()

const redirectToSettings = () => {
  router.push({ name: 'configuracoes' })
}

async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (!error) {
    router.push({ name: 'auth' })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao sair. Tente novamente.',
      life: 4000,
    })
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-10 bg-zinc-900">
    <div class="container flex items-center justify-between py-2.5!">
      <IconLogo :size="40" />

      <div class="flex gap-1">
        <Button
          size="small"
          icon="pi pi-cog"
          variant="text"
          aria-label="Configurações"
          @click="redirectToSettings"
        />

        <Button
          size="small"
          icon="pi pi-sign-out"
          variant="text"
          aria-label="Sair da conta"
          @click="signOut"
        />
      </div>
    </div>
  </header>
</template>
