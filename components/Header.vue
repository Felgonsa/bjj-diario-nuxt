<script setup lang="ts">
import { ref } from 'vue'

const usuario = ref({
  nome: 'Felipe',
  faixa: 'Azul',
  avatar: 'FP',
})
</script>

<template>
  <header class="bg-ui-surface border-b border-ui-border sticky top-0 z-20 shadow-sm">
    <div
      class="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <div class="flex items-center gap-3">
        <div class="bg-brand text-white p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold text-ui-text tracking-tight leading-tight">
            Diário de Jiu-Jitsu
          </h1>
          <p class="text-xs text-ui-muted">Painel de Controle</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-semibold text-ui-text">{{ usuario.nome }}</p>
          <span
            class="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full inline-block"
          >
            Faixa {{ usuario.faixa }}
          </span>
        </div>
        <div
          class="h-10 w-10 rounded-full bg-ui-background border border-ui-border flex items-center justify-center text-ui-muted font-bold"
        >
          {{ usuario.avatar }}
        </div>
      </div>
    </div>
  </header>
</template>
