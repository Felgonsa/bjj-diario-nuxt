<script setup lang="ts">
import type { TreinoFrontend, UsuarioFrontend } from '../utils/types'; // Ajuste o caminho dos tipos se necessário

// 1. Autenticação real do Google
const { data: session, status } = useAuth()

// 2. Busca de Treinos da API
const { data: response, refresh, pending } = useFetch<{ data: TreinoFrontend[], success: boolean }>('/api/treinos')
const treinos = computed(() => response.value?.data || [])

// 3. Montagem do Usuário Real
const usuarioReal = computed(() => {
  if (status.value !== 'authenticated' || !session.value?.user) return null
  
  return {
    id: (session.value.user as any).id || '',
    nome: session.value.user.name || 'Lutador',
    email: session.value.user.email || '',
    faixa: 'azul', // Mantendo a faixa azul para você, Felipe
    graus: 0,
    dataCadastro: new Date().toISOString()
  } as UsuarioFrontend
})

// 4. Lógica do Modal e Ações
const mostrarForm = ref(false)

const handleSalvarTreino = async () => {
  await refresh()
  mostrarForm.value = false
}

const excluirTreino = async (id: number) => {
  if (!confirm('Deseja excluir este treino?')) return
  try {
    await $fetch(`/api/treinos/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (error) {
    console.error('Erro ao excluir:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-900 text-white pb-24">
    <Header class="mb-6" />

    <main class="max-w-4xl mx-auto px-4 space-y-8">
      
      <template v-if="status === 'authenticated' && usuarioReal">
        
        <Dashboard :treinos="treinos" :usuario="usuarioReal" />

        <div class="flex items-center justify-between border-b border-neutral-800 pb-2">
          <h3 class="text-lg font-bold">Histórico de Treinos</h3>
          <span class="text-xs text-neutral-500">{{ treinos.length }} registros</span>
        </div>

        <div v-if="pending" class="text-center py-10 text-neutral-500">
          Carregando treinos...
        </div>
        
        <div v-else-if="treinos.length > 0" class="flex flex-col gap-6">
          <TreinoCard 
            v-for="treino in treinos" 
            :key="treino.id" 
            :treino="treino" 
            @delete="excluirTreino" 
          />
        </div>

        <div v-else class="text-center py-10 bg-neutral-800/50 rounded-xl border border-dashed border-neutral-700">
          <p class="text-neutral-400">Nenhum treino registrado. Hora de ir para o tatame!</p>
        </div>
      </template>

      <div v-else-if="status === 'loading'" class="flex flex-col justify-center items-center py-20 text-white gap-4">
        <p class="animate-pulse">Amarrando a faixa...</p>
      </div>

      <div v-else class="p-10 text-center text-white bg-neutral-800 rounded-xl">
        <p class="mb-4">O tatame está fechado. Por favor, faça login.</p>
        <NuxtLink to="/login" class="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-colors">Entrar no Diário</NuxtLink>
      </div>

    </main>

    <button
      v-if="status === 'authenticated'"
      @click="mostrarForm = true"
      class="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-xl p-4 sm:px-6 sm:py-3 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
    >
      <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <span class="font-bold text-lg hidden sm:inline">Novo Treino</span>
    </button>

    <div v-if="mostrarForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="mostrarForm = false"></div>
      <div class="relative bg-neutral-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-neutral-700">
        <div class="p-5 border-b border-neutral-700 flex justify-between items-center bg-neutral-800 sticky top-0 z-10">
          <h2 class="text-xl font-bold">Registrar Treino</h2>
          <button @click="mostrarForm = false" class="text-neutral-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div class="p-5 text-neutral-900">
          <TreinoForm @close="mostrarForm = false" @save="handleSalvarTreino" />
        </div>
      </div>
    </div>
  </div>
</template>