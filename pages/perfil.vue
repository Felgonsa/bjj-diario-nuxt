<script setup lang="ts">
// 1. Puxando a sessão global do Google
const { data: session } = useAuth()
const user = computed(() => session.value?.user)

// 2. Estado do formulário reativo (agora usando o padrão CamelCase do Zod do Cline)
const isSaving = ref(false)
const form = ref({
  dataNascimento: '' as string | undefined, 
  faixa: 'branca' as string | undefined,
  graus: 0 as number | undefined,
  dataUltimaGraduacao: '' as string | undefined,
  altura: null as number | null | undefined,
  pesoAtual: null as number | null | undefined,
  pesoMeta: null as number | null | undefined
})

// 3. O "Observador" - Busca os dados no banco
const carregarDados = async () => {
  try {
    // O Nuxt devolve um 'data'. O Cline devolve { success, data: { ... } }
    // Então renomeamos para 'respostaApi' para não confundir
    const { data: respostaApi, error } = await useFetch('/api/perfil')
    
    if (respostaApi.value?.success && respostaApi.value.data) {
      const perfil = respostaApi.value.data
      
      // Atualiza o form com os dados exatos do banco
      form.value = {
        dataNascimento: perfil.dataNascimento ? perfil.dataNascimento.split('T')[0] : '',
        faixa: perfil.faixa || 'branca',
        graus: perfil.graus || 0,
        dataUltimaGraduacao: perfil.dataUltimaGraduacao ? perfil.dataUltimaGraduacao.split('T')[0] : '', 
        altura: perfil.altura || null,
        pesoAtual: perfil.pesoAtual || null,
        pesoMeta: perfil.pesoMeta || null
      }
    }
  } catch (err) {
    console.error('Erro ao carregar perfil', err)
  }
}

await carregarDados()

// 4. O "Executor" - Envia os dados para salvar
const salvarPerfil = async () => {
  isSaving.value = true
  try {
    const resposta = await $fetch('/api/perfil', {
      method: 'PUT',
     
      body: form.value
    })
    
    alert('Perfil atualizado com sucesso no tatame!') 
  } catch (error: any) {
    console.error('Erro ao salvar', error)
    // Se o Zod barrar (erro 400), a gente mostra pro usuário
    if (error.response?.status === 400) {
      alert('Atenção: ' + error.response._data.statusMessage)
    } else {
      alert('Erro ao salvar o perfil.')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Meu Perfil de Combate</h1>

    <div class="flex items-center space-x-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <img :src="user?.image || '/avatar-default.png'" alt="Foto de Perfil" class="w-16 h-16 rounded-full border-2 border-blue-500">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ user?.name }}</h2>
        <p class="text-gray-500">{{ user?.email }}</p>
      </div>
    </div>

    <form @submit.prevent="salvarPerfil" class="space-y-6">
      
      <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 class="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Jornada no Tatame</h3>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <input type="date" v-model="form.dataNascimento" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Faixa</label>
            <select v-model="form.faixa" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="branca">Branca</option>
              <option value="azul">Azul</option>
              <option value="roxa">Roxa</option>
              <option value="marrom">Marrom</option>
              <option value="preta">Preta</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Graus</label>
            <select v-model="form.graus" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
              <option :value="0">0</option>
              <option :value="1">1</option>
              <option :value="2">2</option>
              <option :value="3">3</option>
              <option :value="4">4</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Última Graduação</label>
            <input type="date" v-model="form.dataUltimaGraduacao" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 class="text-lg font-medium text-gray-700 mb-4 border-b pb-2">Medidas e Metas</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
            <input type="number" v-model="form.altura" placeholder="Ex: 186" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Peso Atual (kg)</label>
            <input type="number" step="0.1" v-model="form.pesoAtual" placeholder="Ex: 102.0" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Peso Meta (kg)</label>
            <input type="number" step="0.1" v-model="form.pesoMeta" placeholder="Ex: 90.0" class="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-3 mt-8">
        <button type="button" @click="carregarDados" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button type="submit" :disabled="isSaving" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center">
          <span v-if="isSaving">Salvando...</span>
          <span v-else>Salvar Perfil</span>
        </button>
      </div>

    </form>
  </div>
</template>