// src/types.ts


export type FaixaJiuJitsu =
    | 'Branca'
    | 'Cinza'
    | 'Amarela'
    | 'Laranja'
    | 'Verde'
    | 'Azul'
    | 'Roxa'
    | 'Marrom'
    | 'Preta'


export interface Usuario {
    id: string
    nome: string
    email: string
    faixa: FaixaJiuJitsu
    dataCadastro: Date

}

export interface Treino {
    id: string
    data: Date | string
    duracao: number // min
    observacoes: string
    rolas: Rola[] //rolas feitos no treino
}

export interface Rola {
    id: string
    parceiro: string
    duracao: number // min
    faixaParceiro: FaixaJiuJitsu
    finalizacoes_aplicadas: string[]
    finalizacoes_sofridas: string[]
}


// constantes

export const OPCOES_FAIXA: FaixaJiuJitsu[] = [
    'Branca',
    'Cinza',
    'Amarela',
    'Laranja',
    'Verde',
    'Azul',
    'Roxa',
    'Marrom',
    'Preta'
]

export const LISTA_GOLPES = [
    // Estrangulamentos
    'Mata-leão',
    'Guilhotina',
    'Katagatame',
    'Triângulo',
    'Triângulo de Mão',
    'Ezequiel',
    'Relógio',
    'Estrangulamento',
    'Estrangulamento Norte-Sul',
    'Estrangulamento Cruzado',
    'Arco e Flecha',
    'Loop Choke',
    'Baseball Choke',

    // Membros Superiores
    'Armlock',
    'Kimura',
    'Americana',
    'Omoplata',
    'Chave de Pulso (Mão de Vaca)',
    'Chave de Bíceps',

    // Membros Inferiores
    'Chave de Pé Reta (Botinha)',
    'Chave de Panturrilha',
    'Mata-leão no Pé',
    'Estima Lock',
    'Chave de Joelho (Kneebar)',
    'Toe Hold (Mata-leão de pé)',
    'Heel Hook (Chave de Calcanhar)'
].sort()

// Adicione isso ao final do arquivo
export const LISTA_POSICOES = [
    'Guarda Fechada',
    'Guarda Aberta',
    'Meia Guarda',
    '100kg',
    'Montada',
    'Costas',
    'Norte-Sul',
    'Joelho na Barriga',
    'Em pé',
    'Tartaruga (4 apoios)'
].sort()