import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Carrega variáveis do .env
config();

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // Usa DATABASE_URL do Neon
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/bjj_diario'
  },
  verbose: true,
  strict: true,
});
