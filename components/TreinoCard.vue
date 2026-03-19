<script setup lang="ts">
import { ref } from 'vue';
import type { Treino } from '../utils/types';
import TreinoDetalhes from './TreinoDetalhes.vue';

// Recebe o objeto Treino do pai
const props = defineProps<{
  treino: Treino
}>()


const emit = defineEmits(['delete'])

// 2. Criamos uma função simples só para confirmar antes de gritar pro pai
const confirmarExclusao = async () => {
  // Usamos a nossa utilidade global: Título, Texto e o Botão de Ação
  const querExcluir = await alertaConfirmar(
    'Excluir Treino?', 
    'Tem certeza que deseja apagar este treino? Ele sumirá do seu histórico.', 
    'Sim, excluir'
  )

  if (querExcluir) {
    // Se o usuário clicou no botão vermelho do SweetAlert, nós gritamos pro pai
    emit('delete', props.treino.id)
  }
}

const formatarTipo = (tipo: string) => {
  const mapa: Record<string, string> = {
    com_kimono: '🥋 Com Kimono',
    sem_kimono: '🩳 No-Gi',
    drills: '🔄 Apenas Drills',
    open_mat: '🥊 Open Mat'
  }
  return mapa[tipo] || tipo
}

const formatarSentimento = (sentimento: string) => {
  const mapa: Record<string, string> = {
    forte: '🔥 Voando',
    tecnico: '🧠 Técnico',
    normal: '🙂 Normal',
    cansado: '🪫 Cansado',
    destruido: '💀 Destruído'
  }
  return mapa[sentimento] || sentimento
}


// Função utilitária para formatar data (pode ficar aqui por enquanto)
const formatarData = (valor: string | Date | undefined) => {
  if (!valor) return 'Data indefinida'

  valor = new Date(valor) // Garante que seja um objeto Date

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
  <div class="bg-ui-surface rounded-lg shadow-sm border border-ui-border transition-all duration-200 hover:shadow-md">
    
    <div @click="expandido = !expandido" class="p-4 cursor-pointer flex flex-col gap-3">
      
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold text-base text-ui-text capitalize leading-tight">
            {{ formatarData(treino.data) }}
          </h3>
          <span class="text-xs text-ui-muted font-medium mt-1 inline-block">
            Duração: {{ treino.duracao }} min
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="bg-brand-light text-brand text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
            {{ treino.rolas?.length || 0 }} Rolas
          </span>
          <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': expandido }" />
        </div>
      </div>

      <div class="flex justify-between items-center mt-1">
        
        <div class="flex flex-wrap gap-2">
          <span v-if="treino.tipo" class="flex items-center gap-1 bg-gray-50 text-gray-600 text-[11px] font-semibold px-2 py-1 rounded border border-gray-200">
            {{ formatarTipo(treino.tipo) }}
          </span>
          <span v-if="treino.sentimento" class="flex items-center gap-1 bg-gray-50 text-gray-600 text-[11px] font-semibold px-2 py-1 rounded border border-gray-200">
            {{ formatarSentimento(treino.sentimento) }}
          </span>
        </div>

        <button @click.stop="confirmarExclusao" class="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50" title="Excluir treino">
          <Icon name="heroicons:trash" class="w-4 h-4" />
        </button>
        
      </div>
    </div>

    <div v-if="expandido" class="px-4 pb-4 border-t border-gray-100 pt-4">
      
      <div class="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm bg-gray-50/50 p-3 rounded-md border border-gray-100">
        <div v-if="treino.professor">
          <span class="font-semibold text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Professor</span>
          <span class="text-gray-700">{{ treino.professor }}</span>
        </div>
        
        <div v-if="treino.tecnicasAprendidas">
          <span class="font-semibold text-gray-400 block text-[10px] uppercase tracking-wider mb-0.5">Técnicas Focadas</span>
          <span class="text-gray-700">{{ treino.tecnicasAprendidas }}</span>
        </div>
        
        <div v-if="treino.observacoes" class="sm:col-span-2 mt-2 pt-2 border-t border-gray-100">
          <span class="font-semibold text-gray-400 block text-[10px] uppercase tracking-wider mb-1">Observações Pessoais</span>
          <span class="text-gray-600 italic text-xs">"{{ treino.observacoes }}"</span>
        </div>
      </div>

      <TreinoDetalhes :observacoes="treino.observacoes ?? ''" :rolas="treino.rolas || []" />
      
    </div>
  </div>
</template>