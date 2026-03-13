import type { AdapterAccountType } from '@auth/core/adapters';
import { boolean, integer, pgTable, primaryKey, real, text, timestamp } from 'drizzle-orm/pg-core';
import { faixaEnum } from './enums'; // Importamos o enum do outro arquivo

// A TABELA FUNDIDA: Padrão Auth.js + Seu código de Jiu-Jitsu
export const users = pgTable('user', {
  // Padrão obrigatório do Auth.js
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  
  // Suas colunas de Jiu-Jitsu injetadas aqui
  faixa: faixaEnum('faixa').notNull().default('branca'),
  graus: integer('graus').notNull().default(0),
  equipe: text('equipe'),
  pesoAtual: real('peso_atual'),
  dataCadastro: timestamp('data_cadastro').defaultNow().notNull(),
  ativo: boolean('ativo').default(true).notNull()
})


export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

// Tabela de Sessões Ativas
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// Tabela para links mágicos (Login por email)
export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)