<script setup lang="ts">
import { computed, ref } from 'vue'
import SetWeightGoal from '@/features/weight/SetWeightGoal.vue'
import { useGlobalStore } from '@/stores/global'

const setWeightGoalModal = ref(false)
const globalStore = useGlobalStore()

const weightDifferenceFromLast = computed(() => {
  if (globalStore.weightHistory[0]?.weight && globalStore.weightHistory[1]?.weight) {
    const diff = globalStore.weightHistory[0].weight - globalStore.weightHistory[1].weight
    return Number(diff.toFixed(1))
  }

  return 0
})
</script>

<template>
  <Card>
    <template #content>
      <div class="md:p-4 flex flex-col items-center justify-center gap-5">
        <div class="flex flex-col gap-2">
          <div class="flex gap-1 justify-center items-end">
            <p class="text-5xl text-white">
              {{ globalStore.userInformation.weight ? globalStore.userInformation.weight : '-' }}
            </p>
            <span class="text-3xl font-light opacity-70">kg</span>
          </div>

          <div v-if="globalStore.weightHistory.length > 1">
            <div class="text-sm text-primary-500">
              <i
                class="pi pi-arrow-up text-primary-500 text-xs!"
                v-if="weightDifferenceFromLast > 0"
              />
              <i class="pi pi-arrow-down text-primary-500 text-xs!" v-else />
              {{ weightDifferenceFromLast }}
              kg desde o último registro
            </div>
          </div>
        </div>

        <button
          class="bg-zinc-800/60 px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer"
          @click="setWeightGoalModal = true"
        >
          <i class="pi pi-bullseye text-primary-500 text-xs"></i>
          <div v-if="globalStore.weightGoal">
            <span class="text-white/50 mr-1">Meta:</span>
            <span class="font-semibold text-white/80"> {{ globalStore.weightGoal }} kg</span>
            •
            <span class="text-white/50 mr-1">Faltam: </span>
            <span class="font-semibold text-white/80">
              {{
                (
                  Number(globalStore.weightGoal) - Number(globalStore.userInformation.weight || 0)
                ).toFixed(1)
              }}
              kg
            </span>
          </div>

          <div v-else class="text-sm text-white/80">Defina sua meta de peso</div>
        </button>
      </div>
    </template>
  </Card>

  <SetWeightGoal v-model="setWeightGoalModal" />
</template>
