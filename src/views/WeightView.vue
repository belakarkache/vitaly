<script setup lang="ts">
import WeightHeader from '@/features/weight/WeightHeader.vue'
import SetNewWeight from '@/features/weight/SetNewWeight.vue'
import WeightHistory from '@/features/weight/WeightHistory.vue'
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/global'
import ProgressionChart from '@/features/weight/ProgressionChart.vue'

const showNewWeightDialog = ref(false)
const editMode = ref({ value: false, entryDate: '' })
const globalStore = useGlobalStore()

const handleEditEntry = (entryDate: string) => {
  editMode.value = { value: true, entryDate }
  showNewWeightDialog.value = true
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <WeightHeader />
    <Button label="Registrar peso" fluid @click="showNewWeightDialog = true" />
    <SetNewWeight v-model="showNewWeightDialog" :edit-mode="editMode" />
    <ProgressionChart v-if="globalStore.weightHistory.length >= 2" />
    <WeightHistory v-if="globalStore.weightHistory.length > 0" @edit-entry="handleEditEntry" />
  </div>
</template>
