<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  items: string[]
  placeholder?: string
  modelValue?: string
}>()

const emit = defineEmits(['select', 'update:modelValue'])

const texto = ref(props.modelValue || '')

watch(
  () => props.modelValue,
  (novoValor) => {
    texto.value = novoValor || ''
  },
)

const mostrarSugestoes = ref(false)
const sugestoes = computed(() => {
  if (!props.items) return []

  if (texto.value.length < 1) return props.items

  const termo = texto.value.toLowerCase()
  return props.items.filter((item) => item.toLowerCase().includes(termo))
})

const fecharSugestoes = () => {
  setTimeout(() => {
    mostrarSugestoes.value = false
  }, 200)
}

const selecionar = (valor: string) => {
  texto.value = valor
  mostrarSugestoes.value = false
  emit('select', valor) // Avisa o pai que escolheu
  emit('update:modelValue', valor) // Atualiza o v-model
}

const abrirLista = () => {
  mostrarSugestoes.value = true
}
</script>
<template>
  <div class="relative w-full">
    <input
      v-model="texto"
      @focus="abrirLista"
      @click="abrirLista"
      @blur="fecharSugestoes"
      :placeholder="placeholder"
      class="w-full p-2 text-sm border border-ui-border rounded outline-none focus:border-brand bg-white relative z-10"
      autocomplete="off"
    />

    <ul
      v-if="mostrarSugestoes && sugestoes.length > 0"
      class="absolute z-50 w-full bg-white border border-ui-border rounded shadow-lg max-h-40 overflow-y-auto mt-1 left-0"
    >
      <li
        v-for="item in sugestoes"
        :key="item"
        @mousedown="selecionar(item)"
        class="px-3 py-2 text-sm text-ui-text hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-0"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
