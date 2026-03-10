<script setup lang="ts">
import type { Rola } from '../utils/types'; // Importamos só o tipo Rola

// Recebemos apenas o que interessa para o detalhe
const props = defineProps<{
  observacoes: string
  rolas: Rola[]
}>()


console.log('Rolas recebidas no TreinoDetalhes:', props.rolas)
</script>

<template>
  <div class="px-5 pb-5 border-t border-ui-border pt-4 animate-fade-in">
    <p class="text-ui-text text-sm mb-4 italic border-l-4 border-brand-light pl-3">
      "{{ observacoes }}"
    </p>

    <div class="space-y-3">
      <div v-for="rola in rolas" :key="rola.id" class="bg-ui-background p-3 rounded border border-ui-border text-sm">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium text-ui-text">
            vs. {{ rola.nomeParceiro }}
            <span class="text-xs font-normal text-ui-muted">({{ rola.graduacaoParceiro }})</span>
          </span>
          <span class="text-xs text-ui-muted">{{ rola.duracao }} min</span>
        </div>

        <div class="flex flex-col gap-1">
          <div v-if="!rola.formaFinalizacao" class="text-ui-muted text-xs italic">
            Treino solto
          </div>
        </div>

        <div v-if="rola.resultado === 'finalizei' && rola.formaFinalizacao" class="flex flex-wrap items-center gap-1">
          <span class="text-action-success font-bold text-xs mr-1">Peguei:</span>
          <span class="bg-green-50 text-action-success border border-green-200 text-xs px-2 py-0.5 rounded">
            {{ rola.formaFinalizacao }}
          </span>
        </div>

        <div v-if="rola.resultado === 'fui_finalizado' && rola.formaFinalizacao"
          class="flex flex-wrap items-center gap-1">
          <span class="text-action-danger font-bold text-xs mr-1">Tomei:</span>
          <span class="bg-red-50 text-action-danger border border-red-200 text-xs px-2 py-0.5 rounded">
            {{ rola.formaFinalizacao }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
