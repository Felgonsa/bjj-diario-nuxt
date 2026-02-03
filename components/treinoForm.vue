<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  LISTA_GOLPES,
  LISTA_POSICOES,
  OPCOES_FAIXA,
  type FaixaJiuJitsu,
  type Rola,
  type Treino,
} from '../utils/types'
import InputAutoComplete from './InputAutoComplete.vue'

// Emits para fechar o modal ou salvar o treino
const emit = defineEmits(['close', 'save'])

// ESTADO: Controle dos Passos
const passoAtual = ref(1) // 1 = Geral, 2 = Rolas

const getDataHojeLocal = () => {
  const hoje = new Date()
  const offset = hoje.getTimezoneOffset()
  // Ajusta o fuso na marra antes de converter
  const hojeLocal = new Date(hoje.getTime() - (offset * 60 * 1000))
  return hojeLocal.toISOString().split('T')[0]
}




// ESTADO: O Treino sendo criado
const form = reactive({
  data: getDataHojeLocal(), // Hoje (YYYY-MM-DD)
  duracao: 60,
  observacoes: '',
  rolas: [] as Rola[],
})

console.log(form.data);


// ESTADO: Rola Temporário (O que está sendo digitado agora)
const rolaTemp = reactive({
  parceiro: '',
  faixaParceiro: 'Branca' as FaixaJiuJitsu,
  duracao: 5,
  finalizacoes_aplicadas: [] as string[], // Lista de strings
  finalizacoes_sofridas: [] as string[],
  novaAplicada: '', // Input auxiliar
  novaSofrida: '', // Input auxiliar
})

// --- AÇÕES DO FORMULÁRIO ---

// Adicionar finalização na lista temporária
const addFinalizacao = (tipo: 'aplicada' | 'sofrida', golpe: string) => {
  if (tipo === 'aplicada') rolaTemp.finalizacoes_aplicadas.push(golpe)
  if (tipo === 'sofrida') rolaTemp.finalizacoes_sofridas.push(golpe)
}

const removerFinalizacao = (tipo: 'aplicada' | 'sofrida', index: number) => {
  if (tipo === 'aplicada') rolaTemp.finalizacoes_aplicadas.splice(index, 1)
  if (tipo === 'sofrida') rolaTemp.finalizacoes_sofridas.splice(index, 1)
}

// Confirmar o Rola atual e limpar para o próximo
const confirmarRola = () => {
  if (!rolaTemp.parceiro) return alert('Diga o nome do parceiro!')

  form.rolas.push({
    id: crypto.randomUUID(), // Gera ID único
    parceiro: rolaTemp.parceiro,
    faixaParceiro: rolaTemp.faixaParceiro,
    duracao: rolaTemp.duracao,
    finalizacoes_aplicadas: [...rolaTemp.finalizacoes_aplicadas],
    finalizacoes_sofridas: [...rolaTemp.finalizacoes_sofridas],
  })

  // Resetar formulário do rola
  rolaTemp.parceiro = ''
  rolaTemp.faixaParceiro = 'Branca'
  rolaTemp.finalizacoes_aplicadas = []
  rolaTemp.finalizacoes_sofridas = []
  rolaTemp.novaAplicada = ''
  rolaTemp.novaSofrida = ''
}

// Estado temporário para o conjunto Golpe + Posição
const finalizacaoTemp = reactive({
  golpe: '',
  posicao: '',
})

// Finalizar tudo
const addComboFinalizacao = (tipo: 'aplicada' | 'sofrida') => {
  if (!finalizacaoTemp.golpe || !finalizacaoTemp.posicao) {
    return alert('Selecione o golpe e a posição!')
  }

  // Cria uma string formatada: "Armlock (Guarda Fechada)"
  const textoFinal = `${finalizacaoTemp.golpe} (${finalizacaoTemp.posicao})`

  if (tipo === 'aplicada') rolaTemp.finalizacoes_aplicadas.push(textoFinal)
  if (tipo === 'sofrida') rolaTemp.finalizacoes_sofridas.push(textoFinal)

  // Limpa os inputs
  finalizacaoTemp.golpe = ''
  finalizacaoTemp.posicao = ''
}

const salvarTreino = () => {
  if (rolaTemp.parceiro && rolaTemp.parceiro.trim() !== '') {
    // Empurra o que estava digitado para a lista oficial
    form.rolas.push({
      id: crypto.randomUUID(),
      parceiro: rolaTemp.parceiro,
      faixaParceiro: rolaTemp.faixaParceiro,
      duracao: rolaTemp.duracao,
      finalizacoes_aplicadas: [...rolaTemp.finalizacoes_aplicadas],
      finalizacoes_sofridas: [...rolaTemp.finalizacoes_sofridas],
    })
  }
  const novoTreino: Treino = {
    id: crypto.randomUUID(),

    // ANTES: data: form.data,
    // DEPOIS (Com a correção):
    data: form.data as string,

    duracao: form.duracao,
    observacoes: form.observacoes,
    rolas: form.rolas,
  }
  emit('save', novoTreino)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div v-if="passoAtual === 1" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-ui-text mb-1">Data</label>
        <input
          type="date"
          v-model="form.data"
          class="w-full border border-ui-border rounded-lg p-2 bg-ui-background focus:ring-2 focus:ring-brand outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-ui-text mb-1">Duração (min)</label>
        <input
          type="number"
          v-model="form.duracao"
          class="w-full border border-ui-border rounded-lg p-2 bg-ui-background focus:ring-2 focus:ring-brand outline-none"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-ui-text mb-1">Como foi o treino? (Obs)</label>
        <textarea
          v-model="form.observacoes"
          rows="3"
          placeholder="Focamos em passagem, estava muito quente..."
          class="w-full border border-ui-border rounded-lg p-2 bg-ui-background focus:ring-2 focus:ring-brand outline-none resize-none"
        ></textarea>
      </div>

      <div class="pt-4 flex gap-3">
        <button
          @click="salvarTreino"
          class="flex-1 py-3 text-ui-muted font-medium hover:bg-gray-100 rounded-lg"
        >
          Sem Rola (Salvar)
        </button>
        <button
          @click="passoAtual = 2"
          class="flex-1 py-3 bg-brand text-white font-bold rounded-lg shadow-sm hover:bg-brand-hover"
        >
          Próximo: Rolas
        </button>
      </div>
    </div>
    <div v-else class="space-y-4">
      <div
        v-if="form.rolas.length > 0"
        class="flex gap-2 overflow-x-auto pb-2 mb-2 border-b border-ui-border"
      >
        <div
          v-for="r in form.rolas"
          :key="r.id"
          class="shrink-0 bg-brand-light text-brand text-xs px-3 py-1 rounded-full font-bold"
        >
          vs. {{ r.parceiro }}
        </div>
      </div>

      <div class="bg-ui-background p-4 rounded-lg border border-ui-border space-y-4">
        <h3 class="font-bold text-ui-text">Adicionar Rola</h3>

        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-2">
            <input
              v-model="rolaTemp.parceiro"
              placeholder="Nome do parceiro"
              class="w-full p-2 border border-ui-border rounded text-sm outline-none focus:border-brand bg-white"
            />
          </div>
          <div>
            <select
              v-model="rolaTemp.faixaParceiro"
              class="w-full p-2 border border-ui-border rounded text-sm outline-none bg-white"
            >
              <option v-for="f in OPCOES_FAIXA" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>
        </div>

        <div class="space-y-4 pt-2 border-t border-gray-100">
          <h4 class="text-sm font-bold text-ui-text">Finalizações</h4>

          <div class="flex gap-2 items-end bg-gray-50 p-3 rounded-lg border border-ui-border">
            <div class="flex-1">
              <label class="text-xs text-ui-muted mb-1 block">Golpe</label>
              <InputAutoComplete
                :items="LISTA_GOLPES"
                placeholder="Ex: Armlock"
                v-model="finalizacaoTemp.golpe"
              />
            </div>

            <div class="flex-1">
              <label class="text-xs text-ui-muted mb-1 block">Posição</label>
              <InputAutoComplete
                :items="LISTA_POSICOES"
                placeholder="Ex: Montada"
                v-model="finalizacaoTemp.posicao"
              />
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="addComboFinalizacao('aplicada')"
              class="flex-1 py-2 bg-green-100 text-green-700 font-bold text-sm rounded hover:bg-green-200 transition-colors cursor-pointer"
            >
              + Peguei
            </button>

            <button
              @click="addComboFinalizacao('sofrida')"
              class="flex-1 py-2 bg-red-100 text-red-700 font-bold text-sm rounded hover:bg-red-200 transition-colors cursor-pointer"
            >
              + Tomei
            </button>
          </div>

          <div class="space-y-2">
            <div v-if="rolaTemp.finalizacoes_aplicadas.length > 0" class="flex flex-wrap gap-2">
              <span class="text-xs font-bold text-green-600 self-center shrink-0">Peguei:</span>
              <span
                v-for="(item, i) in rolaTemp.finalizacoes_aplicadas"
                :key="i"
                class="bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-100 flex items-center gap-2"
              >
                {{ item }}
                <button
                  @click="removerFinalizacao('aplicada', i)"
                  class="hover:text-green-900 font-bold cursor-pointer"
                >
                  ×
                </button>
              </span>
            </div>

            <div v-if="rolaTemp.finalizacoes_sofridas.length > 0" class="flex flex-wrap gap-2">
              <span class="text-xs font-bold text-red-600 self-center shrink-0">Tomei:</span>
              <span
                v-for="(item, i) in rolaTemp.finalizacoes_sofridas"
                :key="i"
                class="bg-red-50 text-red-700 text-xs px-2 py-1 rounded border border-red-100 flex items-center gap-2"
              >
                {{ item }}
                <button
                  @click="removerFinalizacao('sofrida', i)"
                  class="hover:text-red-900 font-bold cursor-pointer"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <button
          @click="confirmarRola"
          class="w-full py-2 bg-ui-text text-white text-sm font-bold rounded hover:bg-black transition-colors cursor-pointer"
        >
          Confirmar Rola & Adicionar Outro
        </button>
      </div>
    </div>
  </div>
  <div class="pt-2 flex flex-col gap-2">
    <button
      @click="salvarTreino"
      class="w-full py-3 bg-brand text-white font-bold rounded-lg shadow-sm hover:bg-brand-hover"
    >
      Finalizar e Salvar Treino
    </button>
    <button @click="passoAtual = 1" class="text-xs text-center text-ui-muted underline">
      Voltar para dados gerais
    </button>
  </div>
</template>
