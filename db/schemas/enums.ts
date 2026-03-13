// ==================== ENUMS ====================

import { pgEnum } from "drizzle-orm/pg-core";

// Enum para faixas de Jiu-Jitsu
export const faixaEnum = pgEnum('faixa', [
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

// Enum para tipo de treino
export const tipoTreinoEnum = pgEnum('tipo_treino', [
  'com_kimono',
  'sem_kimono', 
  'drills',
  'open_mat'
]);

// Enum para resultado da rola
export const resultadoRolaEnum = pgEnum('resultado_rola', [
  'finalizei',
  'fui_finalizado',
  'empate'
]);

// Enum para sentimento do treino
export const sentimentoEnum = pgEnum('sentimento', [
  'cansado',
  'forte',
  'destruido',
  'tecnico',
  'normal'
]);