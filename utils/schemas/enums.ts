import { z } from 'zod';

// Enums baseados no schema do Drizzle
export const FaixaSchema = z.enum([
  'branca',
  'cinza_com_branca',
  'cinza',
  'cinza_com_preta',
  'amarela_com_branca',
  'amarela',
  'amarela_com_preta',
  'laranja_com_branca',
  'laranja',
  'laranja_com_preta',
  'verde_com_branca',
  'verde',
  'verde_com_preta',
  'azul',
  'roxa',
  'marrom',
  'preta'
]);

export const TipoTreinoSchema = z.enum([
  'com_kimono',
  'sem_kimono',
  'drills',
  'open_mat'
]);

export const ResultadoRolaSchema = z.enum([
  'finalizei',
  'fui_finalizado',
  'empate'
]);

export const SentimentoSchema = z.enum([
  'cansado',
  'forte',
  'destruido',
  'tecnico',
  'normal'
]);

// Tipos inferidos dos schemas
export type Faixa = z.infer<typeof FaixaSchema>;
export type TipoTreino = z.infer<typeof TipoTreinoSchema>;
export type ResultadoRola = z.infer<typeof ResultadoRolaSchema>;
export type Sentimento = z.infer<typeof SentimentoSchema>;