<script setup lang="ts">
import { computed, ref } from 'vue'
import { supabase } from '@/supabase'
import { useToast } from 'primevue/usetoast'

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const toast = useToast()
const isPasswordResetModalOpen = ref(false)

const props = defineProps<{
  type: string
}>()

const emit = defineEmits<{
  (e: 'change-type', value: 'entrar' | 'cadastrar'): void
}>()

const disableAction = computed(() => {
  return !email.value || !password.value || passwordRules.value.length > 0
})

const authAction = async () => {
  if (props.type === 'cadastrar') {
    isLoading.value = true

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (!error) {
      if (data.session) {
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
        await router.push(redirect ?? '/home')
      } else {
        emit('change-type', 'entrar')
        password.value = ''
        toast.add({
          severity: 'success',
          summary: 'Cadastro realizado',
          detail: 'Confira seu e-mail para confirmar a conta.',
          life: 4000,
        })
      }
    }

    isLoading.value = false

    if (error && error.message === 'User already registered') {
      toast.add({
        severity: 'info',
        summary: 'Usuário já cadastrado',
        detail: 'Tente entrar com seu email ou recuperar sua senha.',
        life: 4000,
      })

      password.value = ''
      emit('change-type', 'entrar')
    } else if (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao cadastrar. Tente novamente.',
        life: 4000,
      })
    } else {
      toast.add({
        severity: 'success',
        summary: 'Cadastro realizado',
        life: 4000,
      })
    }
  } else {
    isLoading.value = true

    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    isLoading.value = false

    if (error) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email ou senha inválidos. Tente novamente.',
        life: 4000,
      })

      password.value = ''
      return
    }

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null

    await router.push(redirect ?? '/home')
  }
}

const passwordRules = computed(() => {
  if (props.type === 'entrar') return []

  const rules: string[] = []

  if (password.value) {
    if (password.value.length < 6) {
      rules.push('Mínimo de 6 caracteres')
    }

    if (!/[A-Za-z]/.test(password.value)) {
      rules.push('Inclua pelo menos uma letra')
    }

    if (!/\d/.test(password.value)) {
      rules.push('Inclua pelo menos um número')
    }
  }
  return rules
})

const resetPassword = async () => {
  isLoading.value = true

  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/?reset=1`,
  })

  if (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao recuperar a senha. Tente novamente.',
      life: 6000,
    })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Senha recuperada',
      detail:
        'Se tiver uma conta com esse email, você receberá um e-mail para recuperar sua senha.',
      life: 6000,
    })
  }

  isLoading.value = false
  isPasswordResetModalOpen.value = false
  email.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      <label for="email" class="block mb-1 text-white/70">Email</label>

      <IconField>
        <InputIcon class="pi pi-at" />
        <InputText v-model="email" id="email" autocomplete="email" fluid />
      </IconField>
    </div>

    <div>
      <label for="password" class="block mb-1 text-white/70">Senha</label>

      <IconField>
        <InputIcon class="pi pi-lock" />
        <Password v-model="password" toggleMask input-id="password" fluid :feedback="false" />
      </IconField>

      <ul v-if="props.type === 'cadastrar'" class="mt-4 text-white/70 text-sm">
        <li v-for="rule in passwordRules" :key="rule">
          <i class="pi pi-chevron-right text-[10px]!"></i>
          {{ rule }}
        </li>
      </ul>
    </div>

    <div v-if="props.type === 'entrar'" class="flex justify-end">
      <Button label="Esqueci minha senha" variant="link" @click="isPasswordResetModalOpen = true" />
    </div>

    <div>
      <Button
        :label="props.type === 'cadastrar' ? 'Cadastrar' : 'Entrar'"
        class="w-full"
        :icon="props.type === 'cadastrar' ? 'pi pi-user-plus' : 'pi pi-sign-in'"
        fluid
        :disabled="disableAction"
        :loading="isLoading"
        @click="authAction"
      />
    </div>

    <Dialog
      v-model:visible="isPasswordResetModalOpen"
      modal
      position="bottom"
      class="max-w-md w-full"
      :draggable="false"
      :closable="false"
    >
      <template #header>
        <div class="flex flex-col gap-1">
          <h3 class="text-lg font-medium text-white">Esqueceu sua senha?</h3>
          <p class="text-sm text-white/70">
            Enviaremos um link de recuperação de senha para o seu email.
          </p>
        </div>
      </template>

      <div>
        <label for="recover-email" class="block mb-1 text-white/70">Email</label>
        <IconField>
          <InputIcon class="pi pi-at" />
          <InputText v-model="email" id="recover-email" autocomplete="email" fluid />
        </IconField>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          variant="outlined"
          severity="secondary"
          @click="isPasswordResetModalOpen = false"
          fluid
          size="small"
        />
        <Button
          label="Recuperar senha"
          @click="resetPassword"
          fluid
          size="small"
          :disabled="!email"
          :loading="isLoading"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.p-inputtext,
.p-password {
  --p-inputtext-placeholder-color: rgba(255, 255, 255, 0.3);
}
</style>
