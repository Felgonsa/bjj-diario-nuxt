<template>
  <div class="min-h-screen bg-white pb-28">
    
    <header class="p-4 border-b border-gray-100 flex items-center sticky top-0 bg-white z-40">
      <button @click="voltarParaHome" class="mr-4 text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-800">Registrar Novo Treino</h1>
    </header>

    <main class="p-4 max-w-3xl mx-auto">
      <TreinoForm @salvo="voltarParaHome" @cancelar="voltarParaHome" />
    </main>

  </div>
</template>

<script setup lang="ts">
// 1. Puxamos o roteador do Nuxt
const router = useRouter()

// 2. Criamos a função que empurra o usuário de volta para o histórico
const voltarParaHome = () => {
  router.push('/')
}
</script>