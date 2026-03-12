<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  LISTA_GOLPES,
  LISTA_POSICOES,
  OPCOES_FAIXA,
  type FaixaJiuJitsu
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

interface RolaRascunho {
  id: number;
  parceiro: string;
  faixaParceiro: FaixaJiuJitsu;
  duracao: number;
  finalizacoes_aplicadas: string[];
  finalizacoes_sofridas: string[];
}


// ESTADO: O Treino sendo criado
const form = reactive({
  data: getDataHojeLocal(),
  duracao: 60,
  observacoes: '',
  rolas: [] as RolaRascunho[], // <-- A alteração é só esse RolaRascunho[]
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
    id: Date.now(), 
    parceiro: rolaTemp.parceiro, // <-- Aqui
    faixaParceiro: rolaTemp.faixaParceiro, // <-- Aqui
    duracao: rolaTemp.duracao,
    finalizacoes_aplicadas: [...rolaTemp.finalizacoes_aplicadas],
    finalizacoes_sofridas: [...rolaTemp.finalizacoes_sofridas]
  })

  // Resetar formulário do rola temporário para o próximo parceiro
  rolaTemp.parceiro = ''
  rolaTemp.faixaParceiro = 'branca'
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
const salvarTreino = async () => {
  // 1. Se o usuário digitou um parceiro mas esqueceu de clicar em "Confirmar Rola",
  // nós empurramos para a lista automaticamente para ele não perder o dado.
  if (rolaTemp.parceiro && rolaTemp.parceiro.trim() !== '') {
    confirmarRola() 
  }

  try {
    // 2. O TRADUTOR: Montando o Payload exatamente como o Zod exige
    const payload = {
      // Como não tem campo de "tipo" e "sentimento" no seu HTML atual, 
      // enviamos valores padrão permitidos pelo seu banco para não quebrar.
      tipo: 'com_kimono', 
      sentimento: 'normal',
      
      // O Zod prefere receber datas em formato ISO
      // Se tiver data, converte. Se o input estiver vazio/undefined, manda a data de agora.
      data: form.data ? new Date(form.data).toISOString() : new Date().toISOString(),
      duracao: form.duracao,
      observacoes: form.observacoes || null,
      
      // Traduzindo a lista de rolas do Frontend para o Backend
      rolas: form.rolas.map(r => {
        let resultadoFinal = 'empate';
        let golpeFinal = null;

        // Se tem finalização aplicada, ele ganhou
        if (r.finalizacoes_aplicadas.length > 0) {
          resultadoFinal = 'finalizei';
          golpeFinal = r.finalizacoes_aplicadas[0]; // Pega o primeiro golpe
        } 
        // Se não, mas tem sofrida, ele perdeu
        else if (r.finalizacoes_sofridas.length > 0) {
          resultadoFinal = 'fui_finalizado';
          golpeFinal = r.finalizacoes_sofridas[0];
        }

        return {
          nomeParceiro: r.parceiro, // <-- Puxa de r.parceiro
          graduacaoParceiro: r.faixaParceiro, // <-- Puxa de r.faixaParceiro
          duracao: r.duracao,
          resultado: resultadoFinal,
          formaFinalizacao: golpeFinal,
          notas: null
        }
      })
    }

    console.log('PACOTE SAINDO DO FRONTEND:', JSON.stringify(payload, null, 2))

    // 3. Disparando o POST real para a nossa API
    const resposta = await $fetch('/api/treinos', {
      method: 'POST',
      body: payload
    })

    console.log('Treino salvo no banco com sucesso!', resposta)

    // 4. Avisa a tela principal que deu certo! 
    // (Não precisamos mais mandar o objeto falso, a tela principal vai dar o refresh)
    emit('save')
    
  } catch (error: any) {
    // Se o Zod barrar, o ofetch captura o erro aqui
    console.error('Erro na validação do Zod:', error.data)
    alert('Ops! Não foi possível salvar. Verifique o console.')
  }
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
              <option v-for="f in OPCOES_FAIXA" :key="f.value" :value="f.value">{{ f.label }}</option>
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
