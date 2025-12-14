<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { ref } from 'vue'
const globalStore = useGlobalStore()

const emit = defineEmits<{
  (e: 'editEntry', entryDate: string): void
}>()

function formatToBR(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

const items = ref([
  {
    label: 'Deletar',
    icon: 'pi pi-trash text-red-400',
    action: 'delete',
    class: 'bg-red-400/10 hover:bg-red-400/20',
  },
  {
    label: 'Editar',
    icon: 'pi pi-pencil text-yellow-400',
    action: 'edit',
    class: 'bg-yellow-400/10 hover:bg-yellow-400/20',
  },
])

const handleEntryAction = (entryDate: string, action: string) => {
  if (action === 'delete') {
    const nextHistory = globalStore.weightHistory.filter((entry) => entry.date !== entryDate)
    globalStore.updateStoreAndStorage('weightHistory', nextHistory)
  } else if (action === 'edit') {
    emit('editEntry', entryDate)
  }
}
</script>

<template>
  <div>
    <p class="mb-2 font-semibold">Histórico de pesagens</p>

    <TransitionGroup name="fade-slide" tag="div" class="space-y-2">
      <Card v-for="entry in globalStore.weightHistory" :key="entry.date" :id="entry.date">
        <template #content>
          <div class="flex justify-between items-center">
            <div class="flex flex-col gap-1">
              <p class="text-2xl flex items-end gap-0.5">
                {{ entry.weight }} <span class="block text-base text-zinc-500"> kg</span>
              </p>
              <p class="text-zinc-400">{{ formatToBR(entry.date) }}</p>
            </div>

            <div class="relative">
              <SpeedDial
                :model="items"
                direction="left"
                :buttonProps="{ severity: 'secondary', rounded: true }"
              >
                <template #icon><i class="pi pi-ellipsis-v" /></template>
                <template #item="{ item }">
                  <button
                    class="w-full flex items-center gap-1 p-2 rounded-full cursor-pointer"
                    :class="item.class"
                    @click="handleEntryAction(entry.date, item.action)"
                  >
                    <i :class="item.icon"></i>
                  </button>
                </template>
              </SpeedDial>
            </div>
          </div>
        </template>
      </Card>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    max-height 220ms ease,
    margin 220ms ease,
    padding 220ms ease;
}
.fade-slide-move {
  transition: transform 220ms ease;
}
.fade-slide-leave-from {
  max-height: 200px;
}
.fade-slide-leave-to {
  max-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
</style>
