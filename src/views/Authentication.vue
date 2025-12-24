<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'

import AuthForm from '@/features/auth/AuthForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const authOptions = ref<Array<'entrar' | 'cadastrar'>>(['entrar', 'cadastrar'])
const selectedOption = ref<'entrar' | 'cadastrar'>(authOptions.value[0] || 'entrar')

const isResetOpen = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const isResetLoading = ref(false)

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)

const resetPasswordRules = computed(() => {
  const rules: string[] = []
  if (!newPassword.value) return rules

  if (newPassword.value.length < 6) rules.push('Mínimo de 6 caracteres')
  if (!/[A-Za-z]/.test(newPassword.value)) rules.push('Inclua pelo menos uma letra')
  if (!/\d/.test(newPassword.value)) rules.push('Inclua pelo menos um número')

  return rules
})

const canSubmitReset = computed(() => {
  return (
    !!newPassword.value &&
    !!confirmPassword.value &&
    passwordsMatch.value &&
    resetPasswordRules.value.length === 0
  )
})

function syncResetModalWithRoute() {
  const shouldOpen = route.query.reset === '1'
  isResetOpen.value = shouldOpen

  if (shouldOpen) {
    selectedOption.value = 'entrar'
  }
}

onMounted(() => {
  document.getElementById('app')?.classList.add('!overflow-hidden')
  syncResetModalWithRoute()
})

onUnmounted(() => {
  document.getElementById('app')?.classList.remove('!overflow-hidden')
})

watch(() => route.query.reset, syncResetModalWithRoute)

async function submitNewPassword() {
  if (!canSubmitReset.value) return

  isResetLoading.value = true
  const { error } = await supabase.auth.updateUser({ password: newPassword.value })
  isResetLoading.value = false

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Link inválido ou expirado',
      detail: 'Solicite um novo link para redefinir sua senha.',
      life: 6000,
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Senha atualizada',
    detail: 'Agora você pode entrar com sua nova senha.',
    life: 5000,
  })

  await supabase.auth.signOut()

  isResetOpen.value = false
  newPassword.value = ''
  confirmPassword.value = ''
  await router.replace({ name: 'auth' })
}
</script>

<template>
  <div class="flex flex-col justify-center items-center h-full">
    <div class="flex gap-2 items-center">
      <IconLogo :size="40" />
      <p class="text-2xl font-semibold text-white">Vitaly</p>
    </div>

    <p class="text-white/50 text-sm mb-4">Gerenciamento de calorias e peso</p>
    <Card class="w-full">
      <template #content>
        <AuthForm
          :key="selectedOption"
          :type="selectedOption"
          @change-type="(authType) => (selectedOption = authType)"
        />
      </template>

      <template #footer>
        <div class="flex gap-1 mt-4">
          <div v-if="selectedOption === 'entrar'" class="flex gap-1 items-center">
            <p class="text-sm text-white/50">Não tem uma conta?</p>
            <button
              @click="selectedOption = 'cadastrar'"
              class="text-primary-500 text-sm hover:underline cursor-pointer font-semibold"
            >
              Cadastrar
            </button>
          </div>

          <div v-else class="flex gap-1 items-center">
            <p class="text-sm text-white/50">Já tem uma conta?</p>
            <button
              @click="selectedOption = 'entrar'"
              class="text-primary-500 text-sm hover:underline cursor-pointer font-semibold"
            >
              Entrar
            </button>
          </div>
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="isResetOpen"
      modal
      position="bottom"
      header="Redefinir senha"
      :draggable="false"
      class="max-w-md w-full"
      @hide="router.replace({ name: 'auth' })"
    >
      <div class="flex flex-col gap-3">
        <p class="text-white/60 text-sm">Crie uma nova senha para sua conta.</p>

        <div>
          <label class="block mb-1 text-white/70 text-sm">Nova senha</label>
          <Password v-model="newPassword" toggleMask :feedback="false" fluid />
        </div>

        <div>
          <label class="block mb-1 text-white/70 text-sm">Confirmar nova senha</label>
          <Password v-model="confirmPassword" toggleMask :feedback="false" fluid />
          <small v-if="confirmPassword && !passwordsMatch" class="text-red-400">
            As senhas não coincidem.
          </small>
        </div>

        <ul v-if="resetPasswordRules.length" class="mt-1 text-white/70 text-sm">
          <li v-for="rule in resetPasswordRules" :key="rule">
            <i class="pi pi-chevron-right text-[10px]!"></i>
            {{ rule }}
          </li>
        </ul>

        <Button
          label="Salvar nova senha"
          class="w-full mt-2"
          icon="pi pi-check"
          :disabled="!canSubmitReset"
          :loading="isResetLoading"
          @click="submitNewPassword"
        />
      </div>
    </Dialog>
  </div>
</template>
