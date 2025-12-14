<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { ref } from 'vue'

const globalStore = useGlobalStore()
const newWeightDate = ref<Date>(new Date())
const newWeight = ref<number | null>(globalStore.userInformation.weight || null)

const props = defineProps<{
  modelValue: boolean
  editMode?: {
    value: boolean
    entryDate?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

function saveNewWeightEntry() {
  if (newWeight.value === null || newWeightDate.value === null) return

  const dateStr = toLocalYYYYMMDD(newWeightDate.value)
  const entry = { date: dateStr, weight: newWeight.value }

  const history = Array.isArray(globalStore.weightHistory) ? globalStore.weightHistory : []

  const existingIndex = history.findIndex((h) => h.date === dateStr)
  let nextHistory: typeof history
  if (existingIndex >= 0) {
    nextHistory = [...history]
    nextHistory[existingIndex] = entry
  } else {
    nextHistory = [...history, entry]
  }

  const latestDate =
    nextHistory.length > 0
      ? nextHistory.map((i) => i.date).reduce((max, d) => (d > max ? d : max))
      : null

  const isLatest = !latestDate || dateStr >= latestDate

  if (isLatest) {
    globalStore.updateStoreAndStorage('userInformation', {
      ...globalStore.userInformation,
      weight: newWeight.value,
    })
  }

  nextHistory.sort((a, b) => b.date.localeCompare(a.date))
  globalStore.updateStoreAndStorage('weightHistory', nextHistory)

  emit('update:modelValue', false)
  newWeight.value = null
  newWeightDate.value = new Date()

  if (props.editMode) {
    props.editMode.value = false
    props.editMode.entryDate = ''
  }
}

function toLocalYYYYMMDD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function handleClose() {
  newWeight.value = null
  newWeightDate.value = new Date()

  if (props.editMode) {
    props.editMode.value = false
    props.editMode.entryDate = ''
  }

  emit('update:modelValue', false)
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
      <h3 class="text-lg font-medium text-white">
        {{ props.editMode?.value ? 'Editar peso' : 'Registrar novo peso' }}
      </h3>
    </template>

    <div>
      <label for="weightdate" class="block mb-1">Data do registro</label>
      <DatePicker
        v-model="newWeightDate"
        showIcon
        fluid
        iconDisplay="input"
        inputId="weightdate"
        size="small"
        :disabled="props.editMode?.value"
      />
    </div>

    <div>
      <label for="weightinput" class="block mb-1 mt-4">Peso (kg)</label>
      <InputNumber
        v-model="newWeight"
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

    <template #footer>
      <Button
        label="Cancelar"
        severity="secondary"
        outlined
        @click="handleClose"
        fluid
        size="small"
      />
      <Button
        label="Salvar"
        @click="saveNewWeightEntry"
        fluid
        size="small"
        :disabled="!newWeight || !newWeightDate"
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
