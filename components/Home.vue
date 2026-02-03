<script setup lang="ts">
import { ref } from 'vue'
import type { Treino } from '../utils/types'
import Dashboard from './Dashboard.vue'
import Header from './Header.vue'
import TreinoCard from './TreinoCard.vue'
import TreinoForm from './treinoForm.vue'

// ESTADO: Dados mockados (Mantinve os mesmos que você mandou)

const usuarioMock = ref({
  nome: 'Felipe',
  faixa: 'Azul',
  dataGraduacao: '2025-12-19', // Exemplo: data que pegou a faixa azul
})

const treinos = ref<Treino[]>([
  {
    id: '1',
    data: new Date('2026-01-26'),
    duracao: 90,
    observacoes: 'Treino focado em passagem. Gás acabou rápido.',
    rolas: [
      {
        id: 'r1',
        parceiro: 'Gabriel',
        duracao: 6,
        faixaParceiro: 'Roxa',
        finalizacoes_aplicadas: [],
        finalizacoes_sofridas: [],
      },
      {
        id: 'r2',
        parceiro: 'Matheus',
        duracao: 6,
        faixaParceiro: 'Branca',
        finalizacoes_aplicadas: ['Armlock', 'Triângulo'],
        finalizacoes_sofridas: [],
      },
    ],
  },
  {
    id: '2',
    data: new Date(),
    duracao: 60,
    observacoes: 'Treino solto meio dia.',
    rolas: [
      {
        id: 'r3',
        parceiro: 'Mestre',
        duracao: 10,
        faixaParceiro: 'Preta',
        finalizacoes_aplicadas: [],
        finalizacoes_sofridas: ['Estrangulamento', 'Chave de pé'],
      },
    ],
  },
])

const mostrarForm = ref(false)

const handleSalvarTreino = (novoTreino: Treino) => {
  // Adiciona no começo da lista (unshift) para aparecer no topo
  treinos.value.unshift(novoTreino)

  // Fecha o modal
  mostrarForm.value = false
}
</script>
<template>
  <div class="min-h-screen bg-ui-background text-ui-text pb-24">
    <Header class="mb-6" />
    <main class="max-w-4xl mx-auto px-4 space-y-8">
      <Dashboard :treinos="treinos" :usuario="usuarioMock" />

      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-ui-text">Histórico de Treinos</h3>
        <span class="text-xs text-ui-muted">{{ treinos.length }} registros</span>
      </div>

      <div v-if="treinos.length > 0" class="flex flex-col gap-6">
        <TreinoCard v-for="treino in treinos" :key="treino.id" :treino="treino" />
      </div>
    </main>

    <button
      @click="mostrarForm = true"
      class="fixed bottom-6 right-6 z-40 bg-brand hover:bg-brand-hover text-white rounded-full shadow-xl p-4 sm:px-6 sm:py-3 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2.5"
        stroke="currentColor"
        class="size-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span class="font-bold text-lg hidden sm:inline">Novo Treino</span>
    </button>

    <div v-if="mostrarForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        @click="mostrarForm = false"
      ></div>

      <div
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <div
          class="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10"
        >
          <h2 class="text-xl font-bold text-gray-800">Novo Treino</h2>
          <button
            @click="mostrarForm = false"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div class="p-5">
          <TreinoForm @close="mostrarForm = false" @save="handleSalvarTreino" />
        </div>
      </div>
    </div>
  </div>
</template>
