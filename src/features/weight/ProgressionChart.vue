<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'

const globalStore = useGlobalStore()

function formatDDMM(dateStr: string) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}`
}

const historyAsc = computed(() =>
  [...globalStore.weightHistory].sort((a, b) => a.date.localeCompare(b.date)),
)

const chartData = computed(() => {
  const labels = historyAsc.value.map((e) => formatDDMM(e.date))
  const data = historyAsc.value.map((e) => e.weight)

  return {
    labels,
    datasets: [
      {
        label: 'Peso (kg)',
        data,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderColor: '#34d399',
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.parsed.y} kg`,
      },
    },
  },
}))
</script>

<template>
  <div class="bg-zinc-900 p-5 rounded-lg">
    <p class="mb-4 font-semibold">Evolução</p>
    <Chart type="line" :data="chartData" :options="chartOptions" />
  </div>
</template>
