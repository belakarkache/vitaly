<script setup lang="ts">
import DailyCaloriesCalculator from '@/components/DailyCaloriesCalculator.vue'
import { computed, ref } from 'vue'

const dailyGoal = ref(2000)
const dailyCalories = ref(0)
const isDailyGoalModalOpen = ref(false)
const fixedValue = ref(2000)

const selectedMethod = ref('dynamic')
const methodOptions = [
  { label: '🧮 Fazer cálculo', value: 'dynamic' },
  { label: '✏️ Definir manualmente', value: 'fixed' },
]

const handleDailyGoalModal = () => {
  isDailyGoalModalOpen.value = !isDailyGoalModalOpen.value
}

const shouldDisableConfirmButton = computed(() => {
  if (selectedMethod.value === 'fixed') {
    return fixedValue.value <= 0
  }

  return false
})
</script>

<template>
  <Card>
    <template #title>
      <p class="text-base font-medium text-center">Meta diária</p>
    </template>
    <template #content>
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="flex justify-center items-center relative">
          <Knob
            v-model="dailyCalories"
            readonly
            :stroke-width="8"
            :size="150"
            :max="dailyGoal"
            :show-value="false"
          />

          <div class="absolute flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-primary-400">{{ dailyCalories }}</span>
            <span class="text-sm text-zinc-500">de {{ dailyGoal }} kcal</span>
          </div>
        </div>

        <Button
          label="Definir meta calórica diária"
          variant="outlined"
          severity="contrast"
          @click="handleDailyGoalModal"
          class="w-full mt-4"
        />
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
      <label class="mb-2 block text-sm font-medium text-zinc-400"
        >Insira a sua meta personalizada de calorias diárias</label
      >

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

    <div v-else></div>

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
        @click="handleDailyGoalModal"
        size="small"
        fluid
        :disabled="shouldDisableConfirmButton"
      />
    </template>
  </Dialog>
</template>
