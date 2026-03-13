import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as authSchema from './schemas/auth';
import * as treinosSchema from './schemas/treinos';



// Configuração da conexão com o banco de dados
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bjj_diario';

// Criar cliente PostgreSQL
const client = postgres(connectionString, {
  max: 10, // número máximo de conexões no pool
  idle_timeout: 20, // tempo em segundos antes de fechar conexões ociosas
  connect_timeout: 10, // tempo em segundos para tentar conectar
});

// Criar instância do Drizzle
export const db = drizzle(client, { 
  schema: { 
    ...authSchema, 
    ...treinosSchema 
  } 
});

// Exportar tipos
export * from './schemas/auth';
export * from './schemas/treinos';

