import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp
} from 'drizzle-orm/pg-core';
import { users } from './auth';
import { faixaEnum, resultadoRolaEnum, sentimentoEnum, tipoTreinoEnum } from './enums';


// ==================== TABELAS ====================

// Tabela de treinos
export const treinos = pgTable('treinos', {

  id: serial('id').primaryKey(),
  usuarioId: text('usuario_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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

export const treinosRelations = relations(treinos, ({ one, many }) => ({
  usuario: one(users, {
    fields: [treinos.usuarioId],
    references: [users.id]
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

export type Usuario = typeof users.$inferSelect;
export type NovoUsuario = typeof users.$inferInsert;

export type Treino = typeof treinos.$inferSelect;
export type NovoTreino = typeof treinos.$inferInsert;

export type Rola = typeof rolas.$inferSelect;
export type NovaRola = typeof rolas.$inferInsert;

export type Faixa = typeof faixas.$inferSelect;
export type NovaFaixa = typeof faixas.$inferInsert;
