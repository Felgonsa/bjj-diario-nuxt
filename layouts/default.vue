

<script setup>
// 1. Puxando a sessão global do Google e a função de Logout
const { data: session, signOut } = useAuth()
const user = computed(() => session.value?.user)

// Função de Logout
const fazerLogout = async () => {
  // Pede confirmação rápida pro usuário não clicar sem querer
  if (confirm('Tem certeza que deseja sair do seu diário?')) {
    await signOut({ callbackUrl: '/login' })
  }
}

</script>
<template>
  <div class="min-h-screen bg-gray-100 pb-28">
    
    <header class="bg-white border-b border-gray-100 p-4 sticky top-0 z-40">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <h1 class="text-lg font-bold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Diário de Jiu-Jitsu
        </h1>
        <NuxtLink to="/perfil">
          <img :src="user?.image || '/avatar-default.png'" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-blue-100">
        </NuxtLink>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <nav class="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50 px-2">
      
      <NuxtLink to="/" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors" exact-active-class="text-blue-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-xs">Início</span>
      </NuxtLink>

      <div class="relative -top-5 flex justify-center w-full">
        <NuxtLink to="/treinos/novo" class="bg-blue-600 text-white rounded-full p-4 shadow-lg border-4 border-gray-100 hover:bg-blue-700 transition-transform transform hover:scale-105 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </NuxtLink>
      </div>

      <NuxtLink to="/perfil" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors" active-class="text-blue-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="text-xs">Perfil</span>
      </NuxtLink>

    </nav>
  </div>
</template>