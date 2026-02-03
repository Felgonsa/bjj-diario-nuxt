import { computed, type Ref } from 'vue'
import type { Treino } from '../utils/types'

export function useEstatisticas(treinos: Ref<Treino[]>) {

    // 1. Contagens Básicas
    const totalTreinos = computed(() => treinos.value.length)

    const horasTotais = computed(() => {
        const minutos = treinos.value.reduce((acc, t) => acc + t.duracao, 0)
        return (minutos / 60).toFixed(1) // Ex: 12.5 horas
    })

    // 2. Agregando todas as finalizações em um array só
    const todasAplicadas = computed(() =>
        treinos.value.flatMap(t => t.rolas.flatMap(r => r.finalizacoes_aplicadas))
    )

    const todasSofridas = computed(() =>
        treinos.value.flatMap(t => t.rolas.flatMap(r => r.finalizacoes_sofridas))
    )

    const totalFinalizacoesFeitas = computed(() => todasAplicadas.value.length)
    const totalFinalizacoesTomadas = computed(() => todasSofridas.value.length)

    // 3. Função Mágica para achar o item mais frequente (A "Moda")
    const encontrarMaisFrequente = (lista: string[]) => {
        if (lista.length === 0) return '-'

        const contagem: Record<string, number> = {}
        let maxItem = ''
        let maxCount = 0

        // Limpa a string da posição para contar só o golpe? 
        // Ex: "Armlock (Guarda)" virar só "Armlock"?
        // Por enquanto vamos contar EXATO: "Armlock (Guarda)" é diferente de "Armlock (Montada)"
        // Isso é bom para saber ONDE você é forte.

        for (const item of lista) {
            contagem[item] = (contagem[item] || 0) + 1
            if (contagem[item] > maxCount) {
                maxCount = contagem[item]
                maxItem = item
            }
        }

        return `${maxItem} (${maxCount})`
    }

    const golpeMaisForte = computed(() => encontrarMaisFrequente(todasAplicadas.value))
    const pontoFraco = computed(() => encontrarMaisFrequente(todasSofridas.value))

    return {
        totalTreinos,
        horasTotais,
        totalFinalizacoesFeitas,
        totalFinalizacoesTomadas,
        golpeMaisForte,
        pontoFraco
    }
}