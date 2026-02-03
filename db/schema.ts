import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';

// ==================== ENUMS ====================

// Enum para faixas de Jiu-Jitsu
export const faixaEnum = pgEnum('faixa', [
  'branca',
  'cinza', 
  'amarela',
  'laranja',
  'verde',
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

// ==================== TABELAS ====================

// Tabela de usuários
export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senha: text('senha').notNull(),
  faixa: faixaEnum('faixa').notNull().default('branca'),
  graus: integer('graus').notNull().default(0),
  equipe: text('equipe'),
  pesoAtual: real('peso_atual'),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  dataAtualizacao: timestamp('data_atualizacao').defaultNow().notNull(),
  ativo: boolean('ativo').default(true).notNull()
});

// Tabela de treinos
export const treinos = pgTable('treinos', {
  id: serial('id').primaryKey(),
  usuarioId: integer('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  data: timestamp('data').notNull(),
  duracao: integer('duracao').notNull(), // em minutos
  tipo: tipoTreinoEnum('tipo').notNull(),
  professor: text('professor'),
  tecnicasAprendidas: text('tecnicas_aprendidas'),
  sentimento: sentimentoEnum('sentimento'),
  observacoes: text('observacoes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Tabela de rolas (sparring)
export const rolas = pgTable('rolas', {
  id: serial('id').primaryKey(),
  treinoId: integer('treino_id').notNull().references(() => treinos.id, { onDelete: 'cascade' }),
  nomeParceiro: text('nome_parceiro').notNull(),
  graduacaoParceiro: faixaEnum('graduacao_parceiro').notNull(),
  resultado: resultadoRolaEnum('resultado').notNull(),
  formaFinalizacao: text('forma_finalizacao'),
  notas: text('notas'),
  duracao: integer('duracao'), // duração específica desta rola em minutos
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Tabela de faixas (para referência)
export const faixas = pgTable('faixas', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull().unique(),
  categoria: text('categoria'), // ex: "adulto", "infantil"
  corHex: text('cor_hex').notNull(), // código hexadecimal da cor
  ordem: integer('ordem').notNull().unique() // ordem hierárquica
});

// ==================== RELAÇÕES ====================

export const usuariosRelations = relations(usuarios, ({ many }) => ({
  treinos: many(treinos),
}));

export const treinosRelations = relations(treinos, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [treinos.usuarioId],
    references: [usuarios.id]
  }),
  rolas: many(rolas),
}));

export const rolasRelations = relations(rolas, ({ one }) => ({
  treino: one(treinos, {
    fields: [rolas.treinoId],
    references: [treinos.id]
  }),
}));

// ==================== TIPOS ====================

export type Usuario = typeof usuarios.$inferSelect;
export type NovoUsuario = typeof usuarios.$inferInsert;

export type Treino = typeof treinos.$inferSelect;
export type NovoTreino = typeof treinos.$inferInsert;

export type Rola = typeof rolas.$inferSelect;
export type NovaRola = typeof rolas.$inferInsert;

export type Faixa = typeof faixas.$inferSelect;
export type NovaFaixa = typeof faixas.$inferInsert;