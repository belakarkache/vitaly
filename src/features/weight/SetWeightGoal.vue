<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { ref } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const selectedMethod = ref('fixed')
const methodOptions = [
  { label: '🧮 Fazer cálculo', value: 'dynamic' },
  { label: '✏️ Definir', value: 'fixed' },
]
const selectedWeight = ref<number | null>(null)
const globalStore = useGlobalStore()

const saveSelectedWeight = () => {
  if (selectedWeight.value !== null) {
    globalStore.updateStoreAndStorage('weightGoal', selectedWeight.value)
    emit('update:modelValue', false)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="props.modelValue"
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
      <p class="text-center mb-2 text-white/80">Quanto você quer pesar? (kg)</p>
      <InputNumber
        v-model="selectedWeight"
        showButtons
        buttonLayout="horizontal"
        :step="1"
        fluid
        :max="500"
        :maxFractionDigits="1"
        suffix=" kg"
        :min="0"
      >
        <template #incrementicon>
          <span class="pi pi-plus" />
        </template>
        <template #decrementicon>
          <span class="pi pi-minus" />
        </template>
      </InputNumber>
    </div>

    <div v-else-if="selectedMethod === 'dynamic'">
      <p>Calcule o peso recomendado de acordo com o IMC</p>
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        variant="outlined"
        severity="secondary"
        @click="emit('update:modelValue', false)"
        size="small"
        fluid
      />

      <Button
        label="Confirmar"
        @click="saveSelectedWeight"
        size="small"
        fluid
        :disabled="selectedWeight === null"
      />
    </template>
  </Dialog>
</template>

<style scoped>
:deep(.p-inputnumber) {
  .p-inputnumber-input {
    text-align: center;
    font-size: 62px;
  }
}
</style>
