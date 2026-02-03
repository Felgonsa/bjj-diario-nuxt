import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Configuração da conexão com o banco de dados
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bjj_diario';

// Criar cliente PostgreSQL
const client = postgres(connectionString, {
  max: 10, // número máximo de conexões no pool
  idle_timeout: 20, // tempo em segundos antes de fechar conexões ociosas
  connect_timeout: 10, // tempo em segundos para tentar conectar
});

// Criar instância do Drizzle
export const db = drizzle(client, { schema });

// Exportar tipos
export { faixas, rolas, treinos, usuarios } from './schema';
export type { Faixa, NovaFaixa, NovaRola, NovoTreino, NovoUsuario, Rola, Treino, Usuario } from './schema';
