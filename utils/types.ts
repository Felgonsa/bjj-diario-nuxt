// Tipos compatíveis com o frontend e backend
// Re-exportação dos tipos do Drizzle para uso no frontend

// Tipos de faixa (mantendo compatibilidade com o frontend)
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

// Tipos para o frontend (compatíveis com os do Drizzle)
export interface UsuarioFrontend {
  id: number
  nome: string
  email: string
  faixa: FaixaJiuJitsu
  graus: number
  equipe?: string
  pesoAtual?: number
  dataCadastro: Date
}

export interface TreinoFrontend {
  id: number
  usuarioId: number
  data: Date
  duracao: number // minutos
  tipo: 'com_kimono' | 'sem_kimono' | 'drills' | 'open_mat'
  professor?: string
  tecnicasAprendidas?: string
  sentimento?: 'cansado' | 'forte' | 'destruido' | 'tecnico' | 'normal'
  observacoes?: string
  rolas: RolaFrontend[]
}

export interface RolaFrontend {
  id: number
  treinoId: number
  nomeParceiro: string
  graduacaoParceiro: FaixaJiuJitsu
  resultado: 'finalizei' | 'fui_finalizado' | 'empate'
  formaFinalizacao?: string
  notas?: string
  duracao?: number // minutos
}

// Constantes para o frontend
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

// Tipos para formulários (mantendo compatibilidade com componentes existentes)
export interface TreinoFormData {
  data: string
  duracao: number
  observacoes: string
  rolas: Array<{
    parceiro: string
    faixaParceiro: FaixaJiuJitsu
    duracao: number
    finalizacoes_aplicadas: string[]
    finalizacoes_sofridas: string[]
  }>
}

// Aliases para compatibilidade (se componentes existentes usam esses nomes)
export type Usuario = UsuarioFrontend
export type Treino = TreinoFrontend
export type Rola = RolaFrontend
