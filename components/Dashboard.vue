<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useEstatisticas } from '../composables/useEstatisticas';
import type { TreinoFrontend, UsuarioFrontend } from '../utils/types';

const props = defineProps<{
  treinos: TreinoFrontend[]
  usuario: UsuarioFrontend
}>()

const { treinos } = toRefs(props)
const stats = useEstatisticas(treinos)

// 1. Puxamos a sessão do Google para pegar a sua foto real
const { data: session } = useAuth()

// 2. Fundimos os dados do Banco (NeonDB) com os dados do Google
const perfil = computed(() => {
  return {
    nome: session.value?.user?.name || props.usuario.nome,
    avatar: session.value?.user?.image || null,
    iniciais: (session.value?.user?.name || props.usuario.nome).substring(0, 2).toUpperCase(),
    faixa: props.usuario.faixa || 'Branca',
    dataCadastro: props.usuario.dataCadastro,
    dataUltimaGraduacao: props.usuario.dataUltimaGraduacao
  
  }
})

// 3. Calculando dias na faixa com segurança
const diasNaFaixa = () => {
  if (!perfil.value.dataCadastro) return 0;
  const inicio = new Date(perfil.value.dataCadastro)
  const hoje = new Date()
  const diffTime = Math.abs(hoje.getTime() - inicio.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>

<template>
  <div class="space-y-6">

    <div
      class="bg-white rounded-xl p-6 shadow-sm border border-ui-border flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">

      <img v-if="perfil.avatar" :src="perfil.avatar" alt="Foto de Perfil"
        class="h-20 w-20 rounded-full border-4 border-gray-50 object-cover shadow-sm" />
      <div v-else
        class="h-20 w-20 rounded-full bg-brand text-white flex items-center justify-center text-2xl font-bold border-4 border-gray-50 shadow-sm">
        {{ perfil.iniciais }}
      </div>

      <div class="flex-1 flex flex-col justify-center">
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">{{ perfil.nome }}</h2>

        <div class="flex flex-col items-center sm:items-start mt-2">
          <img :src="'/images/faixas/' + usuario.faixa.toLowerCase() + '.png'" :alt="'Icone da Faixa ' + usuario.faixa"
            class="w-16 h-auto drop-shadow-sm" />
        </div>
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
          <span
            class="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider border border-blue-200">
            Faixa {{ perfil.faixa }}
          </span>

        </div>
      </div>
      <span class="text-xs text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
        Graduado há <b class="text-gray-700">{{ diasNaFaixa() }} dias</b>
      </span>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-ui-border shadow-sm">
        <p class="text-xs text-ui-muted font-bold uppercase">Treinos</p>
        <p class="text-3xl font-bold text-ui-text mt-1">{{ stats.totalTreinos }}</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-ui-border shadow-sm">
        <p class="text-xs text-ui-muted font-bold uppercase">Horas de Tatame</p>
        <p class="text-3xl font-bold text-ui-text mt-1">{{ stats.horasTotais }}h</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-ui-border shadow-sm">
        <p class="text-xs text-green-700 font-bold uppercase">Finalizações (Feitas)</p>
        <p class="text-3xl font-bold text-green-700 mt-1">{{ stats.totalFinalizacoesFeitas }}</p>
      </div>

      <div class="bg-white p-4 rounded-xl border border-ui-border shadow-sm">
        <p class="text-xs text-red-700 font-bold uppercase">Finalizações (Tomadas)</p>
        <p class="text-3xl font-bold text-red-700 mt-1">{{ stats.totalFinalizacoesTomadas }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white p-5 rounded-xl border border-ui-border shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm text-ui-muted mb-1">Golpe mais forte</p>
          <p class="text-lg font-bold text-green-700">{{ stats.golpeMaisForte }}</p>
        </div>
        <div class="p-3 bg-green-100 text-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-ui-border shadow-sm flex items-center justify-between">
        <div>
          <p class="text-sm text-ui-muted mb-1">O que mais pega você</p>
          <p class="text-lg font-bold text-red-700">{{ stats.pontoFraco }}</p>
        </div>
        <div class="p-3 bg-red-100 text-red-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
      </div>
    </div>

  </div>
</template>