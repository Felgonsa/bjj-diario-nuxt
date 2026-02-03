<script setup lang="ts">
import { ref } from 'vue';
import type { Treino } from '../utils/types';
import TreinoDetalhes from './TreinoDetalhes.vue';

// Recebe o objeto Treino do pai
defineProps<{
  treino: Treino
}>()

// Função utilitária para formatar data (pode ficar aqui por enquanto)
const formatarData = (valor: string | Date | undefined) => {
  if (!valor) return 'Data indefinida'
  
  let dataString = typeof valor === 'string' 
    ? valor 
    : valor.toISOString().split('T')[0] ?? ''

  if (!dataString) return '--'

  // 1. Convertemos para números
  const [ano, mes, dia] = dataString.split('-').map(Number)

  // Se qualquer um deles for inválido (undefined ou 0), paramos aqui.
  if (!ano || !mes || !dia) return '--'

  // 3. Agora o TS sabe que 'ano', 'mes' e 'dia' são números seguros
  const dataUTC = new Date(Date.UTC(ano, mes - 1, dia))

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', 
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  }).format(dataUTC)
}

const expandido = ref(false)
</script>
<template>
  <div
    class="bg-ui-surface rounded-lg shadow-sm border border-ui-border transition-all duration-200 hover:shadow-md"
  >
    <div
      @click="expandido = !expandido"
      class="p-5 cursor-pointer flex justify-between items-start"
    >
      <div class="flex flex-col">
        <h3 class="font-bold text-lg text-ui-text capitalize">
          {{ formatarData(treino.data) }}
        </h3>
        <span class="text-xs text-ui-muted">{{ treino.observacoes }}</span>
        <span class="text-xs text-ui-muted">Duração: {{ treino.duracao }} min</span>
      </div>

      <div class="flex items-center gap-3">
        <span class="bg-brand-light text-brand text-xs font-bold px-2.5 py-1 rounded-full">
          {{ treino.rolas.length }} Rolas
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': expandido }"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>

    <TreinoDetalhes v-if="expandido" :observacoes="treino.observacoes" :rolas="treino.rolas" />
  </div>
</template>
