<template>
  <p>
    Hoje,
    {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
  </p>
  <p class="text-sm mt-1 text-zinc-500 flex items-center gap-1 mb-3.5">
    <i class="pi pi-info-circle text-sm"></i>
    <span>Período: 5h → 5h</span>
  </p>
</template>
