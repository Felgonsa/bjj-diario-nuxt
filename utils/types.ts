// Tipos compatíveis com o frontend e backend
// Re-exportação dos tipos do Drizzle para uso no frontend

// Tipos de faixa (mantendo compatibilidade com o frontend)
export type FaixaJiuJitsu =
  | 'branca'
  | 'cinza_com_branca'
  | 'cinza'
  | 'cinza_com_preta'
  | 'amarela_com_branca'
  | 'amarela'
  | 'amarela_com_preta'
  | 'laranja_com_branca'
  | 'laranja'
  | 'laranja_com_preta'
  | 'verde_com_branca'
  | 'verde'
  | 'verde_com_preta'
  | 'azul'
  | 'roxa'
  | 'marrom'
  | 'preta';

// Tipos para o frontend (compatíveis com os do Drizzle)
export interface UsuarioFrontend {
  id: string
  nome: string
  email: string
  faixa: FaixaJiuJitsu
  graus: number
  equipe?: string
  pesoAtual?: number
  dataCadastro: string
}

export interface TreinoFrontend {
  id: number 
  usuarioId: string
  data: string | string
  duracao: number // minutos
  tipo: 'com_kimono' | 'sem_kimono' | 'drills' | 'open_mat'
  professor?: string | null
  tecnicasAprendidas?: string | null
  sentimento?: 'cansado' | 'forte' | 'destruido' | 'tecnico' | 'normal' | null
  observacoes?: string | null
  rolas: RolaFrontend[]
}

export interface RolaFrontend {
  id: string
  treinoId: string
  nomeParceiro: string
  graduacaoParceiro: FaixaJiuJitsu
  resultado: 'finalizei' | 'fui_finalizado' | 'empate'
  formaFinalizacao?: string | null
  notas?: string | null
  duracao?: number | null // minutos
}

// Constantes para o frontend
export const OPCOES_FAIXA = [
  { value: 'branca', label: 'Branca' },
  { value: 'cinza_com_branca', label: 'Cinza com Branca' },
  { value: 'cinza', label: 'Cinza' },
  { value: 'cinza_com_preta', label: 'Cinza com Preta' },
  { value: 'amarela_com_branca', label: 'Amarela com Branca' },
  { value: 'amarela', label: 'Amarela' },
  { value: 'amarela_com_preta', label: 'Amarela com Preta' },
  { value: 'laranja_com_branca', label: 'Laranja com Branca' },
  { value: 'laranja', label: 'Laranja' },
  { value: 'laranja_com_preta', label: 'Laranja com Preta' },
  { value: 'verde_com_branca', label: 'Verde com Branca' },
  { value: 'verde', label: 'Verde' },
  { value: 'verde_com_preta', label: 'Verde com Preta' },
  { value: 'azul', label: 'Azul' },
  { value: 'roxa', label: 'Roxa' },
  { value: 'marrom', label: 'Marrom' },
  { value: 'preta', label: 'Preta' }
];

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
