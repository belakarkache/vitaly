<script setup lang="ts">
import { useGlobalStore } from '@/stores/global'
import { computed, onMounted, ref } from 'vue'

const dailyCalories = ref(0)
const isDailyGoalModalOpen = ref(false)
const fixedValue = ref()

const selectedMethod = ref('dynamic')
const methodOptions = [
  { label: '🧮 Fazer cálculo', value: 'dynamic' },
  { label: '✏️ Definir', value: 'fixed' },
]

const activityLevelOptions = [
  { label: 'Sedentário', value: 1.2, description: 'Pouco ou nenhum exercício', icon: '🛋️' },
  {
    label: 'Levemente ativo',
    value: 1.375,
    description: 'Exercícios leves 1–3x/semana',
    icon: '🚶‍♂️',
  },
  {
    label: 'Moderadamente ativo',
    value: 1.55,
    description: 'Exercícios moderados 3–5x/semana',
    icon: '🏋️‍♂️',
  },
  {
    label: 'Altamente ativo',
    value: 1.725,
    description: 'Exercícios intensos 6–7x/semana',
    icon: '🏃‍♂️',
  },
  {
    label: 'Extremamente ativo',
    value: 1.9,
    description: 'Treinos intensos ou trabalho físico pesado',
    icon: '💪',
  },
]

const globalStore = useGlobalStore()
const userInformation = ref(globalStore.userInformation)
const dailyGoal = ref(globalStore.dailyGoal)

const handleDailyGoalModal = () => {
  isDailyGoalModalOpen.value = !isDailyGoalModalOpen.value
}

const shouldDisableConfirmButton = computed(() => {
  if (selectedMethod.value === 'fixed') {
    return !fixedValue.value || fixedValue.value <= 0
  } else if (selectedMethod.value === 'dynamic') {
    const { age, weight, height, biologicalSex, activityLevel, goal } = userInformation.value

    return !age || !weight || !height || !biologicalSex || !activityLevel || !goal
  }

  return false
})

const handleConfirmDailyGoal = () => {
  if (selectedMethod.value === 'fixed' && fixedValue.value) {
    dailyGoal.value = fixedValue.value
  } else if (selectedMethod.value === 'dynamic') {
    const { age, weight, height, biologicalSex, activityLevel, goal } = userInformation.value
    let bmr = 0
    if (biologicalSex === 'male') {
      bmr = 10 * weight! + 6.25 * height! - 5 * age! + 5
    } else if (biologicalSex === 'female') {
      bmr = 10 * weight! + 6.25 * height! - 5 * age! - 161
    }

    const tdee = bmr * (activityLevel as unknown as number)
    const dailyCaloricGoal = tdee * (goal as unknown as number)
    dailyGoal.value = Math.round(dailyCaloricGoal)
  }
  saveInformationToLocalStorage()
  handleDailyGoalModal()
}

const saveInformationToLocalStorage = () => {
  globalStore.updateStoreAndStorage('userInformation', userInformation.value)
  globalStore.updateStoreAndStorage('dailyGoal', dailyGoal.value)
}

onMounted(() => {
  const storedDailyGoal = localStorage.getItem('dailyGoal')
  const storedUserInformation = localStorage.getItem('userInformation')

  if (storedDailyGoal) {
    dailyGoal.value = parseInt(storedDailyGoal, 10)
  }

  if (storedUserInformation) {
    userInformation.value = JSON.parse(storedUserInformation)
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <Card>
      <template #content>
        <div class="flex gap-2 items-center">
          <div
            class="bg-primary-500/20 flex items-center justify-center rounded-xl p-3 w-fit h-fit"
          >
            <i class="pi pi-bullseye text-xl text-primary-500"></i>
          </div>

          <div class="flex flex-col justify-center">
            <p class="text-zinc-500 text-sm">Meta diária</p>
            <h2 class="text-xl text-white">{{ dailyGoal }} kcal</h2>
          </div>

          <Button variant="link" @click="handleDailyGoalModal" class="ml-auto">
            <i class="pi pi-pencil text-primary-500 text-sm"></i>
            <span class="font-semibold text-sm"> Alterar </span>
          </Button>
        </div>
      </template>
    </Card>
    <Card>
      <template #content>
        <div class="flex flex-col items-center justify-center gap-2">
          <div class="flex justify-center items-center relative">
            <CalorieProgressCircle
              :current="dailyCalories"
              :goal="dailyGoal"
              :size="120"
              :strokeWidth="10"
            />
          </div>

          <p class="text-sm text-zinc-500" v-if="dailyGoal - dailyCalories < dailyGoal">
            *Restam
            <span class="font-semibold text-primary-400">{{ dailyGoal - dailyCalories }} kcal</span>
          </p>
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="isDailyGoalModalOpen"
      modal
      position="bottom"
      class="max-w-md w-full"
      :draggable="false"
      :closable="false"
    >
      <template #header>
        <SelectButton
          v-model="selectedMethod"
          :options="methodOptions"
          optionLabel="label"
          optionValue="value"
          :allowEmpty="false"
          size="small"
          fluid
        />
      </template>

      <div v-if="selectedMethod === 'fixed'">
        <label class="label-form">Insira a sua meta personalizada de calorias diárias</label>

        <IconField>
          <InputIcon class="pi pi-bullseye" />
          <InputNumber
            v-model="fixedValue"
            suffix=" kcal"
            :min="0"
            :max="10000"
            size="small"
            placeholder="2000 kcal"
            :show-clear="true"
          />
        </IconField>

        <Message v-if="fixedValue && fixedValue < 1500" severity="warn" class="mt-3" size="small">
          Valores abaixo do mínimo seguro recomendado pela OMS são potencialmente prejudiciais à
          saúde. <br /><br />Recomenda-se ≥1.200 kcal/dia (mulheres) e ≥1.500 kcal/dia (homens).
          Consulte um profissional antes de seguir com restrições mais severas.
        </Message>
      </div>

      <div v-else class="flex flex-col gap-3">
        <div>
          <span class="label-form" for="biologicalSex">Sexo biológico*</span>
          <div class="flex gap-2">
            <div class="flex gap-1 items-center">
              <RadioButton
                v-model="userInformation.biologicalSex"
                inputId="biologicalSexF"
                name="biologicalSex"
                value="female"
                size="small"
              />
              <label for="biologicalSexF">Feminino</label>
            </div>

            <div class="flex gap-1 items-center">
              <RadioButton
                v-model="userInformation.biologicalSex"
                inputId="biologicalSexM"
                name="biologicalSex"
                value="male"
                size="small"
              />
              <label for="biologicalSexM">Masculino</label>
            </div>
          </div>
          <small class="text-zinc-400"
            >*Informação solicitada apenas para aplicar fórmulas metabólicas, sem relação com
            identidade de gênero.</small
          >
        </div>

        <div class="max-w-40">
          <label class="label-form" for="age"> Idade </label>
          <InputNumber
            v-model="userInformation.age"
            inputId="age"
            :min="2"
            :max="130"
            size="small"
            suffix=" anos"
            showButtons
            buttonLayout="horizontal"
            fluid
          />
        </div>

        <div class="flex gap-3">
          <div class="max-w-40">
            <label class="label-form" for="weight">Peso</label>
            <InputNumber
              v-model="userInformation.weight"
              inputId="weight"
              :min="10"
              :max="500"
              size="small"
              mode="decimal"
              suffix=" kg"
              :maxFractionDigits="2"
              fluid
            />
          </div>

          <div class="max-w-40">
            <label class="label-form" for="height">Altura</label>
            <InputNumber
              v-model="userInformation.height"
              inputId="height"
              :min="50"
              :max="250"
              size="small"
              suffix=" cm"
              fluid
            />
          </div>
        </div>

        <div class="w-full">
          <span class="label-form" for="activityLevel">Nível de atividade física</span>

          <Select
            v-model="userInformation.activityLevel"
            :options="activityLevelOptions"
            optionLabel="label"
            optionValue="value"
            size="small"
            fluid
            placeholder="Selecione o nível de atividade"
          >
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ slotProps.option.icon }}</span>
                <div>
                  <div class="font-medium">{{ slotProps.option.label }}</div>
                  <div class="text-xs text-zinc-500">{{ slotProps.option.description }}</div>
                </div>
              </div>
            </template>
          </Select>
        </div>

        <div class="w-full">
          <span class="label-form" for="goal">Objetivo</span>
          <Select
            v-model="userInformation.goal"
            :options="[
              { label: 'Perder peso', value: 0.85 },
              { label: 'Manter peso', value: 1.0 },
              { label: 'Ganhar peso', value: 1.15 },
            ]"
            optionLabel="label"
            optionValue="value"
            size="small"
            fluid
            placeholder="Selecione seu objetivo"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          variant="outlined"
          severity="secondary"
          @click="handleDailyGoalModal"
          size="small"
          fluid
        />

        <Button
          label="Confirmar"
          @click="handleConfirmDailyGoal"
          size="small"
          fluid
          :disabled="shouldDisableConfirmButton"
        />
      </template>
    </Dialog>
  </div>
</template>
