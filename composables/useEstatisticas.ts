import { computed, type Ref } from 'vue';
import type { Treino } from '../utils/types';

export function useEstatisticas(treinos: Ref<Treino[]>) {



    // 1. Contagens Básicas
    const totalTreinos = computed(() => treinos.value.length)

    const horasTotais = computed(() => {
        const minutos = treinos.value.reduce((acc, t) => acc + t.duracao, 0)
        return (minutos / 60).toFixed(1) // Ex: 12.5 horas
    })

   const todasRolas = computed(() => {
    return treinos.value.flatMap(treino => treino.rolas || [])
  })

  // 3. Finalizações (Feitas)
  const totalFinalizacoesFeitas = computed(() => {
    return todasRolas.value.filter(rola => rola.resultado === 'finalizei').length
  })

   const totalFinalizacoesTomadas = computed(() => {
    return todasRolas.value.filter(rola => rola.resultado === 'fui_finalizado').length
  })

  // 4. Finalizações (Tomadas)
 const calcularMaisFrequente = (rolasFiltradas: any[]) => {
    const contagem: Record<string, number> = {}
    let maisFrequente = 'Nenhum'
    let maxCount = 0

    rolasFiltradas.forEach(rola => {
      // Só conta se realmente teve uma formaFinalizacao preenchida (não nula)
      if (rola.formaFinalizacao) {
        const golpe = rola.formaFinalizacao
        contagem[golpe] = (contagem[golpe] || 0) + 1

        if (contagem[golpe] > maxCount) {
          maxCount = contagem[golpe]
          maisFrequente = `${golpe} (${maxCount})`
        }
      }
    })

    return maisFrequente
  }

  const golpeMaisForte = computed(() => {
    const vitorias = todasRolas.value.filter(rola => rola.resultado === 'finalizei')
    return calcularMaisFrequente(vitorias)
  })

  // 6. O que mais pega você (Filtra onde o resultado foi 'fui_finalizado')
  const pontoFraco = computed(() => {
    const derrotas = todasRolas.value.filter(rola => rola.resultado === 'fui_finalizado')
    return calcularMaisFrequente(derrotas)
  })

   return {
    totalTreinos,
    horasTotais,    
    totalFinalizacoesFeitas,
    totalFinalizacoesTomadas,
    golpeMaisForte,
    pontoFraco
  }
}